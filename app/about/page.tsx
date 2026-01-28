import type { Metadata } from 'next';
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
        <p className={styles.quote}>&ldquo;{siteConfig.quote}&rdquo;</p>
      </main>
    </div>
  );
}
