# Compress Video for Portfolio Preview

Compress a video file and add it as a preview for a portfolio project.

## Usage

When the user provides a video file path and project name, compress the video and add it to the portfolio preview system.

## Steps

### 1. Compress Video with FFmpeg

Create both MP4 (H.264) and WebM (VP9) versions:

```bash
# MP4 (H.264) - usually smaller, better browser support
ffmpeg -i INPUT_VIDEO -vcodec libx264 -crf 28 -preset slow -vf "scale=1280:-2" -an /Users/ryan/Code/Portfolio/public/projects/PROJECT_ID/preview.mp4

# WebM (VP9) - sometimes smaller, serve as fallback
ffmpeg -i INPUT_VIDEO -c:v libvpx-vp9 -crf 30 -b:v 0 -vf "scale=1280:-2" -an /Users/ryan/Code/Portfolio/public/projects/PROJECT_ID/preview.webm
```

**Flags explained:**
- `-crf 28` (MP4) / `-crf 30` (WebM): Quality level (lower = better quality, 23-30 good for web)
- `-preset slow`: Better compression (options: ultrafast, fast, medium, slow, veryslow)
- `-vf "scale=1280:-2"`: Resize to 1280px wide, maintain aspect ratio (-2 ensures even height)
- `-an`: Strip audio
- `-b:v 0` (WebM only): Use constant quality mode

### 2. Update Project Data

Add `previewVideo` to the project in `/Users/ryan/Code/Portfolio/data/projects.ts`:

```typescript
{
  id: 'project-id',
  // ... other fields
  previewVideo: '/projects/project-id/preview.mp4',
}
```

### 3. Verify

1. Run `npm run dev` and navigate to homepage
2. Hover over the project name in the sidebar
3. Verify video autoplays (muted, looping)
4. Test in Chrome and Safari

## Notes

- The `ProjectPreview` component at `components/home/ProjectPreview/ProjectPreview.tsx` already supports `previewVideo`
- It renders a `<video>` element with `autoplay muted loop playsinline`
- It serves WebM first (if browser supports it), then falls back to MP4
- The `previewVideo` type is defined in `types/index.ts`
