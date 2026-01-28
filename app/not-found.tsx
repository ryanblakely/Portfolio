import Link from 'next/link';
import { Logo } from '@/components/layout/Logo';
import styles from './not-found.module.css';

export default function NotFound() {
  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <Logo />
      </header>

      <main id="main" className={styles.main}>
        <h1 className={styles.heading}>Page Not Found</h1>
        <p className={styles.text}>The page you&apos;re looking for doesn&apos;t exist.</p>
        <Link href="/" className={styles.link}>
          &larr; Back to Home
        </Link>
      </main>
    </div>
  );
}
