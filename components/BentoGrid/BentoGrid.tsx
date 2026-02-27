'use client';

import Image from 'next/image';
import type {Project} from '@/types';
import styles from './BentoGrid.module.css';

function getSpanClass(platform: string): string {
  switch (platform) {
    case 'ios':
      return styles.tall;
    case 'macos':
    case 'web':
    case 'visionos':
      return styles.wide;
    case 'garmin':
      return styles.small;
    default:
      return '';
  }
}

function BentoCard({project}: {project: Project}) {
  const imageSrc = project.previewImage || project.heroImage;
  return (
    <div className={`${styles.card} ${getSpanClass(project.platform)}`}>
      <Image
        src={imageSrc}
        alt={project.name}
        fill
        sizes="400px"
        className={styles.cardImage}
      />
      <div className={styles.cardOverlay}>
        <div className={styles.cardInfo}>
          {project.logo && (
            <Image
              src={project.logo}
              alt=""
              width={32}
              height={32}
              className={styles.cardLogo}
            />
          )}
          <div>
            <p className={styles.cardName}>{project.name}</p>
            <p className={styles.cardDesc}>{project.description}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export function BentoGrid({projects}: {projects: Project[]}) {
  return (
    <div className={styles.grid}>
      {projects.map((project) => (
        <BentoCard key={project.id} project={project} />
      ))}
    </div>
  );
}
