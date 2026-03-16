import { getAllMarkdownPosts, getAllMarkdownSlugs, getMarkdownPostBySlug } from './markdown';
import type { Post } from '@/types';

export async function getAllPosts(): Promise<Post[]> {
  const posts = await getAllMarkdownPosts();
  return posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export async function getPostBySlug(slug: string): Promise<Post | undefined> {
  return getMarkdownPostBySlug(slug);
}

export function getAllSlugs(): string[] {
  return getAllMarkdownSlugs();
}
