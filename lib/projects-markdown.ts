import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import rehypeStringify from 'rehype-stringify';
import rehypePrismPlus from 'rehype-prism-plus';
import rehypeRaw from 'rehype-raw';
import type { MarkdownProject } from '@/types';

const projectsDirectory = path.join(process.cwd(), 'content/projects');

export async function getProjectMarkdownBySlug(slug: string): Promise<MarkdownProject | undefined> {
  const fullPath = path.join(projectsDirectory, `${slug}.md`);

  if (!fs.existsSync(fullPath)) {
    return undefined;
  }

  const fileContents = fs.readFileSync(fullPath, 'utf8');
  const { data, content } = matter(fileContents);

  const processedContent = await unified()
    .use(remarkParse)
    .use(remarkRehype, { allowDangerousHtml: true })
    .use(rehypeRaw)
    .use(rehypePrismPlus)
    .use(rehypeStringify, { allowDangerousHtml: true })
    .process(content);

  // Replace placeholders with marker divs
  const contentHtml = processedContent.toString()
    .replace(/\{\{gallery\}\}/g, '<div data-gallery-placeholder="true"></div>')
    .replace(/\{\{tech\}\}/g, '<div data-tech-placeholder="true"></div>');

  return {
    id: slug,
    name: data.name,
    shortName: data.shortName,
    platform: data.platform,
    category: data.category,
    description: data.description,
    tech: data.tech || [],
    year: data.year,
    status: data.status,
    heroImage: data.heroImage,
    previewImage: data.previewImage,
    previewVideo: data.previewVideo,
    galleryImages: data.galleryImages,
    websiteUrl: data.websiteUrl,
    appStoreUrl: data.appStoreUrl,
    githubUrl: data.githubUrl,
    downloadUrl: data.downloadUrl,
    contentHtml,
  };
}
