import type { Project } from '@/types';

export const projects: Project[] = [
  // Web apps
  {
    id: 'magfinder',
    name: 'Magfinder',
    platform: 'web',
    category: 'web-apps',
    description: 'A weekly newsletter of independent magazine releases.',
    tech: ['Next.js', 'TypeScript', 'Cloudflare'],
    year: 2024,
    status: 'active',
    heroImage: '/projects/magfinder/hero.svg',
    previewVideo: '/projects/magfinder/preview.mp4',
    websiteUrl: 'https://magfinder.co',
  },
  {
    id: 'text-news',
    name: 'Text-News',
    platform: 'web',
    category: 'web-apps',
    description: 'Minimal, text-based news aggregator with a filter to remove trump.',
    tech: ['React', 'TypeScript'],
    year: 2024,
    status: 'active',
    heroImage: '/projects/text-news/hero.svg',
    previewVideo: '/projects/text-news/preview.mp4',
  },

  // iOS apps
  {
    id: 'one-word',
    name: 'One Word',
    platform: 'ios',
    category: 'ios-apps',
    description: 'Read ebooks, pdfs, urls, and text using Rapid Serial Visual Presentation',
    tech: ['Swift', 'SwiftUI'],
    year: 2024,
    status: 'active',
    heroImage: '/projects/one-word/hero.svg',
    previewVideo: '/projects/one-word/preview.mp4',
  },
  {
    id: 'bitcoin-price-ios',
    name: 'Bitcoin Price',
    platform: 'ios',
    category: 'ios-apps',
    description: 'Real time bitcoin price tracker',
    tech: ['Swift', 'SwiftUI'],
    year: 2024,
    status: 'active',
    heroImage: '/projects/bitcoin-price-ios/hero.svg',
    previewVideo: '/projects/bitcoin-price-ios/preview.mp4',
  },

  // Mac apps
  {
    id: 'bitcoin-price',
    name: 'Bitcoin Price',
    platform: 'macos',
    category: 'mac-apps',
    description: 'Live BTC price in your menu bar',
    tech: ['Swift', 'SwiftUI', 'WebSocket'],
    year: 2024,
    status: 'active',
    heroImage: '/projects/bitcoin-price/hero.svg',
    previewVideo: '/projects/bitcoin-price/preview.mp4',
  },
  {
    id: 'pomo',
    name: 'Pomo',
    platform: 'macos',
    category: 'mac-apps',
    description: 'Pomodoro timer in menu bar',
    tech: ['Swift', 'SwiftUI'],
    year: 2024,
    status: 'active',
    heroImage: '/projects/pomo/hero.svg',
    previewVideo: '/projects/pomo/preview.mp4',
  },
  {
    id: 'to-do',
    name: 'To Do',
    platform: 'macos',
    category: 'mac-apps',
    description: 'Quick tasks from menu bar',
    tech: ['Swift', 'SwiftUI', 'SwiftData'],
    year: 2024,
    status: 'active',
    heroImage: '/projects/to-do/hero.svg',
    previewVideo: '/projects/to-do/preview.mp4',
  },
  {
    id: 'ui-tracker',
    name: 'UI Tracker',
    platform: 'macos',
    category: 'mac-apps',
    description: 'Track UI interactions',
    tech: ['Swift', 'SwiftUI'],
    year: 2024,
    status: 'beta',
    heroImage: '/projects/ui-tracker/hero.svg',
    previewVideo: '/projects/ui-tracker/preview.mp4',
  },
  {
    id: 'one-word-mac',
    name: 'One Word',
    platform: 'macos',
    category: 'mac-apps',
    description: 'Speed read using Rapid Serial Visual Presentation',
    tech: ['Swift', 'SwiftUI'],
    year: 2025,
    status: 'active',
    heroImage: '/projects/one-word-mac/hero.svg',
    previewVideo: '/projects/one-word-mac/preview.mp4',
  },

  // VisionOS apps
  {
    id: 'eye-tracker',
    name: 'Eye Tracker',
    platform: 'visionos',
    category: 'visionos-apps',
    description: 'Eye tracking for Vision Pro',
    tech: ['Swift', 'SwiftUI', 'RealityKit'],
    year: 2024,
    status: 'active',
    heroImage: '/projects/eye-tracker/hero.svg',
    previewImage: '/projects/eye-tracker/preview.svg',
  },

  // Garmin apps
  {
    id: 'watch-face',
    name: 'Watch Face',
    platform: 'garmin',
    category: 'garmin-apps',
    description: 'Minimalist watch face',
    tech: ['Monkey C'],
    year: 2024,
    status: 'active',
    heroImage: '/projects/watch-face/hero.svg',
    previewVideo: '/projects/watch-face/preview.mp4',
  },
];

export function getProjectsByCategory(categorySlug: string): Project[] {
  return projects.filter((project) => project.category === categorySlug);
}

export function getProjectById(id: string): Project | undefined {
  return projects.find((project) => project.id === id);
}

export function getProjectsByCategoryWithSlug(categorySlug: string, projectSlug: string): Project | undefined {
  return projects.find((project) => project.category === categorySlug && project.id === projectSlug);
}
