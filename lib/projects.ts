import { projects } from '@/data/projects';
import { categories } from '@/data/categories';
import type { Project, Category, CategorySlug } from '@/types';

export function getProjectsByCategory(categorySlug: CategorySlug): Project[] {
  return projects.filter((project) => project.category === categorySlug);
}

export function getCategoryBySlug(slug: string): Category | undefined {
  return categories.find((cat) => cat.slug === slug);
}
