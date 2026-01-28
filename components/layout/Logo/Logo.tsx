import Link from 'next/link';
import styles from './Logo.module.css';

export function Logo() {
  return (
    <Link href="/" className={styles.logo} aria-label="Home">
      <svg
        width="36"
        height="36"
        viewBox="0 0 36 36"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <circle cx="18" cy="18" r="18" fill="var(--color-accent)" />
      </svg>
    </Link>
  );
}
