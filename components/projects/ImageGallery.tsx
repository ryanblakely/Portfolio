import Image from 'next/image';
import styles from './ImageGallery.module.css';

interface ImageGalleryProps {
  images: string[];
  alt: string;
}

export function ImageGallery({images, alt}: ImageGalleryProps) {
  if (!images || images.length === 0) return null;

  return (
    <div className={styles.gallery}>
      {images.map((src, index) => (
        <div key={src} className={styles.imageWrapper}>
          <Image
            src={src}
            alt={`${alt} - ${index + 1}`}
            width={500}
            height={800}
            className={styles.image}
          />
        </div>
      ))}
    </div>
  );
}
