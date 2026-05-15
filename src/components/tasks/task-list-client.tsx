"use client";

import { useMemo } from "react";
import { TaskPostCard } from "@/components/shared/task-post-card";
import { buildPostUrl } from "@/lib/task-data";
import { normalizeCategory, isValidCategory } from "@/lib/categories";
import type { TaskKey } from "@/lib/site-config";
import type { SitePost } from "@/lib/site-connector";
import { getLocalPostsForTask } from "@/lib/local-posts";

type Props = {
  task: TaskKey;
  initialPosts: SitePost[];
  category?: string;
  query?: string;
};

export function TaskListClient({ task, initialPosts, category, query }: Props) {
  const localPosts = getLocalPostsForTask(task);
  const selectedCategory = category ? normalizeCategory(category) : "all";
  const searchTerm = query || "";

  const merged = useMemo(() => {
    const bySlug = new Set<string>();
    const combined: Array<SitePost & { localOnly?: boolean; task?: TaskKey }> = [];

    localPosts.forEach((post) => {
      if (post.slug) {
        bySlug.add(post.slug);
      }
      combined.push(post);
    });

    initialPosts.forEach((post) => {
      if (post.slug && bySlug.has(post.slug)) return;
      combined.push(post);
    });

    return combined.filter((post) => {
      const content = post.content && typeof post.content === "object" ? post.content : {};
      const value = typeof (content as any).category === "string" ? (content as any).category : "";
      return !value || isValidCategory(value);
    });
  }, [initialPosts, localPosts]);

  const filtered = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();
    return merged.filter((post) => {
      const content = post.content && typeof post.content === "object" ? post.content : {};
      const normalizedPostCategory =
        typeof (content as any).category === "string"
          ? normalizeCategory((content as any).category)
          : "";

      const categoryMatches =
        selectedCategory === "all" || normalizedPostCategory === selectedCategory;
      if (!categoryMatches) return false;

      if (!query) return true;
      const title = post.title?.toLowerCase() || "";
      const summary = post.summary?.toLowerCase() || "";
      const description =
        typeof (content as any).description === "string"
          ? ((content as any).description as string).toLowerCase()
          : "";
      return (
        title.includes(query) ||
        summary.includes(query) ||
        description.includes(query)
      );
    });
  }, [merged, searchTerm, selectedCategory]);

  if (!merged.length) {
    return null;
  }

  const gridClassName =
    task === "article"
      ? "grid gap-6 md:grid-cols-2 xl:grid-cols-3"
      : task === "pdf"
        ? "grid gap-6 md:grid-cols-2"
        : task === "social"
          ? "grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
          : "grid gap-6 sm:grid-cols-2 lg:grid-cols-4";

  return (
    <div>
      {filtered.length ? (
        <div className={gridClassName}>
          {filtered.map((post) => {
            const localOnly = (post as any).localOnly;
            const href = localOnly
              ? `/local/${task}/${post.slug}`
              : buildPostUrl(task, post.slug);
            return <TaskPostCard key={post.id} post={post} href={href} taskKey={task} compact={task === "pdf" || task === "social"} />;
          })}
        </div>
      ) : (
        <p className="rounded-xl border border-[var(--editorial-line)] bg-white/90 p-4 text-sm text-[var(--editorial-muted)]">
          No articles found for this category/search.
        </p>
      )}
    </div>
  );
}
