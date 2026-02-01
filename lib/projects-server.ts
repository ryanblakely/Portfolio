import { projects } from '@/data/projects';
import { getProjectMarkdownBySlug, getAllProjectsFromMarkdown } from './projects-markdown';
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

export async function getAllProjectsAsync(): Promise<AnyProject[]> {
  const markdownProjects = await getAllProjectsFromMarkdown();
  const markdownIds = new Set(markdownProjects.map((p) => p.id));
  // Filter out TS projects that have markdown versions
  const tsProjects = projects.filter((p) => !markdownIds.has(p.id));
  return [...markdownProjects, ...tsProjects];
}
