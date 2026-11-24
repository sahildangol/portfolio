"""Render the head of mesh 1 (and optionally hair mesh 0) from the front, textured.

usage: render_front.py scene.gltf tools_dir texture_png out_png [res]
Front view: image x = +X (model's left on the viewer's right), image y = -Y. Range fixed
so the same mapping can be reused by bake.py.
"""
import sys

import numpy as np
from PIL import Image

sys.path.insert(0, sys.argv[2])
from gltfmesh import Gltf  # noqa: E402
from raster import bary_fill, sample  # noqa: E402

RES = int(sys.argv[5]) if len(sys.argv) > 5 else 512
XR = (-0.11, 0.11)
YR = (1.46, 1.68)


def to_px(p):
    x = (p[:, 0] - XR[0]) / (XR[1] - XR[0]) * RES
    y = (YR[1] - p[:, 1]) / (YR[1] - YR[0]) * RES
    return np.stack([x, y], 1)


def main():
    g = Gltf(sys.argv[1])
    names = g.joint_names()
    head_j = [i for i, n in enumerate(names) if n.startswith("Bip001 Head")]
    tex = np.asarray(Image.open(sys.argv[3]).convert("RGB"), dtype=np.float32) / 255
    th, tw = tex.shape[:2]
    p = g.prim(1)
    pos, uv, idx = p["POSITION"], p["TEXCOORD_0"], p["indices"]
    dom = p["JOINTS_0"][np.arange(len(pos)), p["WEIGHTS_0"].argmax(1)]
    head = np.isin(dom, head_j)
    img = np.zeros((RES, RES, 3), np.float32)
    zbuf = np.full((RES, RES), -1e9, np.float32)
    px = to_px(pos)
    for t in idx:
        if pos[t][:, 1].min() < 1.44:
            continue
        a, b, c = pos[t]
        n = np.cross(b - a, c - a)
        if n[2] <= 0:
            continue
        r = bary_fill(px[t], (RES, RES))
        if r is None:
            continue
        xs, ys, bc = r
        z = bc @ pos[t][:, 2]
        m = z > zbuf[ys, xs]
        if not m.any():
            continue
        xs, ys, bc, z = xs[m], ys[m], bc[m], z[m]
        tuv = bc @ uv[t]
        img[ys, xs] = sample(tex, tuv * [tw, th])
        zbuf[ys, xs] = z
    Image.fromarray((img * 255).clip(0, 255).astype(np.uint8)).save(sys.argv[4])
    print("saved", sys.argv[4])


main()
