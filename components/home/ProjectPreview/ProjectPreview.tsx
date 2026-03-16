import type {Project} from '@/types';
import {useEffect, useRef, useState} from 'react';
import {GalleryDeviceMockup} from '@/components/GalleryDeviceMockup/GalleryDeviceMockup';
import styles from './ProjectPreview.module.css';

interface ProjectPreviewProps {
  project: Project | null;
  mockupRef?: React.RefObject<HTMLDivElement | null>;
}

function getPreviewImage(project: Project): string {
  return project.galleryImages?.[0] || project.previewImage || project.heroImage;
}

export function ProjectPreview({project, mockupRef}: ProjectPreviewProps) {
  const [displayedProject, setDisplayedProject] = useState<Project | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (project) {
      if (displayedProject && displayedProject.id !== project.id && contentRef.current) {
        contentRef.current.style.animation = 'none';
        void contentRef.current.offsetHeight;
        contentRef.current.style.animation = '';
      }
      setDisplayedProject(project);
      setIsVisible(true);
    } else {
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
    <div className={`${styles.preview} ${isVisible ? styles.visible : ''}`} aria-live="polite" aria-atomic="true">
      {displayedProject && (
        <div ref={contentRef} className={styles.contentWrapper}>
          {displayedProject.previewVideo ? (
            <div ref={mockupRef}>
              <video key={displayedProject.id} autoPlay muted loop playsInline className={styles.video}>
                <source src={displayedProject.previewVideo} type="video/mp4" />
              </video>
            </div>
          ) : (
            <div ref={mockupRef}>
              <GalleryDeviceMockup
                imageSrc={getPreviewImage(displayedProject)}
                alt={`Preview of ${displayedProject.name}`}
                platform={displayedProject.previewPlatform || displayedProject.platform}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
