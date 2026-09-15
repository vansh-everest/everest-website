"""Cut homepage images out of a full-frame render of the Figma "Final homepage" frame.

Usage: python3 scripts/crop-figma.py <render.png> <scale_x> <scale_y> <x_offset>
  - MCP screenshot (1472px wide incl. 16px overflow each side): 897/1472 6000/9853 16
  - Figma 2x export of the frame: 2 2 0
Coordinates below are Figma design px inside frame 499:1311 (1440 x 9853).
"""
import sys
from pathlib import Path
from PIL import Image

src, sx, sy, xoff = sys.argv[1], eval(sys.argv[2]), eval(sys.argv[3]), float(sys.argv[4])
out = Path(__file__).resolve().parent.parent / "public" / "figma"
im = Image.open(src).convert("RGB")

CROPS = {
    "why-driver.jpg": (96, 1421, 608, 2061),
    "city-mumbai.png": (349.5, 2186, 468.5, 2303),
    "city-chennai.png": (523.5, 2186, 638.5, 2301),
    "city-pune.png": (683, 2186, 823, 2303),
    "city-delhi.png": (866.5, 2186, 983.5, 2303),
    "city-hyderabad.png": (1038.5, 2186, 1155.5, 2303),
    "city-kolkata.png": (1184, 2186, 1354, 2302),
    "plans-car.jpg": (85, 3150, 1440, 3650),
    "own-now-banner.jpg": (0, 3662, 770, 4010),
    "car-wagonr.jpg": (128, 4326, 708, 4588),
    "car-tigor-ev.jpg": (732, 4326, 1312, 4590),
    "ev-banner.jpg": (768, 5061, 1428, 5397),
    "app-phones.png": (20, 5600, 720, 6533),
    "dost-band.jpg": (0, 6706, 1440, 7458),
    "avatar-anand.jpg": (172, 9112, 223, 9163),
}

# Areas inside a crop that hold baked-in HTML-rendered UI (card edges), repainted with the section colour.
MASKS = {
    "plans-car.jpg": [((85, 3150, 1300, 3205), (229, 231, 235))],
}


def box(x0, y0, x1, y1):
    return tuple(round(v) for v in ((x0 + xoff) * sx, y0 * sy, (x1 + xoff) * sx, y1 * sy))

for name, rect in CROPS.items():
    piece = im.crop(box(*rect))
    for (mx0, my0, mx1, my1), colour in MASKS.get(name, []):
        piece.paste(colour, ((round((mx0 - rect[0]) * sx), round((my0 - rect[1]) * sy), round((mx1 - rect[0]) * sx), round((my1 - rect[1]) * sy))))
    piece.save(out / name, quality=92)
    print(name, box(*rect))

if len(sys.argv) > 5:  # sample background colours at design coords
    for label, (x, y) in {
        "why-bg": (50, 1300), "stats-yellow": (50, 1100), "cities-l": (50, 2200), "cities-r": (1400, 2350),
        "plans-bg": (50, 2500), "ownnow-mid": (800, 3700), "ownnow-r": (1400, 3950), "cars-bg": (50, 4200),
        "ev-l": (100, 5300), "ev-tl": (400, 5080), "app-bg": (50, 5450), "dost-l": (50, 6600), "dost-r": (1400, 6600),
        "steps-bg": (50, 7550), "steps-card": (300, 7700), "testi-bg": (50, 8500), "footer": (50, 9500),
        "app-blue": (700, 5900), "app-blue-r": (1250, 6100),
    }.items():
        px = im.getpixel(tuple(round(v) for v in ((x + xoff) * sx, y * sy)))
        print(f"{label}: #{px[0]:02x}{px[1]:02x}{px[2]:02x}")
