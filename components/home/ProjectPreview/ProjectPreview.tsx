import type {Project} from '@/types';
import Image from 'next/image';
import {useEffect, useState} from 'react';
import styles from './ProjectPreview.module.css';

interface ProjectPreviewProps {
  project: Project | null;
}

export function ProjectPreview({project}: ProjectPreviewProps) {
  const [displayedProject, setDisplayedProject] = useState<Project | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (project) {
      // New project: update immediately, CSS animation handles fade-in
      setDisplayedProject(project);
      setIsVisible(true);
    } else {
      // Leaving: delayed fade out (existing 1s delay + 500ms fade)
      const fadeTimeout = setTimeout(() => {
        setIsVisible(false);
      }, 1000);
      const clearProjectTimeout = setTimeout(() => {
        setDisplayedProject(null);
      }, 1500);
      return () => {
        clearTimeout(fadeTimeout);
        clearTimeout(clearProjectTimeout);
      };
    }
  }, [project]);

  return (
    <div className={`${styles.preview} ${isVisible ? styles.visible : ''} ${displayedProject?.platform === 'web' ? styles.previewWeb : ''}`} aria-live="polite" aria-atomic="true">
      {displayedProject && (
        <div key={displayedProject.id} className={styles.contentWrapper}>
          <div
            className={`${styles.imageContainer} ${!displayedProject.previewVideo ? styles.imageContainerWithBackground : ''}`}
          >
            {displayedProject.previewVideo ? (
              <video autoPlay muted loop playsInline className={styles.video}>
                <source src={displayedProject.previewVideo.replace('.mp4', '.webm')} type="video/webm" />
                <source src={displayedProject.previewVideo} type="video/mp4" />
              </video>
            ) : (
              <Image
                src={displayedProject.previewImage || displayedProject.heroImage}
                alt={`Preview of ${displayedProject.name}`}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                priority
                className={styles.image}
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
}
