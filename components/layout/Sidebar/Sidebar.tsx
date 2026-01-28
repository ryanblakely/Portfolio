'use client';

import Link from 'next/link';
import { categories } from '@/data/categories';
import { getProjectsByCategory } from '@/lib/projects';
import type { Project, CategorySlug } from '@/types';
import styles from './Sidebar.module.css';

interface SidebarProps {
  onCategoryHover?: (category: CategorySlug | null) => void;
  activeCategorySlug?: CategorySlug | null;
}

export function Sidebar({ onCategoryHover, activeCategorySlug }: SidebarProps) {
  return (
    <aside className={styles.sidebar} aria-label="Project categories">
      <nav aria-label="Category navigation">
        <ul className={styles.categoryList} role="list">
          {categories.map((category) => {
            const categoryProjects = getProjectsByCategory(category.slug);
            if (categoryProjects.length === 0) return null;

            const isActive = activeCategorySlug === category.slug;
            const projectNames = categoryProjects.map(p => p.shortName || p.name).join(', ');
            const appCount = categoryProjects.length;
            const appLabel = appCount === 1 ? 'app' : 'apps';

            return (
              <li key={category.slug}>
                <Link
                  href={`/${category.slug}`}
                  className={`${styles.categoryItem} ${isActive ? styles.categoryItemActive : ''}`}
                  onMouseEnter={() => onCategoryHover?.(category.slug)}
                  onMouseLeave={() => onCategoryHover?.(null)}
                  onFocus={() => onCategoryHover?.(category.slug)}
                  onBlur={() => onCategoryHover?.(null)}
                >
                  <span className={styles.categoryName}>{category.name}</span>
                  <span className={styles.categoryCount}>{appCount} {appLabel}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
}
