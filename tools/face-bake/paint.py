"""Repaint Gusion's face in its own painted style, nudged toward Sahil's features.

Keeps the original texture (and its hand-painted shading) and layers on:
  - warm tan skin tone (from the reference photo's cheeks)
  - near-black hair / scalp
  - thick, straight dark brows
  - dark-brown irises
  - slightly fuller, warmer lips
Paint strokes are drawn in the front-view space of render_front.py and projected onto the
mirrored face UVs, so they land symmetrically.

usage: paint.py scene.gltf tools_dir photo.jpg tex2_in tex2_out tex1_in tex1_out
"""
import colorsys
import sys

import numpy as np
from PIL import Image, ImageDraw, ImageFilter

sys.path.insert(0, sys.argv[2])
from gltfmesh import Gltf  # noqa: E402
from raster import bary_fill, sample  # noqa: E402

RES, XR, YR = 512, (-0.11, 0.11), (1.46, 1.68)


def front_px(p):
    x = (p[:, 0] - XR[0]) / (XR[1] - XR[0]) * RES
    y = (YR[1] - p[:, 1]) / (YR[1] - YR[0]) * RES
    return np.stack([x, y], 1)


def paint_layer():
    """RGBA strokes in front-view pixels (right half is what gets projected)."""
    S = 4  # supersample for smooth edges
    img = Image.new("RGBA", (RES * S, RES * S), (0, 0, 0, 0))
    d = ImageDraw.Draw(img)
    brow = (34, 24, 20, 255)
    # Thick, nearly straight brow: inner end lower and fuller, outer end tapering.
    pts = [(286, 247), (300, 238), (330, 233), (362, 231), (372, 236), (360, 239), (330, 243), (300, 249)]
    d.polygon([(x * S, y * S) for x, y in pts], fill=brow)
    # Mirror for the left half (harmless; UVs are shared)
    d.polygon([((512 - x) * S, y * S) for x, y in pts], fill=brow)
    img = img.filter(ImageFilter.GaussianBlur(1.2 * S)).resize((RES, RES), Image.LANCZOS)

    lips = Image.new("RGBA", (RES, RES), (0, 0, 0, 0))
    dl = ImageDraw.Draw(lips)
    dl.ellipse((226, 374, 286, 398), fill=(176, 98, 88, 120))
    lips = lips.filter(ImageFilter.GaussianBlur(4))
    return Image.alpha_composite(lips, img)


def main():
    _, gltf, _, photo_p, t2_in, t2_out, t1_in, t1_out = sys.argv
    g = Gltf(gltf)
    nodes = g.g["nodes"]
    joints = g.g["skins"][0]["joints"]
    under, stack = set(), [j for j in joints if nodes[j].get("name", "").startswith(("Bip001 Head", "Bip001 Neck"))]
    while stack:
        n = stack.pop()
        if n not in under:
            under.add(n)
            stack += nodes[n].get("children", [])
    head_j = [i for i, j in enumerate(joints) if j in under]

    photo = np.asarray(Image.open(photo_p).convert("RGB"), np.float32) / 255
    cheeks = np.concatenate([photo[170:190, 160:178].reshape(-1, 3), photo[170:190, 214:232].reshape(-1, 3)])
    # Match the photo's skin tone directly (warm, medium-brown); the scene lighting brightens it.
    target_skin = np.clip(np.median(cheeks, 0) * np.array([0.86, 0.83, 0.8]), 0, 1)

    tex = np.asarray(Image.open(t2_in).convert("RGB"), np.float32) / 255
    th, tw = tex.shape[:2]
    p = g.prim(1)
    pos, uv, idx = p["POSITION"].astype(np.float64), p["TEXCOORD_0"].astype(np.float64), p["indices"]
    dom = p["JOINTS_0"][np.arange(len(pos)), p["WEIGHTS_0"].argmax(1)]
    headish = np.isin(dom, head_j)
    fpx = front_px(pos)

    layer = np.asarray(paint_layer(), np.float32) / 255
    covered = np.zeros((th, tw), bool)
    paint = np.zeros((th, tw, 4), np.float32)
    for t in idx:
        if not headish[t].any() or pos[t][:, 0].mean() < -0.002:
            continue
        r = bary_fill(uv[t] * [tw, th], (tw, th))
        if r is None:
            continue
        xs, ys, bc = r
        covered[ys, xs] = True
        front = (bc @ pos[t][:, 2]) > 0.03
        s = sample(layer, bc @ fpx[t])
        s[:, 3] *= front
        paint[ys, xs] = s

    # Grow coverage a few texels so the mirrored-UV seam gets the same treatment
    for _ in range(3):
        grown = covered.copy()
        for dy, dx in ((1, 0), (-1, 0), (0, 1), (0, -1)):
            grown |= np.roll(np.roll(covered, dy, 0), dx, 1)
        covered = grown

    # Skin: shift every skin-like texel of the head island toward the target tone,
    # keeping the painted light/shadow (ratio to the island's median skin).
    hsv = np.asarray(Image.fromarray((tex * 255).astype(np.uint8)).convert("HSV"), np.float32) / 255
    skinlike = covered & (hsv[..., 2] > 0.5) & (hsv[..., 1] < 0.55)
    orig_skin = np.median(tex[skinlike], 0)
    gain = target_skin / np.maximum(orig_skin, 1e-3)
    skin_w = (covered & (hsv[..., 2] > 0.3) & (hsv[..., 1] < 0.6)).astype(np.float32)
    skin_w = np.asarray(Image.fromarray((skin_w * 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(1.2)), np.float32)[..., None] / 255
    out = tex * (1 - skin_w) + np.clip(tex * gain, 0, 1) * skin_w

    # Hair / scalp on the face island: dark maroon -> warm near-black
    dark = covered & (hsv[..., 2] < 0.42) & ((hsv[..., 0] > 0.85) | (hsv[..., 0] < 0.08))
    lum = tex.mean(2, keepdims=True)
    out = np.where(dark[..., None], np.clip(lum * np.array([0.62, 0.55, 0.52]), 0, 1), out)

    # Strokes
    a = paint[..., 3:4]
    out = out * (1 - a) + paint[..., :3] * a

    # Irises: orange/red/yellow -> dark brown, keep the painted gradient and highlight
    y0, y1, x0, x1 = 470, 500, 96, 130
    patch = out[y0:y1, x0:x1]
    for yy in range(patch.shape[0]):
        for xx in range(patch.shape[1]):
            rr, gg, bb = patch[yy, xx]
            hh, ss, vv = colorsys.rgb_to_hsv(rr, gg, bb)
            if ss > 0.35 and (hh < 0.17 or hh > 0.93) and vv > 0.2:
                k = min(1.0, vv * 1.1)
                patch[yy, xx] = np.array([0.30, 0.19, 0.13]) * (0.45 + 0.75 * k)
    out[y0:y1, x0:x1] = patch

    Image.fromarray((out * 255).clip(0, 255).astype(np.uint8)).save(t2_out)

    hair = np.asarray(Image.open(t1_in).convert("RGB"), np.float32) / 255
    hl = hair.mean(2, keepdims=True)
    Image.fromarray((np.clip(hl * np.array([0.82, 0.74, 0.70]) * 0.85, 0, 1) * 255).astype(np.uint8)).save(t1_out)
    print("skin gain", gain.round(3), "saved", t2_out, t1_out)


main()
