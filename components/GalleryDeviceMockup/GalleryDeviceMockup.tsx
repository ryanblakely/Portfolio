'use client';

import {useRef, useState, useCallback} from 'react';
import {createPortal} from 'react-dom';
import Image from 'next/image';
import type {Platform} from '@/types';
import styles from './GalleryDeviceMockup.module.css';

function isVideo(src: string) {
  return /\.(mp4|webm|mov)(\?|$)/i.test(src);
}

interface GalleryDeviceMockupProps {
  imageSrc: string;
  alt: string;
  platform: Platform;
  isExpanded?: boolean;
}

interface DeviceConfig {
  containerClass: string;
  screenClass: string;
  frameSrc: string;
  sizes: string;
}

function getDeviceConfig(platform: Platform): DeviceConfig | null {
  switch (platform) {
    case 'ios':
      return {
        containerClass: styles.ios,
        screenClass: styles.iosScreen,
        frameSrc: '/images/iphone-frame.svg',
        sizes: '(max-width: 768px) 60vw, 36vw',
      };
    case 'macos':
    case 'web':
      return {
        containerClass: styles.laptop,
        screenClass: styles.laptopScreen,
        frameSrc: '/images/macbook-frame.svg',
        sizes: '(max-width: 768px) 75vw, 28vw',
      };
    default:
      return null;
  }
}

export function GalleryDeviceMockup({imageSrc, alt, platform, isExpanded}: GalleryDeviceMockupProps) {
  const config = getDeviceConfig(platform);

  if (config) {
    return (
      <div className={`${styles.device} ${config.containerClass}`}>
        <Image
          src={imageSrc}
          alt={alt}
          fill
          sizes={config.sizes}
          className={config.screenClass}
        />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={config.frameSrc}
          alt=""
          aria-hidden
          className={styles.frame}
        />
      </div>
    );
  }

  // Garmin — vertical photo container with grow effect
  if (platform === 'garmin') {
    if (isVideo(imageSrc)) {
      return (
        <GarminVideo
          src={imageSrc}
          poster={imageSrc.replace(/\.[^.]+$/, '-poster.webp')}
          isExpanded={isExpanded}
        />
      );
    }
    return (
      <div className={`${styles.device} ${styles.photo} ${isExpanded ? styles.photoExpanded : ''}`}>
        <Image
          src={imageSrc}
          alt={alt}
          fill
          sizes="(max-width: 768px) 70vw, 36vw"
          className={styles.photoScreen}
        />
      </div>
    );
  }

  // Fallback for platforms without SVG frames (visionOS, etc.)
  return (
    <div className={`${styles.device} ${styles.visionPro} ${isExpanded ? styles.visionProExpanded : ''}`}>
      <div className={styles.screen}>
        <Image
          src={imageSrc}
          alt={alt}
          fill
          sizes="(max-width: 768px) 80vw, 28vw"
          className={styles.screenMedia}
        />
      </div>
    </div>
  );
}

function GarminVideo({src, poster, isExpanded}: {src: string; poster: string; isExpanded?: boolean}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const thumbRef = useRef<HTMLDivElement>(null);
  const [stage, setStage] = useState<'idle' | 'open' | 'closing'>('idle');

  const handleOpen = useCallback(() => {
    if (stage !== 'idle') return;
    setStage('open');
    // Play after the transition starts
    requestAnimationFrame(() => {
      videoRef.current?.play();
    });
  }, [stage]);

  const handleClose = useCallback(() => {
    if (stage !== 'open') return;
    const video = videoRef.current;
    if (video) {
      video.pause();
      video.currentTime = 0;
    }
    setStage('closing');
    setTimeout(() => setStage('idle'), 350);
  }, [stage]);

  const handleEnded = useCallback(() => {
    handleClose();
  }, [handleClose]);

  return (
    <>
      {/* Thumbnail in gallery */}
      <div
        ref={thumbRef}
        className={`${styles.device} ${styles.photo} ${isExpanded ? styles.photoExpanded : ''} ${styles.videoGarmin}`}
        onClick={handleOpen}
        onPointerDown={e => e.stopPropagation()}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={poster} alt="" className={styles.photoScreen} />
        <div className={styles.playOverlay}>
          <svg viewBox="0 0 48 48" className={styles.playIcon}>
            <circle cx="24" cy="24" r="24" fill="rgba(0,0,0,0.5)" />
            <polygon points="19.5,14 19.5,34 35,24" fill="#fff" />
          </svg>
        </div>
      </div>

      {/* Fullscreen player — portaled to body to escape transforms */}
      {stage !== 'idle' && createPortal(
        <div
          className={`${styles.videoBackdrop} ${stage === 'open' ? styles.videoBackdropVisible : ''}`}
          onClick={handleClose}
          onPointerDown={e => e.stopPropagation()}
        >
          <button
            className={styles.videoCloseButton}
            onClick={handleClose}
            aria-label="Close video"
          >
            &#x2715;
          </button>
          <div
            className={`${styles.videoPlayer} ${stage === 'open' ? styles.videoPlayerVisible : ''}`}
            onClick={e => e.stopPropagation()}
          >
            <video
              ref={videoRef}
              src={src}
              poster={poster}
              muted
              playsInline
              onEnded={handleEnded}
              className={styles.videoPlayerMedia}
            />
          </div>
        </div>,
        document.body
      )}
    </>
  );
}
