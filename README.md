# Portfolio

Personal portfolio site at [ryanblakely.com](https://ryanblakely.com). Static Next.js app deployed to Cloudflare Pages.

## Tech Stack

- **Next.js 15** with static export (`output: 'export'`)
- **React 19**, TypeScript
- **CSS Modules** for all styling — no CSS-in-JS, no Tailwind
- **Unified/remark/rehype** pipeline for rendering Markdown content
- **Cloudflare Pages** for hosting

## Getting Started

```
npm install
npm run dev        # starts dev server with Turbopack
npm run build      # static export to out/
```

## Project Structure

```
app/                  Routes (Next.js App Router)
  page.tsx            Home — project grid with category tabs
  [category]/[slug]/  Project detail pages
  blog/[slug]/        Blog post pages
  about/              About page
  connect/            Contact page

components/           UI components, grouped by feature
  home/               Home page components (project grid, detail panel)
  projects/           Project detail page components (image gallery, etc.)
  posts/              Blog post rendering
  DeviceMockup/       Phone/watch/laptop mockup frames
  BentoGrid/          Grid layout component
  AppStoreCards/      App Store-style card component
  Showcase/           Showcase display component
  layout/             Shared layout (nav, footer)
  seo/                JSON-LD structured data

content/              Markdown content
  projects/           Long-form project descriptions (e.g. magfinder.md)
  posts/              Blog posts in Markdown with frontmatter

data/                 Structured data as TypeScript arrays
  projects.ts         Project definitions (id, name, platform, tech, images)
  categories.ts       Category tabs (Web, iOS, Mac, VisionOS, Garmin)
  posts.ts            Block-format blog posts (not currently used)
  site.ts             Site-wide config (name, URL, socials)

lib/                  Data loading and processing
  projects.ts         Reads project data, merges Markdown content
  posts.ts            Reads Markdown posts, parses frontmatter
  markdown.ts         Unified pipeline (remark → rehype → HTML)

types/                TypeScript types (Project, Post, Category, Platform)
public/               Static assets, organized by project ID
```

## How Content Works

There are two kinds of content: **projects** and **blog posts**.

**Projects** are defined in `data/projects.ts` as typed objects with metadata (name, platform, category, tech stack, image paths). A project can optionally have a Markdown file in `content/projects/` for a longer description — the build merges the two into a `MarkdownProject`.

**Blog posts** live in `content/posts/` as Markdown files with YAML frontmatter (`title`, `date`, `excerpt`). The type system also supports a block-based post format (`BlockPost`) defined in `data/posts.ts`, but all current posts use Markdown.

## Naming Conventions

- **Project IDs** are kebab-case slugs (`bitcoin-price-ios`, `eye-tracker`, `front-page`). These IDs are used everywhere: as route slugs, as directory names under `public/projects/`, and as Markdown filenames in `content/projects/`.
- **Categories** use the pattern `{platform}-apps` (`ios-apps`, `web-apps`, `mac-apps`). Category slugs double as URL segments.
- **Components** are PascalCase directories with a main `.tsx` file and an optional `.module.css` file.
- **Images** go in `public/projects/{project-id}/` with consistent names: `logo.webp`, `hero.svg`, `preview.webp`, `gallery-{n}.webp`.
