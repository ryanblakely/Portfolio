import type { Metadata } from 'next';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { Logo } from '@/components/layout/Logo';
import { CodeBlock } from '@/components/posts/CodeBlock';
import { getAllPosts, getPostBySlug } from '@/lib/posts';
import type { PostContentBlock } from '@/types';
import styles from './page.module.css';

interface PostPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const posts = getAllPosts();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({ params }: PostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) {
    return {
      title: 'Post Not Found',
    };
  }

  return {
    title: post.title,
    description: post.excerpt,
  };
}

function renderContentBlock(block: PostContentBlock, index: number) {
  switch (block.type) {
    case 'text':
      return (
        <div key={index} className={styles.textBlock}>
          {block.content.split('\n\n').map((paragraph, pIndex) => (
            <p key={pIndex}>{paragraph.trim()}</p>
          ))}
        </div>
      );
    case 'image':
      return (
        <figure key={index} className={styles.imageBlock}>
          <Image
            src={block.src}
            alt={block.alt}
            width={600}
            height={400}
            className={styles.image}
          />
          {block.caption && (
            <figcaption className={styles.caption}>{block.caption}</figcaption>
          )}
        </figure>
      );
    case 'code':
      return (
        <CodeBlock key={index} code={block.content} language={block.language} />
      );
    default:
      return null;
  }
}

export default async function PostPage({ params }: PostPageProps) {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <Logo />
      </header>

      <main id="main" className={styles.main}>
        <article>
          <h1 className={styles.title}>{post.title}</h1>
          <time className={styles.date} dateTime={post.date}>
            {new Date(post.date).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </time>
          <div className={styles.content}>
            {post.content.map((block, index) => renderContentBlock(block, index))}
          </div>
        </article>
      </main>
    </div>
  );
}
