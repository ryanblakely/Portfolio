# Optimize Images

Convert and optimize images for web loading performance.

## When to use
When adding screenshots or images to the portfolio (gallery images, previews, etc.).

## Process

### 1. Convert to WebP
Use `cwebp` (installed via Homebrew at `/opt/homebrew/bin/cwebp`):

```bash
cwebp -q 80 -resize <WIDTH> 0 input.png -o output.webp
```

### 2. Sizing guidelines
- **Gallery/preview images (phone screenshots):** Resize to **630px wide** (half of 1260px Retina). The `0` height preserves aspect ratio.
- **Laptop/web screenshots:** Resize to **800px wide**
- **Logos/icons:** Keep original size, they're already small

### 3. Quality settings
- `-q 80` — good balance of quality vs file size for photos/screenshots
- `-q 90` — use for images where fine text must remain legible
- `-q 70` — use for large background images where slight quality loss is acceptable

### 4. Target file sizes
- Phone screenshots: **30–170 KB** after optimization
- Laptop screenshots: **50–200 KB**
- Logos: **< 20 KB**

### 5. Naming convention
Gallery images: `gallery-{n}.webp` (1-indexed, sequential)
Place in: `public/projects/{project-id}/`

### 6. Example: Adding a new gallery image
```bash
# Convert and resize in one step
cwebp -q 80 -resize 630 0 "/path/to/screenshot.png" -o /Users/ryan/Code/Portfolio/public/projects/{project-id}/gallery-5.webp

# Then add to galleryImages array in data/projects.ts
```

### 7. Batch optimization
```bash
for f in /path/to/screenshots/*.png; do
  name=$(basename "$f" .png)
  cwebp -q 80 -resize 630 0 "$f" -o "/Users/ryan/Code/Portfolio/public/projects/{project-id}/${name}.webp"
done
```
