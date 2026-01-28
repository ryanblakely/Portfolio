import type { Metadata } from 'next';
import Image from 'next/image';
import { Logo } from '@/components/layout/Logo';
import { siteConfig } from '@/data/site';
import styles from './page.module.css';

export const metadata: Metadata = {
  title: 'About',
  description: siteConfig.description,
};

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
          <Image
            src="/about.jpeg"
            alt="Sunset sky"
            width={400}
            height={300}
            className={styles.image}
          />
        </div>
      </main>
    </div>
  );
}
