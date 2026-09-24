from __future__ import annotations

from pathlib import Path

import qrcode
from PIL import Image, ImageChops, ImageDraw, ImageFont


ROOT = Path(__file__).resolve().parents[1]
OUTPUT_DIR = ROOT / "public" / "qr"
CANVAS_SIZE = 1600
WEBSITE_GREEN = "#506b5b"
TELEGRAM_ICON = OUTPUT_DIR / "telegram-official.png"


def font(size: int, bold: bool = False) -> ImageFont.FreeTypeFont:
    name = "arialbd.ttf" if bold else "arial.ttf"
    candidates = [
        Path("C:/Windows/Fonts") / name,
        Path("C:/Windows/Fonts") / ("segoeui.ttf" if not bold else "segoeuib.ttf"),
    ]
    for candidate in candidates:
        if candidate.exists():
            return ImageFont.truetype(str(candidate), size)
    return ImageFont.load_default()


def draw_globe(draw: ImageDraw.ImageDraw, box: tuple[int, int, int, int]) -> None:
    left, top, right, bottom = box
    draw.ellipse(box, fill=WEBSITE_GREEN)
    inset = max(10, (right - left) // 7)
    globe = (left + inset, top + inset, right - inset, bottom - inset)
    draw.ellipse(globe, outline="#f4f0df", width=max(6, (right - left) // 24))
    globe_left, globe_top, globe_right, globe_bottom = globe
    globe_width = globe_right - globe_left
    globe_height = globe_bottom - globe_top
    draw.arc(
        (globe_left + globe_width * 0.23, globe_top, globe_right - globe_width * 0.23, globe_bottom),
        90,
        270,
        fill="#f4f0df",
        width=max(5, (right - left) // 28),
    )
    draw.arc(
        (globe_left + globe_width * 0.23, globe_top, globe_right - globe_width * 0.23, globe_bottom),
        270,
        450,
        fill="#f4f0df",
        width=max(5, (right - left) // 28),
    )
    draw.arc(
        (globe_left, globe_top + globe_height * 0.24, globe_right, globe_bottom - globe_height * 0.24),
        180,
        360,
        fill="#f4f0df",
        width=max(5, (right - left) // 28),
    )
    draw.arc(
        (globe_left, globe_top + globe_height * 0.24, globe_right, globe_bottom - globe_height * 0.24),
        0,
        180,
        fill="#f4f0df",
        width=max(5, (right - left) // 28),
    )


def draw_instagram(image: Image.Image, box: tuple[int, int, int, int]) -> None:
    left, top, right, bottom = box
    width = right - left
    height = bottom - top
    gradient = Image.new("RGB", (width, height))
    pixels = gradient.load()
    stops = ((0.0, (131, 58, 180)), (0.52, (225, 48, 108)), (1.0, (252, 175, 69)))
    for y in range(height):
        position = y / max(1, height - 1)
        for index in range(len(stops) - 1):
            start, start_color = stops[index]
            end, end_color = stops[index + 1]
            if start <= position <= end:
                ratio = (position - start) / (end - start)
                color = tuple(round(start_color[channel] + (end_color[channel] - start_color[channel]) * ratio) for channel in range(3))
                break
        for x in range(width):
            pixels[x, y] = color
    mask = Image.new("L", (width, height), 0)
    ImageDraw.Draw(mask).rounded_rectangle((0, 0, width - 1, height - 1), radius=width // 4, fill=255)
    image.paste(gradient, (left, top), mask)
    draw = ImageDraw.Draw(image)
    cx = (left + right) / 2
    cy = (top + bottom) / 2
    inset = (right - left) // 5
    inner = (left + inset, top + inset, right - inset, bottom - inset)
    draw.rounded_rectangle(inner, radius=(right - left) // 7, outline="white", width=max(8, (right - left) // 18))
    cx = (left + right) // 2
    cy = (top + bottom) // 2
    radius = (right - left) // 6
    draw.ellipse((cx - radius, cy - radius, cx + radius, cy + radius), outline="white", width=max(8, (right - left) // 18))
    dot = max(10, (right - left) // 12)
    draw.ellipse((right - inset - dot, top + inset + dot, right - inset, top + inset + 2 * dot), fill="white")


def make_qr(url: str, filename: str, icon: str, fill_color: str = "#111111") -> None:
    qr = qrcode.QRCode(
        error_correction=qrcode.constants.ERROR_CORRECT_H,
        box_size=32,
        border=5,
    )
    qr.add_data(url)
    qr.make(fit=True)
    qr_image = qr.make_image(fill_color=fill_color, back_color="white").convert("RGB")
    active_bounds = ImageChops.difference(qr_image, Image.new("RGB", qr_image.size, "white")).getbbox()
    if active_bounds is None:
        raise ValueError("QR image does not contain a code")
    active_width = active_bounds[2] - active_bounds[0]
    margin = max(4 * 32, round(active_width * 0.12))
    crop = (
        max(0, active_bounds[0] - margin),
        max(0, active_bounds[1] - margin),
        min(qr_image.width, active_bounds[2] + margin),
        min(qr_image.height, active_bounds[3] + margin),
    )
    qr_image = qr_image.crop(crop).resize((CANVAS_SIZE, CANVAS_SIZE), Image.Resampling.NEAREST)
    canvas = qr_image

    draw = ImageDraw.Draw(canvas)
    icon_size = 232
    icon_left = (CANVAS_SIZE - icon_size) // 2
    icon_top = (CANVAS_SIZE - icon_size) // 2
    ring = 22
    draw.ellipse(
        (icon_left - ring, icon_top - ring, icon_left + icon_size + ring, icon_top + icon_size + ring),
        fill="white",
    )
    icon_box = (icon_left, icon_top, icon_left + icon_size, icon_top + icon_size)
    if icon == "bodyres":
        draw_globe(draw, icon_box)
    elif icon == "telegram":
        if not TELEGRAM_ICON.exists():
            raise FileNotFoundError(f"Missing official Telegram icon: {TELEGRAM_ICON}")
        official = Image.open(TELEGRAM_ICON).convert("RGBA").resize((icon_size, icon_size), Image.Resampling.LANCZOS)
        canvas.paste(official, (icon_left, icon_top), official)
    elif icon == "instagram":
        draw_instagram(canvas, icon_box)
    else:
        raise ValueError(f"Unknown icon: {icon}")

    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    canvas.save(OUTPUT_DIR / filename, format="PNG", optimize=True)


def main() -> None:
    make_qr("https://body-re.store/", "bodyres-website.png", "bodyres")
    make_qr("https://t.me/+380968592465", "bodyres-telegram.png", "telegram")
    make_qr("https://www.instagram.com/massage_odesa_body_restore/", "bodyres-instagram.png", "instagram")


if __name__ == "__main__":
    main()
