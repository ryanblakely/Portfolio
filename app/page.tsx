'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Logo } from '@/components/layout/Logo';
import { Navigation } from '@/components/layout/Navigation';
import { ProjectPreview } from '@/components/home/ProjectPreview';
import { siteConfig } from '@/data/site';
import { categories } from '@/data/categories';
import { getProjectsByCategory } from '@/lib/projects';
import type { Project } from '@/types';
import styles from './page.module.css';

export default function HomePage() {
  const [hoveredProject, setHoveredProject] = useState<Project | null>(null);

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <Logo />
        <div className={styles.headerContent}>
          <h1 className={styles.name}>{siteConfig.name}</h1>
          <p className={styles.title}>{siteConfig.title}</p>
        </div>
        <Navigation />
      </header>

      <div className={styles.main}>
        <aside className={styles.sidebar} aria-label="Project categories">
          <nav>
            <ul className={styles.categoryList}>
              {categories.map((category) => {
                const categoryProjects = getProjectsByCategory(category.slug);
                return (
                  <li key={category.slug} className={styles.categoryItem}>
                    <span className={styles.categoryName}>{category.name}</span>
                    <span className={styles.projectNames}>
                      {categoryProjects.map((project, index) => (
                        <span key={project.id}>
                          <Link
                            href={`/${project.category}/${project.id}`}
                            className={styles.projectLink}
                            onMouseEnter={() => setHoveredProject(project)}
                            onMouseLeave={() => setHoveredProject(null)}
                          >
                            {project.name}
                          </Link>
                          {index < categoryProjects.length - 1 && ', '}
                        </span>
                      ))}
                    </span>
                  </li>
                );
              })}
            </ul>
          </nav>
        </aside>
        <main id="main" className={styles.content}>
          <ProjectPreview project={hoveredProject} />
        </main>
      </div>
    </div>
  );
}
