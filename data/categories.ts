import type { Category } from '@/types';

export const categories: Category[] = [
  { slug: 'web-apps', name: 'Web', displayName: 'Web apps', platform: 'web', order: 1 },
  { slug: 'ios-apps', name: 'iOS', displayName: 'iOS apps', platform: 'ios', order: 2 },
  { slug: 'mac-apps', name: 'Mac', displayName: 'Mac apps', platform: 'macos', order: 3 },
  { slug: 'visionos-apps', name: 'VisionOS', displayName: 'VisionOS apps', platform: 'visionos', order: 4 },
  { slug: 'garmin-apps', name: 'Garmin', displayName: 'Garmin apps', platform: 'garmin', order: 5 },
];
