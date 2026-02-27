'use client';

import Image from 'next/image';
import { projects } from '@/data/projects';
import styles from './page.module.css';

const ICON_SIZES = [32, 40, 48];
const GAPS = [4, 12, 20, 32];

export default function DevPage() {
  return (
    <div className={styles.page}>
      <h1 className={styles.pageTitle}>Design Previews</h1>

      {/* ── SECTION A: Current (two-line) layout with different gaps ── */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>A. Current Layout — Varying Whitespace</h2>
        <div className={styles.variants}>
          {GAPS.map((gap) => (
            <div key={gap} className={styles.variant}>
              <h3 className={styles.variantLabel}>gap: {gap}px</h3>
              <div className={styles.projectList} style={{ gap: `${gap}px` }}>
                {projects.map((project) => (
                  <div key={project.id} className={styles.card}>
                    {project.logo && (
                      <Image src={project.logo} alt="" width={40} height={40} className={styles.logo} />
                    )}
                    <div className={styles.cardText}>
                      <span className={styles.cardName}>{project.name}</span>
                      <span className={styles.cardDesc}>{project.description}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── SECTION B: Inline "Name: description" with different icon sizes ── */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>B. Inline Layout — <strong>Name</strong>: description</h2>
        <div className={styles.variants}>
          {ICON_SIZES.map((size) => (
            <div key={size} className={styles.variant}>
              <h3 className={styles.variantLabel}>{size}px icon</h3>
              <div className={styles.projectList} style={{ gap: '12px' }}>
                {projects.map((project) => (
                  <div key={project.id} className={styles.cardInline}>
                    {project.logo && (
                      <Image
                        src={project.logo}
                        alt=""
                        width={size}
                        height={size}
                        className={styles.logo}
                        style={{ width: size, height: size }}
                      />
                    )}
                    <p className={styles.cardInlineText}>
                      <strong className={styles.inlineName}>{project.name}</strong>
                      {': '}
                      <span className={styles.inlineDesc}>{project.description}</span>
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── SECTION C: Inline layout with varying whitespace ── */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>C. Inline Layout — Varying Whitespace (40px icon)</h2>
        <div className={styles.variants}>
          {GAPS.map((gap) => (
            <div key={gap} className={styles.variant}>
              <h3 className={styles.variantLabel}>gap: {gap}px</h3>
              <div className={styles.projectList} style={{ gap: `${gap}px` }}>
                {projects.map((project) => (
                  <div key={project.id} className={styles.cardInline}>
                    {project.logo && (
                      <Image src={project.logo} alt="" width={40} height={40} className={styles.logo} />
                    )}
                    <p className={styles.cardInlineText}>
                      <strong className={styles.inlineName}>{project.name}</strong>
                      {': '}
                      <span className={styles.inlineDesc}>{project.description}</span>
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── SECTION D: Inline, no icon ── */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>D. Inline Layout — No Icon</h2>
        <div className={styles.variants}>
          {[12, 20].map((gap) => (
            <div key={gap} className={styles.variant}>
              <h3 className={styles.variantLabel}>gap: {gap}px</h3>
              <div className={styles.projectList} style={{ gap: `${gap}px` }}>
                {projects.map((project) => (
                  <div key={project.id} className={styles.cardInlineNoIcon}>
                    <p className={styles.cardInlineText}>
                      <strong className={styles.inlineName}>{project.name}</strong>
                      {': '}
                      <span className={styles.inlineDesc}>{project.description}</span>
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
