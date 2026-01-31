# React Fade Transitions with Content Switching

Pattern for implementing smooth fade-in/fade-out animations when content changes, without flash/flicker during transitions.

## Problem

Using `key` prop to trigger animations causes React to unmount→remount, creating a brief flash where nothing renders.

## Solution: Animation Restart via Style Reset

Instead of relying on `key` to remount elements, keep content mounted and restart CSS animations programmatically.

### Implementation Pattern

```tsx
import {useEffect, useRef, useState} from 'react';

function FadingContent({content}: {content: ContentType | null}) {
  const [displayedContent, setDisplayedContent] = useState<ContentType | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (content) {
      // If switching content (not initial), restart animation without unmounting
      if (displayedContent && displayedContent.id !== content.id && contentRef.current) {
        contentRef.current.style.animation = 'none';
        contentRef.current.offsetHeight; // Force reflow
        contentRef.current.style.animation = '';
      }
      setDisplayedContent(content);
      setIsVisible(true);
    } else {
      // Fade out with delay
      const fadeTimeout = setTimeout(() => setIsVisible(false), 1000);
      const clearTimeout = setTimeout(() => setDisplayedContent(null), 1300);
      return () => {
        clearTimeout(fadeTimeout);
        clearTimeout(clearTimeout);
      };
    }
  }, [content, displayedContent]);

  return (
    <div className={`wrapper ${isVisible ? 'visible' : ''}`}>
      {displayedContent && (
        <div ref={contentRef} className="content">
          {/* Content here - use key on media elements only */}
          <video key={displayedContent.id} ... />
        </div>
      )}
    </div>
  );
}
```

### CSS Pattern

```css
.wrapper {
  opacity: 0;
  transition: opacity 300ms ease-out;
}

.wrapper.visible {
  opacity: 1;
}

.content {
  animation: fadeIn 150ms ease-out forwards;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}
```

## Key Points

1. **Don't use `key` on wrapper** - causes unmount/remount flash
2. **Use `key` on media elements only** - ensures video/image sources update
3. **Animation restart trick**: `animation: none` → force reflow → `animation: ''`
4. **Two-state visibility**: `isVisible` controls fade, `displayedContent` controls render
5. **Delayed cleanup**: Keep content rendered during fade-out, clear after animation completes

## When to Use

- Hover previews that switch between items
- Tab/carousel content transitions
- Any UI where content changes but container stays mounted
