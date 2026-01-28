import { projects } from '@/data/projects';
import { categories } from '@/data/categories';
import type { Project, Category, CategorySlug } from '@/types';

export function getProjectsByCategory(categorySlug: CategorySlug): Project[] {
  return projects.filter((project) => project.category === categorySlug);
}

export function getProjectById(id: string): Project | undefined {
  return projects.find((project) => project.id === id);
}

export function getProjectByCategoryAndSlug(categorySlug: string, projectSlug: string): Project | undefined {
  return projects.find((project) => project.category === categorySlug && project.id === projectSlug);
}

export function getCategoryBySlug(slug: string): Category | undefined {
  return categories.find((cat) => cat.slug === slug);
}

export function getAllCategories(): Category[] {
  return categories;
}

export function getAllProjects(): Project[] {
  return projects;
}

export function getProjectsGroupedByCategory(): Map<CategorySlug, Project[]> {
  const grouped = new Map<CategorySlug, Project[]>();

  for (const category of categories) {
    grouped.set(category.slug, getProjectsByCategory(category.slug));
  }

  return grouped;
}
