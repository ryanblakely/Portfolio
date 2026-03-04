'use client';

import {useEffect, useState, useCallback, useRef} from 'react';
import {GalleryDeviceMockup} from '@/components/DeviceMockup/GalleryDeviceMockup';
import type {Project} from '@/types';
import styles from './ProjectDetailPanel.module.css';

interface ProjectDetailPanelProps {
  project: Project | null;
  onClose: () => void;
  anchorRect?: {top: number; left: number; width: number} | null;
}

function getGalleryImages(project: Project): string[] {
  if (project.galleryImages?.length) return project.galleryImages;
  if (project.previewImage) return [project.previewImage];
  return [project.heroImage];
}

export function ProjectDetailPanel({project, onClose, anchorRect}: ProjectDetailPanelProps) {
  const [displayedProject, setDisplayedProject] = useState<Project | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const galleryRef = useRef<HTMLDivElement>(null);
  const dragState = useRef<{isDragging: boolean; startX: number; scrollLeft: number}>({isDragging: false, startX: 0, scrollLeft: 0});

  useEffect(() => {
    if (project) {
      setIsClosing(false);
      setDisplayedProject(project);
      requestAnimationFrame(() => {
        requestAnimationFrame(() => setIsOpen(true));
      });
    } else if (displayedProject) {
      setIsClosing(true);
      setIsOpen(false);
      const timeout = setTimeout(() => {
        setDisplayedProject(null);
        setIsClosing(false);
      }, 400);
      return () => clearTimeout(timeout);
    }
  }, [project]); // eslint-disable-line react-hooks/exhaustive-deps

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
  const hasVideo = !!displayedProject.previewVideo;

  const panelStyle: React.CSSProperties = anchorRect
    ? {left: anchorRect.left}
    : {};

  return (
    <div
      className={`${styles.panel} ${isOpen ? styles.panelOpen : ''}`}
      style={panelStyle}
    >
      <button className={styles.closeButton} onClick={handleClose} aria-label="Close">
        &#x2715;
      </button>

      <div className={styles.content} style={anchorRect ? {paddingTop: anchorRect.top} : undefined}>
        {hasVideo ? (
          <div
            className={`${styles.videoContainer} ${isOpen && !isClosing ? styles.videoContainerOpen : ''}`}
            style={anchorRect ? {'--preview-width': `${anchorRect.width}px`} as React.CSSProperties : undefined}
          >
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
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerUp}
          >
            {images.map((src, i) => (
              <div
                key={src}
                className={`${styles.galleryItem} ${
                  i > 0 && isOpen && !isClosing ? styles.galleryItemEnter : ''
                } ${
                  i > 0 && isClosing ? styles.galleryItemExit : ''
                }`}
                style={i > 0 ? {'--item-index': i} as React.CSSProperties : undefined}
              >
                <GalleryDeviceMockup
                  imageSrc={src}
                  alt={`${displayedProject.name} screenshot ${i + 1}`}
                  platform={displayedProject.previewPlatform || displayedProject.platform}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
