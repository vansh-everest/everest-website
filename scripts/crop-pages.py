"""Cut inner-page images out of the 2x Figma frame exports in design/.

Usage: python3 scripts/crop-pages.py [--sample]
Coordinates are Figma design px (1x) inside each frame; exports are 2x.
Hero photos have their headline/buttons baked in, so that area is inpainted
and the page renders the real text on top.
"""
import sys
from pathlib import Path

import cv2
import numpy as np
from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / "public" / "figma"
S = 2  # export scale

SOURCES = {
    "about": ROOT / "design" / "about-us@2x.png",
    "own": ROOT / "design" / "own-now@2x.png",
    "svc": ROOT / "design" / "our-services-frame@2x.png",
}

# name: (source, (x0, y0, x1, y1), inpaint) where inpaint = (mode, (x0, y0, x1, y1) relative to the crop)
CROPS = {
    "about-hero.jpg": ("about", (0, 76, 1440, 681), ("rect", [(340, 72, 1100, 226)])),
    "leader-1.jpg": ("about", (169, 1511, 707, 1734), None),
    "leader-2.jpg": ("about", (733, 1511, 1271, 1734), None),
    "leader-3.jpg": ("about", (169, 1881, 707, 2104), None),
    "leader-4.jpg": ("about", (733, 1881, 1271, 2104), None),
    "milestones-road.png": ("about", (0, 3310, 1440, 4522), None),
    "difference-car.jpg": ("about", (860, 4806, 1360, 5206), None),
    "own-hero.jpg": ("own", (0, 76, 1440, 699), ("dark", (80, 72, 730, 560))),
    "own-wagonr-studio.jpg": ("own", (160, 2075, 616, 2355), None),
    "own-card-wagonr.jpg": ("own", (128, 2805, 708, 3067), None),
    "own-card-tigor.jpg": ("own", (732, 2805, 1312, 3069), None),
    "svc-hero.jpg": ("svc", (0, 76, 1440, 945), ("light+", [(66, 168, 350, 212), (66, 226, 532, 502), (66, 526, 270, 588)])),
    "svc-benefit-1.jpg": ("svc", (80, 1781, 640, 2101), None),
    "svc-benefit-2.jpg": ("svc", (800, 2149, 1360, 2469), None),
    "svc-benefit-3.jpg": ("svc", (80, 2517, 640, 2837), None),
}


def text_mask(rgb, mode):
    r, g, b = (rgb[..., i].astype(int) for i in range(3))
    lum = 0.299 * r + 0.587 * g + 0.114 * b
    yellow = (r > 190) & (g > 160) & (b < 120)
    if mode == "dark":  # navy/blue type and buttons on a light photo
        mask = (lum < 165) | ((b - r > 60) & (lum < 200)) | yellow
    else:  # white type on a dark photo
        mask = (lum > 175) | yellow
    return mask.astype(np.uint8) * 255


def inpaint(piece, mode, rect):
    arr = np.array(piece)
    mask = np.zeros(arr.shape[:2], np.uint8)
    if mode == "rect":  # glow/soft-edged type: clear the whole block, the page text sits on top
        for x0, y0, x1, y1 in rect:
            mask[y0 * S:y1 * S, x0 * S:x1 * S] = 255
    elif mode == "light+":  # white type on a dark photo: trace the glyphs, clear pills/buttons whole
        pill, *blocks = rect
        x0, y0, x1, y1 = (v * S for v in pill)
        mask[y0:y1, x0:x1] = 255
        for block in blocks:
            x0, y0, x1, y1 = (v * S for v in block)
            mask[y0:y1, x0:x1] = text_mask(arr[y0:y1, x0:x1], "light")
        mask = cv2.dilate(mask, np.ones((7, 7), np.uint8), iterations=3)
    else:
        x0, y0, x1, y1 = (v * S for v in rect)
        mask[y0:y1, x0:x1] = text_mask(arr[y0:y1, x0:x1], mode)
    if mode != "light+":
        mask = cv2.dilate(mask, np.ones((9, 9), np.uint8), iterations=2)
    bgr = cv2.cvtColor(arr, cv2.COLOR_RGB2BGR)
    fixed = cv2.inpaint(bgr, mask, 12, cv2.INPAINT_TELEA)
    return Image.fromarray(cv2.cvtColor(fixed, cv2.COLOR_BGR2RGB))


def main():
    images = {k: Image.open(p).convert("RGB") for k, p in SOURCES.items()}
    for name, (src, (x0, y0, x1, y1), fix) in CROPS.items():
        piece = images[src].crop((x0 * S, y0 * S, x1 * S, y1 * S))
        if fix:
            piece = inpaint(piece, *fix)
        piece.save(OUT / name, quality=88, optimize=True)
        print(name, piece.size)
    if "--sample" in sys.argv:
        sample(images)


def sample(images):
    pts = {
        "about": {
            "impact-tl": (40, 700), "impact-br": (1400, 1220), "values-left": (40, 2400), "values-right": (700, 2400),
            "values-bar": (562, 2500), "mile-bg": (40, 3200), "year-tab": (1250, 3440), "mile-card": (1230, 3529),
            "mile-badge": (1236, 3543), "diff-tl": (40, 4540), "diff-br": (1400, 5690), "diff-card": (300, 4900),
            "diff-small": (200, 5300), "cta-tl": (40, 5720), "cta-br": (1400, 6250), "leader-border": (168, 1700),
            "circle1": (95, 2960), "circle2": (150, 2960), "circle3": (230, 2960),
        },
        "own": {
            "ben-tl": (40, 720), "ben-br": (1400, 1620), "ico1": (160, 1090), "ico2": (568, 1090), "ico3": (976, 1090),
            "ico4": (160, 1334), "ico5": (568, 1334), "ico6": (976, 1334), "pick-bg": (40, 1650),
            "calc-card": (700, 2200), "tabs-bg": (900, 2095), "tile-bg": (700, 2900), "faq-bg": (40, 5600),
            "acc1": (302, 5893), "acc2": (302, 5985), "acc3": (302, 6077), "acc4": (302, 6169), "acc5": (302, 6261),
            "acc6": (302, 6353), "tog1": (1090, 5893), "tog2": (1090, 5985), "tog3": (1090, 6077), "tog4": (1090, 6169),
            "tog5": (1090, 6261), "tog6": (1090, 6353), "faq-foot": (400, 6481), "faq-pill": (690, 5666),
            "hero-pill": (100, 171), "slider-track": (1000, 2327), "slider-fill": (900, 2327),
        },
        "svc": {"hero-bottom": (40, 900), "how-bg": (40, 960), "card-border": (81, 1300), "ico-bg": (125, 1318)},
    }
    for src, table in pts.items():
        for label, (x, y) in table.items():
            p = images[src].getpixel((x * S, y * S))
            print(f"{src}.{label}: #{p[0]:02x}{p[1]:02x}{p[2]:02x}")


if __name__ == "__main__":
    main()
