'use client';

import {useEffect, useState, useCallback, useRef} from 'react';
import {GalleryDeviceMockup} from '@/components/DeviceMockup/GalleryDeviceMockup';
import type {Project} from '@/types';
import styles from './ProjectDetailPanel.module.css';

interface ProjectDetailPanelProps {
  project: Project | null;
  onClose: () => void;
  anchorRect?: {top: number; left: number} | null;
}

function getCtaLabel(project: Project): string {
  if (project.appStoreUrl) return 'View on App Store';
  if (project.websiteUrl) return 'Visit Website';
  if (project.url) return 'Open';
  return '';
}

function getCtaUrl(project: Project): string {
  return project.appStoreUrl || project.websiteUrl || project.url || '';
}

function getGalleryImages(project: Project): string[] {
  if (project.galleryImages?.length) return project.galleryImages;
  if (project.previewImage) return [project.previewImage];
  return [project.heroImage];
}

export function ProjectDetailPanel({project, onClose, anchorRect}: ProjectDetailPanelProps) {
  const [displayedProject, setDisplayedProject] = useState<Project | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const galleryRef = useRef<HTMLDivElement>(null);
  const dragState = useRef<{isDragging: boolean; startX: number; scrollLeft: number}>({isDragging: false, startX: 0, scrollLeft: 0});

  useEffect(() => {
    if (project) {
      setDisplayedProject(project);
      requestAnimationFrame(() => {
        requestAnimationFrame(() => setIsOpen(true));
      });
    } else {
      setIsOpen(false);
      const timeout = setTimeout(() => setDisplayedProject(null), 400);
      return () => clearTimeout(timeout);
    }
  }, [project]);

  const handleClose = useCallback(() => {
    onClose();
  }, [onClose]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && project) handleClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [project, handleClose]);

  // Lock body scroll on mobile when panel is open
  useEffect(() => {
    if (!isOpen) return;
    const isMobile = window.matchMedia('(max-width: 768px)').matches;
    if (isMobile) {
      document.body.style.overflow = 'hidden';
      return () => { document.body.style.overflow = ''; };
    }
  }, [isOpen]);

  // Click-and-drag to scroll
  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    const el = galleryRef.current;
    if (!el) return;
    dragState.current = {isDragging: true, startX: e.clientX, scrollLeft: el.scrollLeft};
    el.setPointerCapture(e.pointerId);
    el.style.cursor = 'grabbing';
    el.style.scrollSnapType = 'none';
  }, []);

  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    if (!dragState.current.isDragging) return;
    const el = galleryRef.current;
    if (!el) return;
    const dx = e.clientX - dragState.current.startX;
    el.scrollLeft = dragState.current.scrollLeft - dx;
  }, []);

  const handlePointerUp = useCallback((e: React.PointerEvent) => {
    if (!dragState.current.isDragging) return;
    dragState.current.isDragging = false;
    const el = galleryRef.current;
    if (!el) return;
    el.releasePointerCapture(e.pointerId);
    el.style.cursor = '';
    el.style.scrollSnapType = '';
  }, []);

  if (!displayedProject) return null;

  const images = getGalleryImages(displayedProject);
  const ctaLabel = getCtaLabel(displayedProject);
  const ctaUrl = getCtaUrl(displayedProject);
  const hasVideo = !!displayedProject.previewVideo;

  return (
    <>
      <div className={`${styles.panel} ${isOpen ? styles.panelOpen : ''}`}>
        <button className={styles.closeButton} onClick={handleClose} aria-label="Close">
          &#x2715;
        </button>

        <div className={styles.content} style={anchorRect ? {paddingTop: anchorRect.top} : undefined}>
          {hasVideo ? (
            <div className={styles.videoContainer}>
              <video
                className={styles.video}
                src={displayedProject.previewVideo}
                autoPlay
                loop
                muted
                playsInline
              />
            </div>
          ) : (
            <div
              ref={galleryRef}
              className={styles.gallery}
              style={anchorRect ? {paddingLeft: anchorRect.left - (window.innerWidth * 0.4)} : undefined}
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
              onPointerCancel={handlePointerUp}
            >
              {images.map((src, i) => (
                <div
                  key={src}
                  className={`${styles.galleryItem} ${i > 0 && isOpen ? styles.galleryItemAnimated : ''}`}
                  style={i > 0 ? {'--item-index': i} as React.CSSProperties : undefined}
                >
                  <GalleryDeviceMockup
                    imageSrc={src}
                    alt={`${displayedProject.name} screenshot ${i + 1}`}
                    platform={displayedProject.platform}
                  />
                </div>
              ))}
            </div>
          )}

        </div>

        {ctaLabel && ctaUrl && (
          <div className={styles.footer}>
            <a href={ctaUrl} target="_blank" rel="noopener noreferrer" className={styles.ctaButton}>
              {ctaLabel}
            </a>
          </div>
        )}
      </div>
    </>
  );
}
