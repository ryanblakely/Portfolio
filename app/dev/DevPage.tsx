'use client';

import { useState } from 'react';
import Image from 'next/image';
import { projects } from '@/data/projects';
import styles from './page.module.css';

const ICON_SIZES = [32, 40, 48];
const GAPS = [4, 12, 20, 32];

const TABS = [
  { id: 'fonts', label: 'Fonts' },
  { id: 'headers', label: 'Blog Headers' },
  { id: 'projects', label: 'Project Cards' },
] as const;

type TabId = typeof TABS[number]['id'];

const FONTS = [
  {
    name: 'Inter',
    family: "'Inter', sans-serif",
    import: '',
    note: 'Current font — clean, neutral, ubiquitous',
  },
  {
    name: 'Geist',
    family: "'Geist', sans-serif",
    import: 'https://fonts.googleapis.com/css2?family=Geist:wght@200..900&display=swap',
    note: "Vercel's font — Swiss precision meets modern web",
  },
  {
    name: 'Plus Jakarta Sans',
    family: "'Plus Jakarta Sans', sans-serif",
    import: 'https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300..700&display=swap',
    note: 'Warm geometric — friendly but credible',
  },
  {
    name: 'Space Grotesk',
    family: "'Space Grotesk', sans-serif",
    import: 'https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300..700&display=swap',
    note: 'Quasi-monospaced character — technical, distinctive',
  },
  {
    name: 'Manrope',
    family: "'Manrope', sans-serif",
    import: 'https://fonts.googleapis.com/css2?family=Manrope:wght@200..800&display=swap',
    note: 'Engineered simplicity — structured and upright',
  },
  {
    name: 'DM Sans',
    family: "'DM Sans', sans-serif",
    import: 'https://fonts.googleapis.com/css2?family=DM+Sans:wght@100..900&display=swap',
    note: 'Compact geometric — great at small sizes',
  },
  {
    name: 'Figtree',
    family: "'Figtree', sans-serif",
    import: 'https://fonts.googleapis.com/css2?family=Figtree:wght@300..900&display=swap',
    note: 'Curved terminals — clean yet friendly',
  },
  {
    name: 'Albert Sans',
    family: "'Albert Sans', sans-serif",
    import: 'https://fonts.googleapis.com/css2?family=Albert+Sans:wght@100..900&display=swap',
    note: 'Scandinavian minimalism — carefully considered',
  },
];

