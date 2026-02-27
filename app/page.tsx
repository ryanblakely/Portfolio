import { getAllPosts } from '@/lib/posts';
import { HomeContent } from '@/components/home/HomeContent';

export default async function HomePage() {
  const posts = await getAllPosts();

  return <HomeContent posts={posts} />;
}
