import { TaskListPage } from "@/components/tasks/task-list-page";
import { buildTaskMetadata } from "@/lib/seo";
import { taskPageMetadata } from "@/config/site.content";

export const revalidate = 3;
export const generateMetadata = () =>
  buildTaskMetadata("social", {
    path: "/community",
    title: taskPageMetadata.social.title,
    description: taskPageMetadata.social.description,
  } as any);

export default function CommunityPage({ searchParams }: { searchParams?: { category?: string } }) {
  return <TaskListPage task="social" category={searchParams?.category} />;
}
