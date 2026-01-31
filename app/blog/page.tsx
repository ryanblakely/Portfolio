import type { Metadata } from 'next';
import Link from 'next/link';
import { Logo } from '@/components/layout/Logo';
import { getAllPosts } from '@/lib/posts';
import styles from './page.module.css';

export const metadata: Metadata = {
  title: 'Blog',
  description: 'Thoughts on software development and building products.',
};

export default async function PostsPage() {
  const posts = await getAllPosts();

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <Logo />
      </header>

      <main id="main" className={styles.main}>
        <h1 className={styles.heading}>Blog</h1>
        <ul className={styles.list} role="list">
          {posts.map((post) => (
            <li key={post.slug} className={styles.item}>
              <Link href={`/blog/${post.slug}`} className={styles.link}>
                {post.title}
              </Link>
              <time className={styles.date} dateTime={post.date}>
                {new Date(post.date).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </time>
            </li>
          ))}
        </ul>
      </main>
    </div>
  );
}
