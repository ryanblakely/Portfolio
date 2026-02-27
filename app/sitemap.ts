import type { MetadataRoute } from 'next';
import { siteConfig } from '@/data/site';
import { projects } from '@/data/projects';
import { getAllPosts } from '@/lib/posts';

export const dynamic = 'force-static';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const posts = await getAllPosts();

  const staticPages: MetadataRoute.Sitemap = [
    {
      url: siteConfig.url,
      changeFrequency: 'monthly',
      priority: 1.0,
    },
    {
      url: `${siteConfig.url}/connect`,
      changeFrequency: 'yearly',
      priority: 0.8,
    },
    {
      url: `${siteConfig.url}/blog`,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
  ];

  const categories = [...new Set(projects.map((p) => p.category))];
  const categoryPages: MetadataRoute.Sitemap = categories.map((category) => ({
    url: `${siteConfig.url}/${category}`,
    changeFrequency: 'monthly',
    priority: 0.9,
  }));

  const projectPages: MetadataRoute.Sitemap = projects.map((project) => ({
    url: `${siteConfig.url}/${project.category}/${project.id}`,
    changeFrequency: 'monthly',
    priority: 0.7,
  }));

  const postPages: MetadataRoute.Sitemap = posts.map((post) => ({
    url: `${siteConfig.url}/blog/${post.slug}`,
    changeFrequency: 'yearly',
    priority: 0.6,
  }));

  return [...staticPages, ...categoryPages, ...projectPages, ...postPages];
}
