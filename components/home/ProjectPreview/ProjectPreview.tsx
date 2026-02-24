import type {Project} from '@/types';
import Image from 'next/image';
import {useEffect, useRef, useState} from 'react';
import styles from './ProjectPreview.module.css';

interface ProjectPreviewProps {
  project: Project | null;
}

export function ProjectPreview({project}: ProjectPreviewProps) {
  const [displayedProject, setDisplayedProject] = useState<Project | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (project) {
      // If switching projects (not initial), restart animation without unmounting
      if (displayedProject && displayedProject.id !== project.id && contentRef.current) {
        contentRef.current.style.animation = 'none';
        void contentRef.current.offsetHeight; // Force reflow
        contentRef.current.style.animation = '';
      }
      setDisplayedProject(project);
      setIsVisible(true);
    } else {
      // Leaving: delayed fade out (existing 1s delay + 500ms fade)
      const fadeTimeout = setTimeout(() => {
        setIsVisible(false);
      }, 1000);
      const clearProjectTimeout = setTimeout(() => {
        setDisplayedProject(null);
      }, 1300);
      return () => {
        clearTimeout(fadeTimeout);
        clearTimeout(clearProjectTimeout);
      };
    }
  }, [project, displayedProject]);

  return (
    <div className={`${styles.preview} ${isVisible ? styles.visible : ''} ${displayedProject?.platform === 'web' ? styles.previewWeb : ''}`} aria-live="polite" aria-atomic="true">
      {displayedProject && (
        <div ref={contentRef} className={styles.contentWrapper}>
          <div
            className={`${styles.imageContainer} ${!displayedProject.previewVideo ? styles.imageContainerWithBackground : ''}`}
          >
            {displayedProject.previewVideo ? (
              <video key={displayedProject.id} autoPlay muted loop playsInline className={styles.video}>
                <source src={displayedProject.previewVideo} type="video/mp4" />
              </video>
            ) : (
              <Image
                key={displayedProject.id}
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
