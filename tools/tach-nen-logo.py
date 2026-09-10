# -*- coding: utf-8 -*-
"""
Tach nen 04 logo cong cu AI trong assets/ thanh PNG nen trong.

Cach dung: luu 04 anh logo (chup man hinh cung duoc) vao assets/ dung ten:
    logo-chatgpt.png  logo-copilot.png  logo-notebooklm.png  logo-claude.png
roi chay:
    python tools/tach-nen-logo.py

Anh nao da co nen trong san thi bo qua. Anh nao con nen dac (trang, kem, xam)
thi lan tu 04 canh vao, xoa vung nen lien thong, giu nguyen ruot logo
(vi du lo trong giua dai ruy bang Copilot van duoc xoa neu no thong ra ngoai).
Ban goc duoc giu lai thanh <ten>.goc.png de con lam lai neu can.
"""
import os
import sys
from collections import deque

try:
    from PIL import Image
except ImportError:
    sys.exit("Chua co Pillow. Chay: python -m pip install pillow")

HERE = os.path.dirname(os.path.abspath(__file__))
ASSETS = os.path.join(os.path.dirname(HERE), "assets")
NAMES = ["logo-chatgpt.png", "logo-copilot.png", "logo-notebooklm.png", "logo-claude.png"]

TOLERANCE = 34      # chenh lech mau toi da con coi la nen
FEATHER = 1         # so vong lam mem vien, 0 = tat


def da_co_nen_trong(im):
    if im.mode != "RGBA":
        return False
    alpha = im.getchannel("A")
    return alpha.getextrema()[0] < 250


def mau_nen(px, w, h):
    """Lay mau nen pho bien nhat tren 04 canh."""
    dem = {}
    for x in range(w):
        for y in (0, h - 1):
            dem[px[x, y][:3]] = dem.get(px[x, y][:3], 0) + 1
    for y in range(h):
        for x in (0, w - 1):
            dem[px[x, y][:3]] = dem.get(px[x, y][:3], 0) + 1
    return max(dem.items(), key=lambda kv: kv[1])[0]


def lech(a, b):
    return max(abs(a[0] - b[0]), abs(a[1] - b[1]), abs(a[2] - b[2]))


def tach(path):
    im = Image.open(path).convert("RGBA")
    if da_co_nen_trong(im):
        return "da co nen trong, bo qua"

    w, h = im.size
    px = im.load()
    nen = mau_nen(px, w, h)

    la_nen = bytearray(w * h)
    hang_doi = deque()
    for x in range(w):
        for y in (0, h - 1):
            hang_doi.append((x, y))
    for y in range(h):
        for x in (0, w - 1):
            hang_doi.append((x, y))

    while hang_doi:
        x, y = hang_doi.popleft()
        i = y * w + x
        if la_nen[i]:
            continue
        if lech(px[x, y][:3], nen) > TOLERANCE:
            continue
        la_nen[i] = 1
        if x > 0:
            hang_doi.append((x - 1, y))
        if x < w - 1:
            hang_doi.append((x + 1, y))
        if y > 0:
            hang_doi.append((x, y - 1))
        if y < h - 1:
            hang_doi.append((x, y + 1))

    for y in range(h):
        for x in range(w):
            if la_nen[y * w + x]:
                r, g, b, _ = px[x, y]
                px[x, y] = (r, g, b, 0)

    # lam mem vien: pixel giap ranh nen thi ha alpha xuong mot nua
    for _ in range(FEATHER):
        mem = []
        for y in range(1, h - 1):
            for x in range(1, w - 1):
                if la_nen[y * w + x]:
                    continue
                if (la_nen[(y - 1) * w + x] or la_nen[(y + 1) * w + x]
                        or la_nen[y * w + x - 1] or la_nen[y * w + x + 1]):
                    mem.append((x, y))
        for x, y in mem:
            r, g, b, a = px[x, y]
            px[x, y] = (r, g, b, a // 2)

    goc = path[:-4] + ".goc.png"
    if not os.path.exists(goc):
        Image.open(path).save(goc)
    im.save(path)
    so = sum(la_nen)
    return "da tach nen (%d/%d diem, mau nen %s)" % (so, w * h, nen)


def main():
    thieu = []
    for ten in NAMES:
        p = os.path.join(ASSETS, ten)
        if not os.path.exists(p):
            thieu.append(ten)
            continue
        print("%-24s %s" % (ten, tach(p)))
    if thieu:
        print("\nChua co trong assets/:")
        for t in thieu:
            print("  -", t)


if __name__ == "__main__":
    main()
