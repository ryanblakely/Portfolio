import { projects } from '@/data/projects';
import { getProjectMarkdownBySlug } from './projects-markdown';
import type { AnyProject } from '@/types';

export async function getProjectByCategoryAndSlugAsync(categorySlug: string, projectSlug: string): Promise<AnyProject | undefined> {
  // Check markdown files first
  const markdownProject = await getProjectMarkdownBySlug(projectSlug);
  if (markdownProject && markdownProject.category === categorySlug) {
    return markdownProject;
  }
  // Fall back to TS projects
  return projects.find((project) => project.category === categorySlug && project.id === projectSlug);
}
