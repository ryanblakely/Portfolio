import Image from 'next/image';
import Link from 'next/link';
import type { Project } from '@/types';
import styles from './ProjectCard.module.css';

interface ProjectCardProps {
  project: Project;
}

export function ProjectCard({ project }: ProjectCardProps) {
  return (
    <article className={styles.card}>
      <Link href={`/${project.category}/${project.id}`} className={styles.link}>
        <div className={styles.imageContainer}>
          <Image
            src={project.heroImage}
            alt={`${project.name} preview`}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className={styles.image}
            loading="lazy"
          />
        </div>
        <div className={styles.content}>
          <h2 className={styles.name}>{project.name}</h2>
          <p className={styles.description}>{project.description}</p>
        </div>
      </Link>
    </article>
  );
}
