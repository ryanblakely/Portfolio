import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import rehypeStringify from 'rehype-stringify';
import rehypePrismPlus from 'rehype-prism-plus';
import rehypeRaw from 'rehype-raw';
import type { MarkdownPost } from '@/types';

const postsDirectory = path.join(process.cwd(), 'content/posts');
const isDev = process.env.NODE_ENV === 'development';

export function getAllMarkdownSlugs(): string[] {
  if (!fs.existsSync(postsDirectory)) {
    return [];
  }
  const fileNames = fs.readdirSync(postsDirectory);
  return fileNames
    .filter((fileName) => fileName.endsWith('.md'))
    .filter((fileName) => {
      if (isDev) return true;
      const fullPath = path.join(postsDirectory, fileName);
      const { data } = matter(fs.readFileSync(fullPath, 'utf8'));
      return !data.draft;
    })
    .map((fileName) => fileName.replace(/\.md$/, ''));
}

export async function getMarkdownPostBySlug(slug: string): Promise<MarkdownPost | undefined> {
  const fullPath = path.join(postsDirectory, `${slug}.md`);

  if (!fs.existsSync(fullPath)) {
    return undefined;
  }

  const fileContents = fs.readFileSync(fullPath, 'utf8');
  const { data, content } = matter(fileContents);

  if (!isDev && data.draft) {
    return undefined;
  }

  const processedContent = await unified()
    .use(remarkParse)
    .use(remarkRehype, { allowDangerousHtml: true })
    .use(rehypeRaw)
    .use(rehypePrismPlus)
    .use(rehypeStringify, { allowDangerousHtml: true })
    .process(content);

  const contentHtml = processedContent.toString();

  return {
    format: 'markdown',
    slug,
    title: data.title,
    date: data.date,
    excerpt: data.excerpt,
    contentHtml,
  };
}

export async function getAllMarkdownPosts(): Promise<MarkdownPost[]> {
  const slugs = getAllMarkdownSlugs();
  const posts = await Promise.all(
    slugs.map((slug) => getMarkdownPostBySlug(slug))
  );
  return posts.filter((post): post is MarkdownPost => post !== undefined);
}
