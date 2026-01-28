import Image from 'next/image';
import Link from 'next/link';
import styles from './Logo.module.css';

export function Logo() {
  return (
    <Link href="/" className={styles.logo} aria-label="Home">
      <Image
        src="/avatar.jpg"
        alt="Ryan Blakely"
        width={36}
        height={36}
        className={styles.image}
        priority
      />
    </Link>
  );
}
