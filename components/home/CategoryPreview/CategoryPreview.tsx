import Image from 'next/image';
import Link from 'next/link';
import type { Project } from '@/types';
import styles from './CategoryPreview.module.css';

interface CategoryPreviewProps {
  projects: Project[];
}

export function CategoryPreview({ projects }: CategoryPreviewProps) {
  if (projects.length === 0) {
    return null;
  }

  return (
    <div className={styles.grid} aria-live="polite" aria-atomic="true">
      {projects.map((project) => (
        <Link
          key={project.id}
          href={`/${project.category}/${project.id}`}
          className={styles.card}
        >
          <article>
            <div className={styles.imageContainer}>
              <Image
                src={project.heroImage}
                alt={`${project.name} preview`}
                fill
                sizes="(max-width: 768px) 50vw, 280px"
                className={styles.image}
              />
            </div>
            <h3 className={styles.name}>{project.name}</h3>
            <p className={styles.description}>{project.description}</p>
          </article>
        </Link>
      ))}
    </div>
  );
}
