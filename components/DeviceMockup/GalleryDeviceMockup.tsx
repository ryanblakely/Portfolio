import Image from 'next/image';
import type {Platform} from '@/types';
import styles from './GalleryDeviceMockup.module.css';

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
    <div className={`${styles.device} ${styles.visionPro}`}>
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
