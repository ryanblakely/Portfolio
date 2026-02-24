export type Platform = 'web' | 'ios' | 'macos' | 'visionos' | 'garmin';

export type CategorySlug = 'web-apps' | 'ios-apps' | 'mac-apps' | 'visionos-apps' | 'garmin-apps';

export interface Category {
  slug: CategorySlug;
  name: string;
  displayName: string;
  platform: Platform;
  order: number;
}

export interface Project {
  id: string;
  name: string;
  shortName?: string;
  platform: Platform;
  category: CategorySlug;
  description: string;
  longDescription?: string;
  tech: string[];
  year: number;
  status: 'active' | 'beta' | 'archived';
  heroImage: string;
  previewImage?: string;
  previewVideo?: string;
  logo?: string;
  galleryImages?: string[];
  url?: string;
  websiteUrl?: string;
  appStoreUrl?: string;
  githubUrl?: string;
  downloadUrl?: string;
}

export interface MarkdownProject extends Project {
  contentHtml: string;
}

export type AnyProject = Project | MarkdownProject;

export function isMarkdownProject(project: AnyProject): project is MarkdownProject {
  return 'contentHtml' in project && typeof project.contentHtml === 'string';
}

export type PostContentBlock =
  | { type: 'text'; content: string }
  | { type: 'image'; src: string; alt: string; caption?: string }
  | { type: 'code'; content: string; language?: string };

interface PostBase {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
}

export interface BlockPost extends PostBase {
  format: 'blocks';
  content: PostContentBlock[];
}

export interface MarkdownPost extends PostBase {
  format: 'markdown';
  contentHtml: string;
}

export type Post = BlockPost | MarkdownPost;

export function isMarkdownPost(post: Post): post is MarkdownPost {
  return post.format === 'markdown';
}

export function isBlockPost(post: Post): post is BlockPost {
  return post.format === 'blocks';
}
