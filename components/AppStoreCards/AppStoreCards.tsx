'use client';

import Image from 'next/image';
import type {Project} from '@/types';
import styles from './AppStoreCards.module.css';

const PLATFORM_LABELS: Record<string, string> = {
  ios: 'iOS',
  macos: 'macOS',
  web: 'Web',
  visionos: 'visionOS',
  garmin: 'Garmin',
};

function AppStoreCard({project}: {project: Project}) {
  const imageSrc = project.previewImage || project.heroImage;
  return (
    <div className={styles.card}>
      <div className={styles.imageArea}>
        <Image
          src={imageSrc}
          alt={project.name}
          fill
          sizes="320px"
          className={styles.image}
        />
      </div>
      <div className={styles.infoBar}>
        {project.logo && (
          <Image
            src={project.logo}
            alt=""
            width={40}
            height={40}
            className={styles.logo}
          />
        )}
        <div className={styles.text}>
          <p className={styles.name}>{project.name}</p>
          <p className={styles.desc}>{project.description}</p>
        </div>
        <span className={styles.badge}>
          {PLATFORM_LABELS[project.platform] || project.platform}
        </span>
      </div>
    </div>
  );
}

export function AppStoreCards({projects}: {projects: Project[]}) {
  return (
    <div className={styles.scroll}>
      {projects.map((project) => (
        <AppStoreCard key={project.id} project={project} />
      ))}
    </div>
  );
}
