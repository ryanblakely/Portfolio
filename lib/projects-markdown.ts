import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import rehypeStringify from 'rehype-stringify';
import rehypePrismPlus from 'rehype-prism-plus';
import type { MarkdownProject } from '@/types';

const projectsDirectory = path.join(process.cwd(), 'content/projects');

export function getAllProjectMarkdownSlugs(): string[] {
  if (!fs.existsSync(projectsDirectory)) {
    return [];
  }
  const fileNames = fs.readdirSync(projectsDirectory);
  return fileNames
    .filter((fileName) => fileName.endsWith('.md'))
    .map((fileName) => fileName.replace(/\.md$/, ''));
}

export async function getProjectMarkdownBySlug(slug: string): Promise<MarkdownProject | undefined> {
  const fullPath = path.join(projectsDirectory, `${slug}.md`);

  if (!fs.existsSync(fullPath)) {
    return undefined;
  }

  const fileContents = fs.readFileSync(fullPath, 'utf8');
  const { data, content } = matter(fileContents);

  const processedContent = await unified()
    .use(remarkParse)
    .use(remarkRehype)
    .use(rehypePrismPlus)
    .use(rehypeStringify)
    .process(content);

  const contentHtml = processedContent.toString();

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

export async function getAllProjectsFromMarkdown(): Promise<MarkdownProject[]> {
  const slugs = getAllProjectMarkdownSlugs();
  const projects = await Promise.all(
    slugs.map((slug) => getProjectMarkdownBySlug(slug))
  );
  return projects.filter((project): project is MarkdownProject => project !== undefined);
}
