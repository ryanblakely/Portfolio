import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Logo } from '@/components/layout/Logo';
import { SoftwareApplicationJsonLd, BreadcrumbJsonLd } from '@/components/seo/JsonLd';
import { projects } from '@/data/projects';
import { siteConfig } from '@/data/site';
import { getCategoryBySlug } from '@/lib/projects';
import { getProjectByCategoryAndSlugAsync } from '@/lib/projects-server';
import { isMarkdownProject } from '@/types';
import styles from './page.module.css';

interface ProjectPageProps {
  params: Promise<{ category: string; slug: string }>;
}

export async function generateStaticParams() {
  return projects.map((project) => ({
    category: project.category,
    slug: project.id,
  }));
}

export async function generateMetadata({ params }: ProjectPageProps): Promise<Metadata> {
  const { category, slug } = await params;
  const project = await getProjectByCategoryAndSlugAsync(category, slug);

  if (!project) {
    return { title: 'Not Found' };
  }

  return {
    title: project.name,
    description: project.description,
    openGraph: {
      title: project.name,
      description: project.description,
      type: 'website',
    },
  };
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { category: categorySlug, slug } = await params;
  const project = await getProjectByCategoryAndSlugAsync(categorySlug, slug);
  const category = getCategoryBySlug(categorySlug);

  if (!project || !category) {
    notFound();
  }

  const breadcrumbs = [
    { name: 'Home', url: siteConfig.url },
    { name: category.displayName, url: `${siteConfig.url}/${category.slug}` },
    { name: project.name, url: `${siteConfig.url}/${category.slug}/${project.id}` },
  ];

  return (
    <div className={styles.container}>
      <SoftwareApplicationJsonLd project={project} />
      <BreadcrumbJsonLd items={breadcrumbs} />

      <header className={styles.header}>
        <Logo />
      </header>

      <main id="main" className={styles.main}>
        <article className={styles.article}>
          <div className={styles.content}>
            <h1 className={styles.name}>{project.name}</h1>
            {isMarkdownProject(project) ? (
              <div
                className={styles.markdownContent}
                dangerouslySetInnerHTML={{ __html: project.contentHtml }}
              />
            ) : (
              <p className={styles.description}>{project.longDescription || project.description}</p>
            )}
          </div>

          <div className={styles.imageContainer}>
            <Image
              src={project.heroImage}
              alt={`${project.name} preview`}
              fill
              sizes="(max-width: 768px) 100vw, 600px"
              priority
              className={styles.image}
            />
          </div>

          <div className={styles.meta}>
              <div className={styles.metaItem}>
                <span className={styles.metaLabel}>Platform</span>
                <span className={styles.metaValue}>{category.displayName}</span>
              </div>
              <div className={styles.metaItem}>
                <span className={styles.metaLabel}>Year</span>
                <span className={styles.metaValue}>{project.year}</span>
              </div>
              <div className={styles.metaItem}>
                <span className={styles.metaLabel}>Status</span>
                <span className={styles.metaValue}>{project.status}</span>
              </div>
            </div>

            {project.tech.length > 0 && (
              <div className={styles.tech}>
                {project.tech.map((tech) => (
                  <span key={tech} className={styles.techTag}>
                    {tech}
                  </span>
                ))}
              </div>
            )}

            <div className={styles.links}>
              {project.websiteUrl && (
                <a
                  href={project.websiteUrl}
                  className={styles.link}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Visit Website
                </a>
              )}
              {project.appStoreUrl && (
                <a
                  href={project.appStoreUrl}
                  className={styles.link}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  App Store
                </a>
              )}
              {project.githubUrl && (
                <a
                  href={project.githubUrl}
                  className={styles.link}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Source Code
                </a>
              )}
            </div>
        </article>

        <Link href={`/${categorySlug}`} className={styles.backLink}>
          &larr; Back to {category.displayName}
        </Link>
      </main>
    </div>
  );
}
