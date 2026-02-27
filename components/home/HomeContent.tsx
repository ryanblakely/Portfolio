'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ProjectPreview } from '@/components/home/ProjectPreview';
import { siteConfig } from '@/data/site';
import type { Project, Post } from '@/types';
import styles from '../../app/page.module.css';

interface HomeContentProps {
  posts: Post[];
  projects: Project[];
}

export function HomeContent({ posts, projects }: HomeContentProps) {
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
        <div className={styles.leftColumn}>
          <header>
            <h1 className={styles.name}>{siteConfig.name}</h1>
            <p className={styles.title}>Software Engineer in Philadelphia</p>
          </header>

          <nav className={styles.projectList}>
            {projects.map((project) => {
              const cardClass = `${styles.projectCard} ${hoveredProject?.id === project.id ? styles.projectCardActive : ''}`;
              const cardContent = (
                <>
                  {project.logo && (
                    <Image
                      src={project.logo}
                      alt=""
                      width={40}
                      height={40}
                      className={styles.projectCardLogo}
                    />
                  )}
                  <div className={styles.projectCardText}>
                    <span className={project.url ? styles.projectCardName : styles.projectCardNameInert}>{project.name}</span>
                    <span className={styles.projectCardSubtitle}>{project.description}</span>
                  </div>
                </>
              );

              return project.url ? (
                <Link
                  key={project.id}
                  href={project.url}
                  className={cardClass}
                  onMouseEnter={() => handleMouseEnter(project)}
                  onMouseLeave={handleMouseLeave}
                >
                  {cardContent}
                </Link>
              ) : (
                <div
                  key={project.id}
                  className={cardClass}
                  onMouseEnter={() => handleMouseEnter(project)}
                  onMouseLeave={handleMouseLeave}
                >
                  {cardContent}
                </div>
              );
            })}
          </nav>

          <section className={styles.writingSection}>
            <h2 className={styles.writingHeading}>Writing</h2>
            <ul className={styles.writingList}>
              {posts.map((post) => (
                <li key={post.slug}>
                  <Link href={`/writing/${post.slug}`} className={styles.writingLink}>
                    {post.title}
                  </Link>
                </li>
              ))}
            </ul>
          </section>

          <footer className={styles.footer}>
            <a href={`mailto:${siteConfig.email}`} className={styles.footerLink}>Email</a>
            {', '}
            <a href={siteConfig.twitter} className={styles.footerLink}>@goodtyper</a>
          </footer>
        </div>

        <main id="main" className={styles.rightColumn}>
          <ProjectPreview project={hoveredProject} />
        </main>
      </div>
    </div>
  );
}
