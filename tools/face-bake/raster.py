"""Tiny triangle rasterizer helpers (numpy)."""
import numpy as np


def bary_fill(dst_tri, size):
    """Yield (xs, ys, bary[N,3]) for pixels covered by a 2D triangle in pixel coords."""
    w, h = size
    x0, y0 = np.floor(dst_tri.min(0)).astype(int)
    x1, y1 = np.ceil(dst_tri.max(0)).astype(int)
    x0, y0 = max(x0, 0), max(y0, 0)
    x1, y1 = min(x1, w - 1), min(y1, h - 1)
    if x1 < x0 or y1 < y0:
        return None
    xs, ys = np.meshgrid(np.arange(x0, x1 + 1) + 0.5, np.arange(y0, y1 + 1) + 0.5)
    pts = np.stack([xs.ravel(), ys.ravel()], 1)
    a, b, c = dst_tri
    v0, v1 = b - a, c - a
    den = v0[0] * v1[1] - v1[0] * v0[1]
    if abs(den) < 1e-12:
        return None
    d = pts - a
    l1 = (d[:, 0] * v1[1] - v1[0] * d[:, 1]) / den
    l2 = (v0[0] * d[:, 1] - d[:, 0] * v0[1]) / den
    l0 = 1 - l1 - l2
    eps = -0.02
    m = (l0 >= eps) & (l1 >= eps) & (l2 >= eps)
    if not m.any():
        return None
    bary = np.stack([l0, l1, l2], 1)[m]
    return (pts[m, 0] - 0.5).astype(int), (pts[m, 1] - 0.5).astype(int), bary


def sample(img, xy):
    """Bilinear sample float image HxWxC at float pixel coords xy[N,2]."""
    h, w = img.shape[:2]
    x = np.clip(xy[:, 0] - 0.5, 0, w - 1.001)
    y = np.clip(xy[:, 1] - 0.5, 0, h - 1.001)
    x0, y0 = x.astype(int), y.astype(int)
    fx, fy = (x - x0)[:, None], (y - y0)[:, None]
    a = img[y0, x0]
    b = img[y0, x0 + 1]
    c = img[y0 + 1, x0]
    d = img[y0 + 1, x0 + 1]
    return a * (1 - fx) * (1 - fy) + b * fx * (1 - fy) + c * (1 - fx) * fy + d * fx * fy
