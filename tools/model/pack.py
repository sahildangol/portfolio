"""Pack the guide model (glTF + .bin + PNG textures) into one small .glb for the web.

- keeps only the "city_idle" animation (the second idle clip is never played)
- drops the hidden dagger and effect meshes (materials "..._3-2" and "FX_...")
- repacks only the data that is still referenced
- re-encodes textures as JPEG (none of them use alpha)

usage: pack.py public/models/guide public/models/guide.glb
needs: numpy, pillow
"""
import io
import json
import os
import struct
import sys

from PIL import Image

COMP_SIZE = {5120: 1, 5121: 1, 5122: 2, 5123: 2, 5125: 4, 5126: 4}
NCOMP = {"SCALAR": 1, "VEC2": 2, "VEC3": 3, "VEC4": 4, "MAT2": 4, "MAT3": 9, "MAT4": 16}


def main():
    src_dir, out_path = sys.argv[1], sys.argv[2]
    g = json.load(open(os.path.join(src_dir, "scene.gltf")))
    src_bin = open(os.path.join(src_dir, g["buffers"][0]["uri"]), "rb").read()

    # 1. animations
    g["animations"] = [a for a in g.get("animations", []) if a["name"] == "city_idle"]

    # 2. meshes
    drop_mat = {i for i, m in enumerate(g["materials"]) if m["name"].startswith("FX_") or m["name"].endswith("_3-2")}
    kept, mesh_map = [], {}
    for i, m in enumerate(g["meshes"]):
        if any(p.get("material") in drop_mat for p in m["primitives"]):
            continue
        mesh_map[i] = len(kept)
        kept.append(m)
    for n in g["nodes"]:
        if "mesh" in n:
            if n["mesh"] in mesh_map:
                n["mesh"] = mesh_map[n["mesh"]]
            else:
                del n["mesh"]
                n.pop("skin", None)
    g["meshes"] = kept

    # 3. accessors still in use
    used = set()
    for m in g["meshes"]:
        for p in m["primitives"]:
            used.update(p["attributes"].values())
            if "indices" in p:
                used.add(p["indices"])
            for t in p.get("targets", []):
                used.update(t.values())
    for s in g.get("skins", []):
        if "inverseBindMatrices" in s:
            used.add(s["inverseBindMatrices"])
    for a in g["animations"]:
        for smp in a["samplers"]:
            used.update((smp["input"], smp["output"]))

    out_bin = bytearray()
    views, accessors, amap = [], [], {}

    def pad4():
        while len(out_bin) % 4:
            out_bin.append(0)

    for old in sorted(used):
        a = g["accessors"][old]
        assert "sparse" not in a, "sparse accessors not supported"
        bv = g["bufferViews"][a["bufferView"]]
        es = COMP_SIZE[a["componentType"]] * NCOMP[a["type"]]
        stride = bv.get("byteStride") or es
        start = bv.get("byteOffset", 0) + a.get("byteOffset", 0)
        if stride == es:
            data = src_bin[start : start + es * a["count"]]
        else:
            data = b"".join(src_bin[start + i * stride : start + i * stride + es] for i in range(a["count"]))
        pad4()
        view = {"buffer": 0, "byteOffset": len(out_bin), "byteLength": len(data)}
        if "target" in bv:
            view["target"] = bv["target"]
        out_bin += data
        views.append(view)
        na = {k: v for k, v in a.items() if k != "byteOffset"}
        na["bufferView"] = len(views) - 1
        amap[old] = len(accessors)
        accessors.append(na)

    for m in g["meshes"]:
        for p in m["primitives"]:
            p["attributes"] = {k: amap[v] for k, v in p["attributes"].items()}
            if "indices" in p:
                p["indices"] = amap[p["indices"]]
            if "targets" in p:
                p["targets"] = [{k: amap[v] for k, v in t.items()} for t in p["targets"]]
    for s in g.get("skins", []):
        if "inverseBindMatrices" in s:
            s["inverseBindMatrices"] = amap[s["inverseBindMatrices"]]
    for a in g["animations"]:
        for smp in a["samplers"]:
            smp["input"] = amap[smp["input"]]
            smp["output"] = amap[smp["output"]]

    # 4. textures -> JPEG, embedded
    for img in g["images"]:
        uri = img["uri"]
        im = Image.open(os.path.join(src_dir, uri)).convert("RGB")
        buf = io.BytesIO()
        im.save(buf, "JPEG", quality=90 if "normal" in uri else 86, optimize=True)
        data = buf.getvalue()
        pad4()
        views.append({"buffer": 0, "byteOffset": len(out_bin), "byteLength": len(data)})
        out_bin += data
        img.clear()
        img["bufferView"] = len(views) - 1
        img["mimeType"] = "image/jpeg"
    pad4()

    g["accessors"], g["bufferViews"] = accessors, views
    g["buffers"] = [{"byteLength": len(out_bin)}]

    js = json.dumps(g, separators=(",", ":")).encode()
    js += b" " * (-len(js) % 4)
    total = 12 + 8 + len(js) + 8 + len(out_bin)
    with open(out_path, "wb") as f:
        f.write(struct.pack("<III", 0x46546C67, 2, total))
        f.write(struct.pack("<II", len(js), 0x4E4F534A) + js)
        f.write(struct.pack("<II", len(out_bin), 0x004E4942) + out_bin)
    print(f"wrote {out_path}: {total / 1e6:.2f} MB (json {len(js) / 1e3:.0f} KB, bin {len(out_bin) / 1e6:.2f} MB)")


main()
