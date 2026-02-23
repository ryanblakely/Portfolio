'use client';

import Link from 'next/link';
import { Logo } from '@/components/layout/Logo';
import { HalftoneAvatar } from '@/components/layout/Logo/HalftoneAvatar';
import { siteConfig } from '@/data/site';
import styles from './page.module.css';

export default function AboutPage() {
  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <Logo />
      </header>

      <main id="main" className={styles.main}>
        <h1 className={styles.heading}>About</h1>
        <p className={styles.bio}>{siteConfig.description}</p>
        <div className={styles.imageContainer}>
          <HalftoneAvatar
            imageSrc="/avatar-halftone.jpg"
            width={300}
            height={300}
          />
        </div>
        <Link href="/connect" className={styles.connectLink}>
          Connect
        </Link>
      </main>
    </div>
  );
}
