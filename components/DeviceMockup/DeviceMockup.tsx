'use client';

import {useRef, useEffect, useState, useCallback} from 'react';
import Image from 'next/image';
import type {Project} from '@/types';
import styles from './DeviceMockup.module.css';

function getDeviceClass(platform: string): string {
  switch (platform) {
    case 'ios':
      return styles.ios;
    case 'macos':
    case 'web':
      return styles.laptop;
    case 'garmin':
      return styles.watch;
    case 'visionos':
      return styles.visionPro;
    default:
      return styles.laptop;
  }
}

function ScreenContent({project}: {project: Project}) {
  if (project.previewVideo) {
    return (
      <video autoPlay muted loop playsInline className={styles.screenMedia}>
        <source src={project.previewVideo} type="video/mp4" />
      </video>
    );
  }
  if (project.previewImage) {
    return (
      <Image
        src={project.previewImage}
        alt={`${project.name} preview`}
        fill
        sizes="300px"
        className={styles.screenMedia}
      />
    );
  }
  if (project.logo) {
    return (
      <div className={styles.logoFallback}>
        <Image
          src={project.logo}
          alt={`${project.name} logo`}
          width={64}
          height={64}
          className={styles.logoImage}
        />
      </div>
    );
  }
  return null;
}

export function DeviceMockup({project}: {project: Project}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useRef(false);
  const [tilt, setTilt] = useState({rx: 0, ry: 0, sx: 0, sy: 20});
  const [hovering, setHovering] = useState(false);

  useEffect(() => {
    prefersReducedMotion.current = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches;
  }, []);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (prefersReducedMotion.current) return;
      const el = containerRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = (e.clientY - rect.top) / rect.height;
      setTilt({
        ry: (x - 0.5) * 30,
        rx: (0.5 - y) * 30,
        sx: (x - 0.5) * -20,
        sy: (y - 0.5) * -20 + 20,
      });
    },
    [],
  );

  const handleMouseEnter = useCallback(() => setHovering(true), []);

  const handleMouseLeave = useCallback(() => {
    setHovering(false);
    setTilt({rx: 0, ry: 0, sx: 0, sy: 20});
  }, []);

  return (
    <div
      className={styles.container}
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div
        className={`${styles.device} ${getDeviceClass(project.platform)}`}
        style={{
          transform: `rotateX(${tilt.rx}deg) rotateY(${tilt.ry}deg)`,
          filter: `drop-shadow(${tilt.sx}px ${tilt.sy}px 30px rgba(0,0,0,0.2))`,
          transition: hovering
            ? 'transform 100ms ease, filter 100ms ease'
            : 'transform 400ms ease-out, filter 400ms ease-out',
        }}
      >
        <div className={styles.screen}>
          <ScreenContent project={project} />
        </div>
      </div>
      <p className={styles.deviceLabel}>{project.name}</p>
    </div>
  );
}
