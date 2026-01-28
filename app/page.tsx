'use client';

import { useState } from 'react';
import { Logo } from '@/components/layout/Logo';
import { Navigation } from '@/components/layout/Navigation';
import { Sidebar } from '@/components/layout/Sidebar';
import { ProjectPreview } from '@/components/home/ProjectPreview';
import { siteConfig } from '@/data/site';
import { getProjectsByCategory } from '@/lib/projects';
import type { CategorySlug } from '@/types';
import styles from './page.module.css';

export default function HomePage() {
  const [hoveredCategory, setHoveredCategory] = useState<CategorySlug | null>(null);

  // Get first project from hovered category for preview
  const previewProject = hoveredCategory
    ? getProjectsByCategory(hoveredCategory)[0] || null
    : null;

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
        <Sidebar
          onCategoryHover={setHoveredCategory}
          activeCategorySlug={hoveredCategory}
        />
        <main id="main" className={styles.content}>
          <ProjectPreview project={previewProject} />
        </main>
      </div>
    </div>
  );
}
