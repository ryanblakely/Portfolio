import Link from 'next/link';
import { Logo } from '@/components/layout/Logo';
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
        <Link href="/connect" className={styles.connectLink}>
          Connect
        </Link>
      </main>
    </div>
  );
}
