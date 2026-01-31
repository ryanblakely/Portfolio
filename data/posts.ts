import type { BlockPost } from '@/types';

export const posts: BlockPost[] = [
  {
    format: 'blocks',
    slug: 'hello-world',
    title: 'Hello World',
    date: '2025-01-28',
    excerpt: 'My first post on this new site.',
    content: [
      {
        type: 'text',
        content: `Welcome to my new website. I built this site to share my work and thoughts on software development.

I'll be writing about the products I build, the tools I use, and lessons learned along the way.`,
      },
    ],
  },
  {
    format: 'blocks',
    slug: 'building-this-site',
    title: 'Building This Site',
    date: '2025-01-27',
    excerpt: 'A look at how I built my portfolio with Next.js.',
    content: [
      {
        type: 'text',
        content: `I recently rebuilt my portfolio from scratch using Next.js 15 and React 19. The goal was to create something minimal, fast, and easy to maintain.`,
      },
      {
        type: 'image',
        src: '/about.jpeg',
        alt: 'Sunset sky',
        caption: 'Sometimes you need to step away and look at the sky.',
      },
      {
        type: 'text',
        content: `The site uses CSS Modules for styling with a simple design system built on CSS variables. No component libraries, no Tailwind—just clean, semantic HTML and CSS.`,
      },
    ],
  },
  {
    format: 'blocks',
    slug: 'simple-react-hook',
    title: 'A Simple React Hook',
    date: '2025-01-26',
    excerpt: 'A useful custom hook for handling async state.',
    content: [
      {
        type: 'text',
        content: `Here's a simple custom hook I use in many of my projects. It handles the common pattern of loading, error, and data states for async operations.`,
      },
      {
        type: 'code',
        language: 'typescript',
        content: `import { useState, useCallback } from 'react';

interface AsyncState<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
}

export function useAsync<T>() {
  const [state, setState] = useState<AsyncState<T>>({
    data: null,
    loading: false,
    error: null,
  });

  const execute = useCallback(async (promise: Promise<T>) => {
    setState({ data: null, loading: true, error: null });
    try {
      const data = await promise;
      setState({ data, loading: false, error: null });
      return data;
    } catch (error) {
      setState({ data: null, loading: false, error: error as Error });
      throw error;
    }
  }, []);

  return { ...state, execute };
}`,
      },
      {
        type: 'text',
        content: `You can use it like this:`,
      },
      {
        type: 'code',
        language: 'typescript',
        content: `const { data, loading, error, execute } = useAsync<User>();

useEffect(() => {
  execute(fetchUser(userId));
}, [userId, execute]);`,
      },
      {
        type: 'text',
        content: `Simple, composable, and gets the job done.`,
      },
    ],
  },
];
