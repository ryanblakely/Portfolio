'use client';

import { useState, useRef, useCallback } from 'react';
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
  const [indicatorStyle, setIndicatorStyle] = useState({ top: 0, height: 0, width: 0, opacity: 0 });
  const cardRefs = useRef<(HTMLAnchorElement | HTMLDivElement | null)[]>([]);

  const handleCardMouseEnter = useCallback((project: Project, index: number) => {
    setHoveredProject(project);
    const card = cardRefs.current[index];
    if (card) {
      setIndicatorStyle({
        top: card.offsetTop,
        height: card.offsetHeight,
        width: card.offsetWidth,
        opacity: 1,
      });
    }
  }, []);

  const handleListMouseLeave = useCallback(() => {
    setHoveredProject(null);
    setIndicatorStyle(s => ({ ...s, opacity: 0 }));
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.main}>
        <div className={styles.leftColumn}>
          <header>
            <h1 className={styles.name}>{siteConfig.name}</h1>
            <p className={styles.title}>Software Engineer in Philadelphia</p>
          </header>

          <nav className={styles.projectList} onMouseLeave={handleListMouseLeave}>
            <div
              className={styles.glassIndicator}
              style={{
                transform: `translateY(${indicatorStyle.top}px)`,
                height: `${indicatorStyle.height}px`,
                width: `${indicatorStyle.width}px`,
                opacity: indicatorStyle.opacity,
              }}
            />
            {projects.map((project, index) => {
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
                  ref={el => { cardRefs.current[index] = el; }}
                  className={styles.projectCard}
                  onMouseEnter={() => handleCardMouseEnter(project, index)}
                >
                  {cardContent}
                </Link>
              ) : (
                <div
                  key={project.id}
                  ref={el => { cardRefs.current[index] = el; }}
                  className={styles.projectCard}
                  onMouseEnter={() => handleCardMouseEnter(project, index)}
                >
                  {cardContent}
                </div>
              );
            })}
          </nav>

          <section className={styles.writingSection}>
            <h2 className={styles.writingHeading}>Blog</h2>
            <ul className={styles.writingList}>
              {posts.map((post) => (
                <li key={post.slug}>
                  <Link href={`/blog/${post.slug}`} className={styles.writingLink}>
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
