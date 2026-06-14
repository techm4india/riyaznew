from PIL import Image, ImageDraw
import os

src = '/Users/mdriyaz/Downloads/riyaz/TECH_M4-main/vercel.png'
out_dir = '/Users/mdriyaz/Downloads/riyaz/TECH_M4-main'

# Load the source image
img = Image.open(src).convert('RGBA')
w, h = img.size  # 1254 x 1254
cx, cy = w // 2, h // 2

# --- Step 1: Make outside-circle pixels transparent ---
# The circular badge fits tightly in the image.
# We'll use a circle mask with radius just inside the outer shadow.
radius = 560  # pixels — slightly inside the outer shadow edge

# Create a circular mask
mask = Image.new('L', (w, h), 0)
draw = ImageDraw.Draw(mask)
draw.ellipse(
    (cx - radius, cy - radius, cx + radius, cy + radius),
    fill=255
)

# Apply mask to make outside transparent
result = Image.new('RGBA', (w, h), (0, 0, 0, 0))
result.paste(img, mask=mask)

# --- Step 2: Crop to the tight bounding box of the circle ---
bbox = (cx - radius, cy - radius, cx + radius, cy + radius)
cropped = result.crop(bbox)

# --- Step 3: Generate all favicon sizes ---
sizes = {
    'favicon-16x16.png':       (16, 16),
    'favicon-32x32.png':       (32, 32),
    'apple-touch-icon.png':    (180, 180),
    'android-chrome-192x192.png': (192, 192),
    'android-chrome-512x512.png': (512, 512),
}

for filename, dim in sizes.items():
    resized = cropped.resize(dim, Image.Resampling.LANCZOS)
    out_path = os.path.join(out_dir, filename)
    resized.save(out_path)
    print(f"Saved {filename} ({dim[0]}x{dim[1]})")

# --- Step 4: Generate favicon.ico (16x16 + 32x32 multi-resolution) ---
ico_16 = cropped.resize((16, 16), Image.Resampling.LANCZOS)
ico_path = os.path.join(out_dir, 'favicon.ico')
ico_16.save(ico_path, format='ICO', sizes=[(16, 16), (32, 32)])
print("Saved favicon.ico")

# --- Step 5: Also save a full-res logo.png for JSON-LD schema references ---
logo_full = cropped.resize((512, 512), Image.Resampling.LANCZOS)
logo_path = os.path.join(out_dir, 'logo.png')
logo_full.save(logo_path)
print("Saved logo.png (512x512 for JSON-LD schema)")

print("\nAll favicon files generated successfully from vercel.png!")
