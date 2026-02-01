import {Logo} from '@/components/layout/Logo';
import {siteConfig} from '@/data/site';
import type {Metadata} from 'next';
import styles from './page.module.css';

export const metadata: Metadata = {
  title: 'Connect',
  description: `Get in touch with ${siteConfig.name}`,
};

const links = [
  {label: 'Twitter', href: siteConfig.twitter},
  {label: 'Github', href: siteConfig.github},
  {label: 'Email', href: `mailto:${siteConfig.email}`},
];

export default function ConnectPage() {
  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <Logo />
      </header>

      <main id="main" className={styles.main}>
        <h1 className={styles.heading}>Connect</h1>
        <ul className={styles.list} role="list">
          {links.map(link => (
            <li key={link.label}>
              <a
                href={link.href}
                className={styles.link}
                target={link.href.startsWith('mailto:') ? undefined : '_blank'}
                rel={link.href.startsWith('mailto:') ? undefined : 'noopener noreferrer'}
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>
      </main>
    </div>
  );
}
