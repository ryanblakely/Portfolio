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
  galleryImages?: string[];
  websiteUrl?: string;
  appStoreUrl?: string;
  githubUrl?: string;
  downloadUrl?: string;
}

export type PostContentBlock =
  | { type: 'text'; content: string }
  | { type: 'image'; src: string; alt: string; caption?: string }
  | { type: 'code'; content: string; language?: string };

export interface Post {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  content: PostContentBlock[];
}
