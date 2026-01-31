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
  const lastChangeRef = useRef<number>(0);
  const prevProjectRef = useRef<Project | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const now = Date.now();
    const timeSinceLastChange = now - lastChangeRef.current;
    const isQuickSwitch = timeSinceLastChange < 600 && prevProjectRef.current !== null;

    if (project) {
      if (isQuickSwitch && project.id !== prevProjectRef.current?.id) {
        // Quick switch: immediately hide, then show new
        setIsVisible(false);
        setDisplayedProject(null);
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            setDisplayedProject(project);
            // Wait for paint before fading in
            requestAnimationFrame(() => {
              requestAnimationFrame(() => {
                setIsVisible(true);
              });
            });
          });
        });
      } else if (project.id !== displayedProject?.id) {
        // New project or slow switch: fade in
        setIsVisible(false);
        const timeout = setTimeout(
          () => {
            setDisplayedProject(project);
            setIsVisible(true);
          },
          displayedProject ? 100 : 0,
        );
        return () => clearTimeout(timeout);
      } else {
        setIsVisible(true);
      }
      lastChangeRef.current = now;
      prevProjectRef.current = project;
    } else {
      // Wait 1s before starting fade out
      const fadeTimeout = setTimeout(() => {
        setIsVisible(false);
      }, 1000);
      // Keep the project rendered during fade out
      const clearTimeout_ = setTimeout(() => {
        setDisplayedProject(null);
        prevProjectRef.current = null;
      }, 1500); // 1s delay + 500ms fade duration
      return () => {
        clearTimeout(fadeTimeout);
        clearTimeout(clearTimeout_);
      };
    }
  }, [project]);

  // Reset and play video when displayedProject changes
  useEffect(() => {
    if (videoRef.current && displayedProject?.previewVideo) {
      videoRef.current.currentTime = 0;
      videoRef.current.play().catch(() => {});
    }
  }, [displayedProject]);

  return (
    <div className={`${styles.preview} ${isVisible ? styles.visible : ''} ${displayedProject?.platform === 'web' ? styles.previewWeb : ''}`} aria-live="polite" aria-atomic="true">
      {displayedProject && (
        <div
          className={`${styles.imageContainer} ${!displayedProject.previewVideo ? styles.imageContainerWithBackground : ''}`}
        >
          {displayedProject.previewVideo ? (
            <video key={displayedProject.id} ref={videoRef} autoPlay muted loop playsInline className={styles.video}>
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
      )}
    </div>
  );
}
