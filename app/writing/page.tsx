import type { Metadata } from 'next';
import Link from 'next/link';
import { getAllPosts } from '@/lib/posts';
import styles from './page.module.css';

export const metadata: Metadata = {
  title: 'Writing',
  description: 'Thoughts on software development and building products.',
};

export default async function PostsPage() {
  const posts = await getAllPosts();

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <Link href="/" className={styles.backLink}>Ryan Blakely</Link>
      </header>

      <main id="main" className={styles.main}>
        <h1 className={styles.heading}>Writing</h1>
        <ul className={styles.list} role="list">
          {posts.map((post) => (
            <li key={post.slug} className={styles.item}>
              <Link href={`/writing/${post.slug}`} className={styles.link}>
                {post.title}
              </Link>
              <time className={styles.date} dateTime={post.date}>
                {new Date(post.date).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  timeZone: 'UTC',
                })}
              </time>
            </li>
          ))}
        </ul>
      </main>
    </div>
  );
}
