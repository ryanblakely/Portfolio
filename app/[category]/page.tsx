import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Logo } from '@/components/layout/Logo';
import { ProjectCard } from '@/components/projects/ProjectCard';
import { categories } from '@/data/categories';
import { getProjectsByCategory, getCategoryBySlug } from '@/lib/projects';
import { BreadcrumbJsonLd } from '@/components/seo/JsonLd';
import { siteConfig } from '@/data/site';
import styles from './page.module.css';

interface CategoryPageProps {
  params: Promise<{ category: string }>;
}

export async function generateStaticParams() {
  return categories.map((cat) => ({
    category: cat.slug,
  }));
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { category: categorySlug } = await params;
  const category = getCategoryBySlug(categorySlug);

  if (!category) {
    return { title: 'Not Found' };
  }

  return {
    title: category.displayName,
    description: `${category.displayName} by ${siteConfig.name}`,
  };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { category: categorySlug } = await params;
  const category = getCategoryBySlug(categorySlug);

  if (!category) {
    notFound();
  }

  const projects = getProjectsByCategory(category.slug);

  const breadcrumbs = [
    { name: 'Home', url: siteConfig.url },
    { name: category.displayName, url: `${siteConfig.url}/${category.slug}` },
  ];

  return (
    <div className={styles.container}>
      <BreadcrumbJsonLd items={breadcrumbs} />

      <header className={styles.header}>
        <Logo />
      </header>

      <main id="main" className={styles.main}>
        <h1 className={styles.heading}>{category.displayName}</h1>

        <div className={styles.grid}>
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      </main>
    </div>
  );
}