function FontPreview({ font }: { font: typeof FONTS[number] }) {
  const ff = { fontFamily: font.family };
  return (
    <div className={styles.fontCard}>
      <div className={styles.fontCardHeader}>
        <h3 className={styles.fontName} style={ff}>{font.name}</h3>
        <p className={styles.fontNote}>{font.note}</p>
      </div>

      <div className={styles.fontPreviews}>
        {/* Landing page preview */}
        <div className={styles.fontPreviewBox}>
          <span className={styles.fontPreviewLabel}>Landing</span>
          <div style={ff}>
            <p style={{ fontSize: 32, fontWeight: 500, color: '#a3a3a3', letterSpacing: '-0.02em', lineHeight: 1.15, marginBottom: 6 }}>
              Ryan Blakely
            </p>
            <p style={{ fontSize: 16, fontWeight: 400, color: '#171717' }}>
              Software Engineer in Philadelphia
            </p>
            <div style={{ marginTop: 28, display: 'flex', flexDirection: 'column', gap: 16 }}>
              {projects.slice(0, 3).map((p) => (
                <div key={p.id} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  {p.logo && <Image src={p.logo} alt="" width={36} height={36} style={{ borderRadius: 8 }} />}
                  <div>
                    <span style={{ fontSize: 15, fontWeight: 500, color: '#171717', display: 'block' }}>{p.name}</span>
                    <span style={{ fontSize: 13, color: '#737373' }}>{p.description}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Blog post preview */}
        <div className={styles.fontPreviewBox}>
          <span className={styles.fontPreviewLabel}>Blog Post</span>
          <div style={ff}>
            <p style={{ fontSize: 36, fontWeight: 300, color: '#525252', letterSpacing: '0.05em', lineHeight: 1.2, marginBottom: 40 }}>
              Ryan Blakely
            </p>
            <p style={{ fontSize: 22, fontWeight: 600, color: '#171717', letterSpacing: '-0.015em', lineHeight: 1.3, marginBottom: 6 }}>
              Learning tmux
            </p>
            <p style={{ fontSize: 14, color: '#737373', marginBottom: 24 }}>
              February 9, 2026
            </p>
            <p style={{ fontSize: 16, lineHeight: 1.7, color: '#171717' }}>
              Sessions are independent tmux instances, like separate workspaces. Windows are tabs within a session. Panes are splits within a window.
            </p>
          </div>
        </div>
      </div>

      {/* Type specimen */}
      <div className={styles.fontSpecimen} style={ff}>
        <p style={{ fontSize: 14, color: '#737373', marginBottom: 8 }}>Weights</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          <span style={{ fontWeight: 300, fontSize: 15 }}>Light 300 — The quick brown fox jumps over the lazy dog</span>
          <span style={{ fontWeight: 400, fontSize: 15 }}>Regular 400 — The quick brown fox jumps over the lazy dog</span>
          <span style={{ fontWeight: 500, fontSize: 15 }}>Medium 500 — The quick brown fox jumps over the lazy dog</span>
          <span style={{ fontWeight: 600, fontSize: 15 }}>Semibold 600 — The quick brown fox jumps over the lazy dog</span>
          <span style={{ fontWeight: 700, fontSize: 15 }}>Bold 700 — The quick brown fox jumps over the lazy dog</span>
        </div>
      </div>
    </div>
  );
}

function BlogPostPreview({ headerStyle }: { headerStyle: React.CSSProperties }) {
  return (
    <div className={styles.blogPreview}>
      <a href="#" className={styles.blogHeaderLink} style={headerStyle}>
        Ryan Blakely
      </a>
      <div className={styles.blogContent}>
        <h2 className={styles.blogTitle}>Learning tmux</h2>
        <p className={styles.blogDate}>February 9, 2026</p>
        <div className={styles.blogBody}>
          <p>Notes to self as I learn tmux. Sessions are independent tmux instances, like separate workspaces. Windows are tabs within a session, like browser tabs. Panes are splits within a window.</p>
        </div>
      </div>
    </div>
  );
}

export default function DevPage() {
  const [activeTab, setActiveTab] = useState<TabId>('fonts');

  return (
    <div className={styles.page}>
      {/* Load Google Fonts */}
      {FONTS.filter(f => f.import).map(f => (
        // eslint-disable-next-line @next/next/no-page-custom-font
        <link key={f.name} rel="stylesheet" href={f.import} />
      ))}

      <h1 className={styles.pageTitle}>Design Previews</h1>

      <div className={styles.tabBar}>
        {TABS.map((tab) => (
          <button
            key={tab.id}
            className={`${styles.tab} ${activeTab === tab.id ? styles.tabActive : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* ══ FONTS TAB ══ */}
      {activeTab === 'fonts' && (
        <div className={styles.fontGrid}>
          {FONTS.map((font) => (
            <FontPreview key={font.name} font={font} />
          ))}
        </div>
      )}

      {/* ══ BLOG HEADERS TAB ══ */}
      {activeTab === 'headers' && (
        <>
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>1. Ultra-Light — Generous Spacing</h2>
            <p className={styles.sectionDesc}>Light weight + muted gray + gentle letter spacing. Feels like air.</p>
            <BlogPostPreview headerStyle={{ fontSize: '40px', fontWeight: 300, color: '#525252', letterSpacing: '0.05em', lineHeight: 1.2 }} />
          </section>
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>2. Uppercase — Wide Tracking (Luxe)</h2>
            <p className={styles.sectionDesc}>Uppercase + wide letter spacing. Luxury editorial feel.</p>
            <BlogPostPreview headerStyle={{ fontSize: '32px', fontWeight: 400, color: '#737373', letterSpacing: '0.1em', textTransform: 'uppercase' as const, lineHeight: 1.3 }} />
          </section>
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>3. Medium Weight — Soft Gray</h2>
            <p className={styles.sectionDesc}>Medium weight (500) at a moderate size. Clean and grounded.</p>
            <BlogPostPreview headerStyle={{ fontSize: '36px', fontWeight: 500, color: '#838383', letterSpacing: '0.02em', lineHeight: 1.15 }} />
          </section>
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>4. Large + Low Opacity — Watermark</h2>
            <p className={styles.sectionDesc}>Primary color at 40% opacity. Ghosted, refined, present but quiet.</p>
            <BlogPostPreview headerStyle={{ fontSize: '48px', fontWeight: 300, color: '#171717', opacity: 0.4, letterSpacing: '0.01em', lineHeight: 1.1 }} />
          </section>
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>5. Semibold — Tracked Out</h2>
            <p className={styles.sectionDesc}>Semibold + generous spacing. Readable with understated elegance.</p>
            <BlogPostPreview headerStyle={{ fontSize: '34px', fontWeight: 600, color: '#525252', letterSpacing: '0.06em', lineHeight: 1.2 }} />
          </section>
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>6. Thin + Underline — Contemporary</h2>
            <p className={styles.sectionDesc}>Ultra-light weight with a subtle bottom border. Sophisticated.</p>
            <BlogPostPreview headerStyle={{ fontSize: '40px', fontWeight: 200, color: '#171717', letterSpacing: '0.04em', lineHeight: 1.2, borderBottom: '1px solid #E5E5E5', paddingBottom: '16px', display: 'block' }} />
          </section>
        </>
      )}

      {/* ══ PROJECT CARDS TAB ══ */}
      {activeTab === 'projects' && (
        <>
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>A. Current Layout — Varying Whitespace</h2>
            <div className={styles.variants}>
              {GAPS.map((gap) => (
                <div key={gap} className={styles.variant}>
                  <h3 className={styles.variantLabel}>gap: {gap}px</h3>
                  <div className={styles.projectList} style={{ gap: `${gap}px` }}>
                    {projects.map((project) => (
                      <div key={project.id} className={styles.card}>
                        {project.logo && <Image src={project.logo} alt="" width={40} height={40} className={styles.logo} />}
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
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>B. Inline Layout — <strong>Name</strong>: description</h2>
            <div className={styles.variants}>
              {ICON_SIZES.map((size) => (
                <div key={size} className={styles.variant}>
                  <h3 className={styles.variantLabel}>{size}px icon</h3>
                  <div className={styles.projectList} style={{ gap: '12px' }}>
                    {projects.map((project) => (
                      <div key={project.id} className={styles.cardInline}>
                        {project.logo && <Image src={project.logo} alt="" width={size} height={size} className={styles.logo} style={{ width: size, height: size }} />}
                        <p className={styles.cardInlineText}>
                          <strong className={styles.inlineName}>{project.name}</strong>{': '}
                          <span className={styles.inlineDesc}>{project.description}</span>
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>C. Inline Layout — Varying Whitespace (40px icon)</h2>
            <div className={styles.variants}>
              {GAPS.map((gap) => (
                <div key={gap} className={styles.variant}>
                  <h3 className={styles.variantLabel}>gap: {gap}px</h3>
                  <div className={styles.projectList} style={{ gap: `${gap}px` }}>
                    {projects.map((project) => (
                      <div key={project.id} className={styles.cardInline}>
                        {project.logo && <Image src={project.logo} alt="" width={40} height={40} className={styles.logo} />}
                        <p className={styles.cardInlineText}>
                          <strong className={styles.inlineName}>{project.name}</strong>{': '}
                          <span className={styles.inlineDesc}>{project.description}</span>
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>
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
                          <strong className={styles.inlineName}>{project.name}</strong>{': '}
                          <span className={styles.inlineDesc}>{project.description}</span>
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>
        </>
      )}
    </div>
  );
}
