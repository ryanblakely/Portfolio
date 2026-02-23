'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Logo } from '@/components/layout/Logo';
import { Navigation } from '@/components/layout/Navigation';
import { ProjectPreview } from '@/components/home/ProjectPreview';
import { siteConfig } from '@/data/site';
import { projects } from '@/data/projects';
import type { Project } from '@/types';
import styles from './page.module.css';

export default function HomePage() {
  const [hoveredProject, setHoveredProject] = useState<Project | null>(null);

  const handleMouseEnter = (project: Project) => {
    setHoveredProject(project);
  };

  const handleMouseLeave = () => {
    setHoveredProject(null);
  };

  return (
    <div className={styles.container}>
      <div className={styles.main}>
        <aside className={styles.leftColumn} aria-label="Project categories">
          <Logo />
          <div className={styles.identity}>
            <h1 className={styles.name}>{siteConfig.name}</h1>
            <p className={styles.title}>{siteConfig.title}</p>
          </div>
          <Navigation />
          <nav>
            <div className={styles.projectList}>
              {projects.map((project) => (
                <Link
                  key={project.id}
                  href={`/${project.category}/${project.id}`}
                  className={`${styles.projectCard} ${hoveredProject?.id === project.id ? styles.projectCardActive : ''}`}
                  onMouseEnter={() => handleMouseEnter(project)}
                  onMouseLeave={handleMouseLeave}
                >
                  <span className={styles.projectCardName}>{project.name}</span>
                  <span className={styles.projectCardSubtitle}>{project.year} · {project.description}</span>
                </Link>
              ))}
            </div>
          </nav>
        </aside>
        <main id="main" className={styles.rightColumn}>
          <ProjectPreview project={hoveredProject} />
        </main>
      </div>
    </div>
  );
}
