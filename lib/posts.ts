import { posts as blockPosts } from '@/data/posts';
import { getAllMarkdownPosts, getAllMarkdownSlugs, getMarkdownPostBySlug } from './markdown';
import type { Post } from '@/types';

export async function getAllPosts(): Promise<Post[]> {
  const markdownPosts = await getAllMarkdownPosts();
  const allPosts: Post[] = [...blockPosts, ...markdownPosts];
  return allPosts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export async function getPostBySlug(slug: string): Promise<Post | undefined> {
  const blockPost = blockPosts.find((post) => post.slug === slug);
  if (blockPost) {
    return blockPost;
  }
  return getMarkdownPostBySlug(slug);
}

export function getAllSlugs(): string[] {
  const blockSlugs = blockPosts.map((post) => post.slug);
  const markdownSlugs = getAllMarkdownSlugs();
  return [...blockSlugs, ...markdownSlugs];
}
