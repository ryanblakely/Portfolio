import styles from './TechTags.module.css';

interface TechTagsProps {
  tech: string[];
}

export function TechTags({tech}: TechTagsProps) {
  if (!tech || tech.length === 0) return null;

  return (
    <div className={styles.container}>
      {tech.map(item => (
        <span key={item} className={styles.tag}>
          {item}
        </span>
      ))}
    </div>
  );
}
