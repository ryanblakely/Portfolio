import { siteConfig } from '@/data/site';
import type { Project } from '@/types';

export function PersonJsonLd() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: siteConfig.name,
    jobTitle: siteConfig.title,
    url: siteConfig.url,
    sameAs: [siteConfig.twitter, siteConfig.github].filter(Boolean),
    address: {
      '@type': 'PostalAddress',
      addressLocality: siteConfig.location.city,
      addressRegion: siteConfig.location.state,
      addressCountry: siteConfig.location.country,
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export function WebSiteJsonLd() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: `${siteConfig.name} - ${siteConfig.title}`,
    url: siteConfig.url,
    author: {
      '@type': 'Person',
      name: siteConfig.name,
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

function getOperatingSystem(platform: string): string {
  switch (platform) {
    case 'ios':
      return 'iOS';
    case 'macos':
      return 'macOS';
    case 'visionos':
      return 'visionOS';
    case 'garmin':
      return 'Garmin OS';
    case 'web':
      return 'Web';
    default:
      return platform;
  }
}

function getApplicationCategory(platform: string): string {
  switch (platform) {
    case 'ios':
    case 'macos':
    case 'visionos':
      return 'UtilitiesApplication';
    case 'web':
      return 'WebApplication';
    case 'garmin':
      return 'LifestyleApplication';
    default:
      return 'Application';
  }
}

export function SoftwareApplicationJsonLd({ project }: { project: Project }) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: project.name,
    description: project.description,
    applicationCategory: getApplicationCategory(project.platform),
    operatingSystem: getOperatingSystem(project.platform),
    author: {
      '@type': 'Person',
      name: siteConfig.name,
    },
    ...(project.websiteUrl && { url: project.websiteUrl }),
    ...(project.appStoreUrl && { downloadUrl: project.appStoreUrl }),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

interface BreadcrumbItem {
  name: string;
  url: string;
}

export function BreadcrumbJsonLd({ items }: { items: BreadcrumbItem[] }) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
