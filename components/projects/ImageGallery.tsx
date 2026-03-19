import Image from 'next/image';
import type {GalleryImage} from '@/types';
import {normalizeGalleryImage} from '@/types';
import styles from './ImageGallery.module.css';

interface ImageGalleryProps {
  images: (string | GalleryImage)[];
  alt: string;
}

export function ImageGallery({images, alt}: ImageGalleryProps) {
  if (!images || images.length === 0) return null;

  return (
    <div className={styles.gallery}>
      {images.map((img, index) => {
        const {src} = normalizeGalleryImage(img);
        return (
          <div key={src} className={styles.imageWrapper}>
            <Image
              src={src}
              alt={`${alt} - ${index + 1}`}
              width={500}
              height={800}
              className={styles.image}
            />
          </div>
        );
      })}
    </div>
  );
}
