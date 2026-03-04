import { getAllPosts } from '@/lib/posts';
import { projects } from '@/data/projects';
import { HomeContent } from '@/components/home/HomeContent';

const isDev = process.env.NODE_ENV === 'development';
const prodProjectIds = ['bitcoin-price-ios', 'eye-tracker', 'front-page'];

export default async function HomePage() {
  const posts = await getAllPosts();
  const visibleProjects = isDev ? projects : projects.filter((p) => prodProjectIds.includes(p.id));

  return <HomeContent posts={posts} projects={visibleProjects} />;
}
