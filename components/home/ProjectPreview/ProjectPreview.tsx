import Image from 'next/image';
import type { Project } from '@/types';
import styles from './ProjectPreview.module.css';

interface ProjectPreviewProps {
  project: Project | null;
}

export function ProjectPreview({ project }: ProjectPreviewProps) {
  if (!project) {
    return null;
  }

  return (
    <div className={styles.preview} aria-live="polite" aria-atomic="true">
      <div className={styles.imageContainer}>
        <Image
          src={project.previewImage || project.heroImage}
          alt={`Preview of ${project.name}`}
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          priority
          className={styles.image}
        />
      </div>
    </div>
  );
}
