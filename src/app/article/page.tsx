import { TaskListPage } from "@/components/tasks/task-list-page";
import { buildTaskMetadata } from "@/lib/seo";
import { taskPageMetadata } from "@/config/site.content";

export const revalidate = 3;

export const generateMetadata = () =>
  buildTaskMetadata("article", {
    path: "/article",
    title: taskPageMetadata.article.title,
    description: taskPageMetadata.article.description,
  });

export default async function ArticlePage({
  searchParams,
}: {
  searchParams?: Promise<{ category?: string; q?: string }>;
}) {
  const params = (await searchParams) || {};
  return <TaskListPage task="article" category={params.category} query={params.q} />;
}
