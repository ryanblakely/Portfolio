import {Logo} from '@/components/layout/Logo';
import {ImageGallery} from '@/components/projects/ImageGallery';
import {TechTags} from '@/components/projects/TechTags';
import {BreadcrumbJsonLd, SoftwareApplicationJsonLd} from '@/components/seo/JsonLd';
import {projects} from '@/data/projects';
import {siteConfig} from '@/data/site';
import {getCategoryBySlug} from '@/lib/projects';
import {getProjectByCategoryAndSlugAsync} from '@/lib/projects-server';
import {isMarkdownProject, MarkdownProject} from '@/types';
import type {Metadata} from 'next';
import {notFound} from 'next/navigation';
import styles from './page.module.css';

const GALLERY_PLACEHOLDER = '<div data-gallery-placeholder="true"></div>';
const TECH_PLACEHOLDER = '<div data-tech-placeholder="true"></div>';

function renderMarkdownContent(project: MarkdownProject) {
  // Split content by all placeholders, keeping track of what each placeholder was
  const placeholderRegex = /(<div data-(?:gallery|tech)-placeholder="true"><\/div>)/g;
  const parts = project.contentHtml.split(placeholderRegex);

  return (
    <>
      {parts.map((part, index) => {
        if (part === GALLERY_PLACEHOLDER && project.galleryImages?.length) {
          return <ImageGallery key={index} images={project.galleryImages} alt={project.name} />;
        }
        if (part === TECH_PLACEHOLDER && project.tech?.length) {
          return <TechTags key={index} tech={project.tech} />;
        }
        if (part && !part.startsWith('<div data-')) {
          return <div key={index} className={styles.markdownContent} dangerouslySetInnerHTML={{__html: part}} />;
        }
        return null;
      })}
    </>
  );
}

interface ProjectPageProps {
  params: Promise<{category: string; slug: string}>;
}

export async function generateStaticParams() {
  return projects.map(project => ({
    category: project.category,
    slug: project.id,
  }));
}

export async function generateMetadata({params}: ProjectPageProps): Promise<Metadata> {
  const {category, slug} = await params;
  const project = await getProjectByCategoryAndSlugAsync(category, slug);

  if (!project) {
    return {title: 'Not Found'};
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

export default async function ProjectPage({params}: ProjectPageProps) {
  const {category: categorySlug, slug} = await params;
  const project = await getProjectByCategoryAndSlugAsync(categorySlug, slug);
  const category = getCategoryBySlug(categorySlug);

  if (!project || !category) {
    notFound();
  }

  const breadcrumbs = [
    {name: 'Home', url: siteConfig.url},
    {name: category.displayName, url: `${siteConfig.url}/${category.slug}`},
    {name: project.name, url: `${siteConfig.url}/${category.slug}/${project.id}`},
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
              renderMarkdownContent(project)
            ) : (
              <p className={styles.description}>{project.longDescription || project.description}</p>
            )}
          </div>
        </article>
      </main>
    </div>
  );
}
