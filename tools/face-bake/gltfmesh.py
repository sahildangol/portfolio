"""Minimal glTF accessor reader for the Gusion model (numpy)."""
import json
import os

import numpy as np

COMP = {5120: np.int8, 5121: np.uint8, 5122: np.int16, 5123: np.uint16, 5125: np.uint32, 5126: np.float32}
NCOMP = {"SCALAR": 1, "VEC2": 2, "VEC3": 3, "VEC4": 4, "MAT4": 16}


class Gltf:
    def __init__(self, path):
        self.dir = os.path.dirname(path)
        self.g = json.load(open(path))
        self.bins = {}

    def _buf(self, i):
        if i not in self.bins:
            uri = self.g["buffers"][i]["uri"]
            self.bins[i] = open(os.path.join(self.dir, uri), "rb").read()
        return self.bins[i]

    def acc(self, i):
        a = self.g["accessors"][i]
        bv = self.g["bufferViews"][a["bufferView"]]
        dt = np.dtype(COMP[a["componentType"]])
        n = NCOMP[a["type"]]
        off = bv.get("byteOffset", 0) + a.get("byteOffset", 0)
        stride = bv.get("byteStride", 0) or dt.itemsize * n
        buf = self._buf(bv["buffer"])
        raw = np.frombuffer(buf, dtype=np.uint8, count=stride * (a["count"] - 1) + dt.itemsize * n, offset=off)
        out = np.lib.stride_tricks.as_strided(
            raw.view(dt) if stride % dt.itemsize == 0 else raw, shape=(a["count"], n), strides=(stride, dt.itemsize)
        )
        out = np.array(out)
        if a.get("normalized"):
            out = out.astype(np.float32) / np.iinfo(dt).max
        return out if n > 1 else out[:, 0]

    def prim(self, mesh_index):
        p = self.g["meshes"][mesh_index]["primitives"][0]
        at = p["attributes"]
        d = {k: self.acc(v) for k, v in at.items()}
        d["indices"] = self.acc(p["indices"]).reshape(-1, 3)
        d["material"] = p.get("material")
        return d

    def joint_names(self):
        sk = self.g["skins"][0]
        return [self.g["nodes"][j].get("name") for j in sk["joints"]]

    def inverse_bind(self):
        sk = self.g["skins"][0]
        return self.acc(sk["inverseBindMatrices"]).reshape(-1, 4, 4).transpose(0, 2, 1)  # column-major -> row
