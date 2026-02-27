'use client';

import {useState} from 'react';
import Image from 'next/image';
import type {Project} from '@/types';
import styles from './Showcase.module.css';

export function Showcase({projects}: {projects: Project[]}) {
  const [selected, setSelected] = useState(0);
  const project = projects[selected];
  const imageSrc = project.previewImage || project.heroImage;

  return (
    <div className={styles.wrapper}>
      <div className={styles.spotlight}>
        <div className={styles.spotlightImage}>
          <Image
            key={project.id}
            src={imageSrc}
            alt={project.name}
            fill
            sizes="800px"
            className={styles.image}
            priority
          />
        </div>
        <div className={styles.spotlightInfo}>
          {project.logo && (
            <Image
              src={project.logo}
              alt=""
              width={56}
              height={56}
              className={styles.spotlightLogo}
            />
          )}
          <h3 className={styles.spotlightName}>{project.name}</h3>
          <p className={styles.spotlightDesc}>{project.description}</p>
          <div className={styles.techTags}>
            {project.tech.map((t) => (
              <span key={t} className={styles.tag}>
                {t}
              </span>
            ))}
          </div>
        </div>
      </div>
      <div className={styles.thumbnails}>
        {projects.map((p, i) => (
          <button
            key={p.id}
            className={`${styles.thumb} ${i === selected ? styles.thumbActive : ''}`}
            onClick={() => setSelected(i)}
          >
            {p.logo && (
              <Image
                src={p.logo}
                alt={p.name}
                width={32}
                height={32}
                className={styles.thumbLogo}
              />
            )}
            <span className={styles.thumbName}>{p.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
