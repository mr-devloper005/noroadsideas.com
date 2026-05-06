import { redirect } from "next/navigation";

export const revalidate = 3;

export default async function DevelopersDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  redirect(`/articles/${resolvedParams.slug}`);
}
