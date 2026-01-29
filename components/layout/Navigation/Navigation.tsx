'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from './Navigation.module.css';

const navLinks = [
  { href: '/about', label: 'About' },
  { href: '/connect', label: 'Connect' },
  { href: '/posts', label: 'Posts' },
];

export function Navigation() {
  const pathname = usePathname();

  return (
    <nav aria-label="Main navigation" className={styles.nav}>
      <ul className={styles.list} role="list">
        {navLinks.map((link) => {
          const isActive = pathname === link.href;
          return (
            <li key={link.href}>
              <Link
                href={link.href}
                className={styles.link}
                aria-current={isActive ? 'page' : undefined}
              >
                {link.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
