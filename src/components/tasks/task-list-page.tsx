import Link from 'next/link'
import { ArrowRight, Building2, FileText, Image as ImageIcon, LayoutGrid, Tag, User, MessageCircle } from 'lucide-react'
import { NavbarShell } from '@/components/shared/navbar-shell'
import { Footer } from '@/components/shared/footer'
import { TaskPostCard } from '@/components/shared/task-post-card'
import { TaskListClient } from '@/components/tasks/task-list-client'
import { SchemaJsonLd } from '@/components/seo/schema-jsonld'
import { buildPostUrl, fetchTaskPosts } from '@/lib/task-data'
import { SITE_CONFIG, getTaskConfig, type TaskKey } from '@/lib/site-config'
import { CATEGORY_OPTIONS, normalizeCategory } from '@/lib/categories'
import { taskIntroCopy } from '@/config/site.content'
import { getFactoryState } from '@/design/factory/get-factory-state'
import { TASK_LIST_PAGE_OVERRIDE_ENABLED, TaskListPageOverride } from '@/overrides/task-list-page'
import type { SitePost } from '@/lib/site-connector'

const taskIcons: Record<TaskKey, any> = {
  listing: Building2,
  article: FileText,
  image: ImageIcon,
  profile: User,
  classified: Tag,
  sbm: LayoutGrid,
  social: LayoutGrid,
  pdf: FileText,
  org: Building2,
  comment: FileText,
}

const variantShells = {
  'listing-directory': 'bg-[radial-gradient(circle_at_top_left,rgba(56,189,248,0.08),transparent_24%),linear-gradient(180deg,#f8fbff_0%,#ffffff_100%)]',
  'listing-showcase': 'bg-[linear-gradient(180deg,#ffffff_0%,#f4f9ff_100%)]',
  'article-editorial': 'bg-[radial-gradient(circle_at_top_left,rgba(251,191,36,0.08),transparent_20%),linear-gradient(180deg,#fff8ef_0%,#ffffff_100%)]',
  'article-journal': 'bg-[linear-gradient(180deg,#fffdf9_0%,#f7f1ea_100%)]',
  'image-masonry': 'bg-[linear-gradient(180deg,#09101d_0%,#111c2f_100%)] text-white',
  'image-portfolio': 'bg-[linear-gradient(180deg,#07111f_0%,#13203a_100%)] text-white',
  'profile-creator': 'bg-[linear-gradient(180deg,#0a1120_0%,#101c34_100%)] text-white',
  'profile-business': 'bg-[linear-gradient(180deg,#f6fbff_0%,#ffffff_100%)]',
  'classified-bulletin': 'bg-[linear-gradient(180deg,#edf3e4_0%,#ffffff_100%)]',
  'classified-market': 'bg-[linear-gradient(180deg,#f4f6ef_0%,#ffffff_100%)]',
  'sbm-curation': 'bg-[linear-gradient(180deg,#fff7ee_0%,#ffffff_100%)]',
  'sbm-library': 'bg-[linear-gradient(180deg,#f7f8fc_0%,#ffffff_100%)]',
} as const

export async function TaskListPage({ task, category, query }: { task: TaskKey; category?: string; query?: string }) {
  if (TASK_LIST_PAGE_OVERRIDE_ENABLED) {
    return await TaskListPageOverride({ task, category })
  }

  const taskConfig = getTaskConfig(task)
  const posts = await fetchTaskPosts(task, 30, { allowMockFallback: task === 'article' })
  const normalizedCategory = category ? normalizeCategory(category) : 'all'
  const normalizedQuery = (query || '').trim()
  const queryLower = normalizedQuery.toLowerCase()
  const filterPosts = (items: SitePost[]) =>
    items.filter((post) => {
      const content = post.content && typeof post.content === 'object' ? post.content : {}
      const rawCategory = typeof (content as any).category === 'string' ? (content as any).category : ''
      const postCategory = rawCategory ? normalizeCategory(rawCategory) : ''
      const categoryMatches = normalizedCategory === 'all' || postCategory === normalizedCategory
      if (!categoryMatches) return false
      if (!queryLower) return true
      const title = post.title?.toLowerCase() || ''
      const summary = post.summary?.toLowerCase() || ''
      const description = typeof (content as any).description === 'string' ? ((content as any).description as string).toLowerCase() : ''
      return title.includes(queryLower) || summary.includes(queryLower) || description.includes(queryLower)
    })
  const intro = taskIntroCopy[task]
  const baseUrl = SITE_CONFIG.baseUrl.replace(/\/$/, '')
  const schemaItems = posts.slice(0, 10).map((post, index) => ({
    '@type': 'ListItem',
    position: index + 1,
    url: `${baseUrl}${taskConfig?.route || '/posts'}/${post.slug}`,
    name: post.title,
  }))
  const { recipe } = getFactoryState()
  const layoutKey = recipe.taskLayouts[task as keyof typeof recipe.taskLayouts] || `${task}-${task === 'listing' ? 'directory' : 'editorial'}`
  const isArticleTask = task === 'article'
  const isPdfTask = task === 'pdf'
  const isSocialTask = task === 'social'
  const shouldShowFeaturedSection = isArticleTask || isPdfTask || isSocialTask
  const shellClass =
    isArticleTask
      ? 'bg-[radial-gradient(circle_at_top_left,rgba(122,170,206,0.14),transparent_24%),linear-gradient(180deg,#f7f8f0_0%,#ffffff_100%)]'
      : isPdfTask
        ? 'bg-[radial-gradient(circle_at_top_left,rgba(53,88,114,0.1),transparent_22%),linear-gradient(180deg,#f1f5f7_0%,#ffffff_100%)]'
        : isSocialTask
          ? 'bg-[radial-gradient(circle_at_top_left,rgba(156,213,255,0.14),transparent_24%),linear-gradient(180deg,#eef4f6_0%,#ffffff_100%)]'
          : variantShells[layoutKey as keyof typeof variantShells] || 'bg-background'
  const Icon = taskIcons[task] || LayoutGrid

  const isDark = ['image-masonry', 'image-portfolio', 'profile-creator'].includes(layoutKey)
  const ui = isDark
    ? {
        muted: 'text-slate-300',
        panel: 'border border-white/10 bg-white/6',
        soft: 'border border-white/10 bg-white/5',
        input: 'border-white/10 bg-white/6 text-white',
        button: 'bg-white text-slate-950 hover:bg-slate-200',
      }
    : isArticleTask
      ? {
          muted: 'text-[var(--editorial-muted)]',
          panel: 'border border-[var(--editorial-line)] bg-white/90',
          soft: 'border border-[var(--editorial-line)] bg-[rgba(53,88,114,0.04)]',
          input: 'border border-[var(--editorial-line)] bg-white text-[var(--editorial-ink)]',
          button: 'bg-[var(--editorial-ink)] text-[var(--editorial-paper)] hover:bg-[#243847]',
        }
      : isPdfTask
        ? {
          muted: 'text-[#586b78]',
          panel: 'border border-[rgba(53,88,114,0.16)] bg-white',
          soft: 'border border-[rgba(53,88,114,0.16)] bg-[rgba(122,170,206,0.06)]',
          input: 'border border-[rgba(53,88,114,0.16)] bg-white text-[#172633]',
          button: 'bg-[#355872] text-[#f7f8f0] hover:bg-[#2c4b62]',
        }
      : isSocialTask
        ? {
          muted: 'text-[#536475]',
          panel: 'border border-[rgba(53,88,114,0.14)] bg-white/95',
          soft: 'border border-[rgba(53,88,114,0.14)] bg-[rgba(156,213,255,0.08)]',
          input: 'border border-[rgba(53,88,114,0.14)] bg-white text-[#172633]',
          button: 'bg-[#355872] text-[#f7f8f0] hover:bg-[#2c4b62]',
        }
      : {
          muted: 'text-slate-600',
          panel: 'border border-slate-200 bg-white',
          soft: 'border border-slate-200 bg-slate-50',
          input: 'border border-slate-200 bg-white text-slate-950',
          button: 'bg-slate-950 text-white hover:bg-slate-800',
        }
  const filteredPosts = filterPosts(posts)
  const featuredPosts = filteredPosts.slice(0, 3)
  const featuredSlugs = new Set(featuredPosts.map((post) => post.slug))
  const remainingPosts = shouldShowFeaturedSection
    ? filteredPosts.filter((post) => !featuredSlugs.has(post.slug))
    : filteredPosts

  return (
    <div className={`min-h-screen ${shellClass}`}>
      <NavbarShell />
      <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        {task === 'listing' ? (
          <SchemaJsonLd
            data={[
              {
                '@context': 'https://schema.org',
                '@type': 'ItemList',
                name: 'Business Directory Listings',
                itemListElement: schemaItems,
              },
              {
                '@context': 'https://schema.org',
                '@type': 'LocalBusiness',
                name: SITE_CONFIG.name,
                url: `${baseUrl}/listings`,
                areaServed: 'Worldwide',
              },
            ]}
          />
        ) : null}
        {task === 'article' || task === 'classified' ? (
          <SchemaJsonLd
            data={{
              '@context': 'https://schema.org',
              '@type': 'CollectionPage',
              name: `${taskConfig?.label || task} | ${SITE_CONFIG.name}`,
              url: `${baseUrl}${taskConfig?.route || ''}`,
              hasPart: schemaItems,
            }}
          />
        ) : null}

        {layoutKey === 'listing-directory' || layoutKey === 'listing-showcase' ? (
          <section className="mb-12 grid gap-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
            <div className={`rounded-[2rem] p-7 shadow-[0_24px_70px_rgba(15,23,42,0.07)] ${ui.panel}`}>
              <div className="flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.24em] opacity-70"><Icon className="h-4 w-4" /> {taskConfig?.label || task}</div>
              <h1 className="mt-4 text-4xl font-semibold tracking-[-0.04em] text-foreground">{taskConfig?.description || 'Latest posts'}</h1>
              <p className={`mt-4 max-w-2xl text-sm leading-7 ${ui.muted}`}>Built with a cleaner scan rhythm, stronger metadata grouping, and a structure designed for business discovery rather than editorial reading.</p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link href={taskConfig?.route || '#'} className={`inline-flex items-center gap-2 rounded-full px-5 py-3 text-sm font-semibold ${ui.button}`}>Explore results <ArrowRight className="h-4 w-4" /></Link>
                <Link href="/search" className={`inline-flex items-center gap-2 rounded-full px-5 py-3 text-sm font-semibold ${ui.soft}`}>Open search</Link>
              </div>
            </div>
            <form className={`grid gap-3 rounded-[2rem] p-6 shadow-[0_18px_50px_rgba(15,23,42,0.06)] ${ui.soft}`} action={taskConfig?.route || '#'}>
              <div>
                <label className={`text-xs uppercase tracking-[0.2em] ${ui.muted}`}>Category</label>
                <select name="category" defaultValue={normalizedCategory} className={`mt-2 h-11 w-full rounded-xl px-3 text-sm ${ui.input}`}>
                  <option value="all">All categories</option>
                  {CATEGORY_OPTIONS.map((item) => (
                    <option key={item.slug} value={item.slug}>{item.name}</option>
                  ))}
                </select>
              </div>
              <button type="submit" className={`h-11 rounded-xl text-sm font-medium ${ui.button}`}>Apply filters</button>
            </form>
          </section>
        ) : null}

        {isArticleTask ? (
          <section className="mb-12">
            <h1 className="max-w-4xl text-5xl font-semibold tracking-[-0.05em] text-foreground">{taskConfig?.description || 'Latest posts'}</h1>
            <p className={`mt-5 max-w-2xl text-sm leading-8 ${ui.muted}`}>Articles get more breathing room, stronger hierarchy, and a reading rhythm that feels intentionally editorial rather than feed-like.</p>
            <form className={`mt-6 grid gap-3 rounded-[1.4rem] p-4 md:grid-cols-[220px_1fr_auto] ${ui.panel}`} action={taskConfig?.route || '#'}>
              <select name="category" defaultValue={normalizedCategory} className={`h-11 rounded-xl px-3 text-sm ${ui.input}`}>
                <option value="all">All categories</option>
                {CATEGORY_OPTIONS.map((item) => (
                  <option key={item.slug} value={item.slug}>{item.name}</option>
                ))}
              </select>
              <input
                name="q"
                defaultValue={normalizedQuery}
                placeholder="Search articles in selected category..."
                className={`h-11 rounded-xl px-3 text-sm ${ui.input}`}
              />
              <button type="submit" className={`h-11 rounded-xl px-4 text-sm font-medium ${ui.button}`}>Search</button>
            </form>
          </section>
        ) : null}

        {isPdfTask ? (
          <section className="mb-12 grid gap-8 lg:grid-cols-[1.02fr_0.98fr] lg:items-start">
            <div>
              <span className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.24em] ${ui.soft}`}>
                <FileText className="h-3.5 w-3.5" />
                PDF archive
              </span>
              <h1 className="mt-4 max-w-4xl text-5xl font-semibold tracking-[-0.05em] text-foreground">{taskConfig?.description || 'Latest posts'}</h1>
              <p className={`mt-5 max-w-2xl text-sm leading-8 ${ui.muted}`}>Document-style posts use a cleaner archive rhythm, with denser metadata and a lighter card system that feels closer to a library than a feed.</p>
            </div>
            <div className={`rounded-[2rem] p-6 ${ui.panel}`}>
              <p className={`text-xs font-semibold uppercase tracking-[0.24em] ${ui.muted}`}>Archive filters</p>
              <p className={`mt-4 text-sm leading-7 ${ui.muted}`}>Use category filters to narrow the archive and keep the document lane easier to scan.</p>
              <div className="mt-6 grid gap-3 sm:grid-cols-3">
                {['Reports', 'Guides', 'Downloads'].map((item) => (
                  <div key={item} className={`rounded-[1.4rem] p-4 ${ui.soft}`}>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.22em] opacity-70">Section</p>
                    <h3 className="mt-2 text-sm font-semibold leading-6">{item}</h3>
                  </div>
                ))}
              </div>
            </div>
          </section>
        ) : null}

        {isSocialTask ? (
          <section className="mb-12 grid gap-8 lg:grid-cols-[1.02fr_0.98fr] lg:items-start">
            <div>
              <span className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.24em] ${ui.soft}`}>
                <MessageCircle className="h-3.5 w-3.5" />
                Bulletin board
              </span>
              <h1 className="mt-4 max-w-4xl text-5xl font-semibold tracking-[-0.05em] text-foreground">{taskConfig?.description || 'Latest posts'}</h1>
              <p className={`mt-5 max-w-2xl text-sm leading-8 ${ui.muted}`}>Short updates sit in a calmer bulletin layout so community signals feel present without overpowering the editorial read.</p>
            </div>
            <div className={`rounded-[2rem] p-6 ${ui.panel}`}>
              <p className={`text-xs font-semibold uppercase tracking-[0.24em] ${ui.muted}`}>Community cues</p>
              <div className="mt-6 grid gap-3 sm:grid-cols-3">
                {['Updates', 'Links', 'Replies'].map((item) => (
                  <div key={item} className={`rounded-[1.4rem] p-4 ${ui.soft}`}>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.22em] opacity-70">Mode</p>
                    <h3 className="mt-2 text-sm font-semibold leading-6">{item}</h3>
                  </div>
                ))}
              </div>
            </div>
          </section>
        ) : null}

        {layoutKey === 'image-masonry' || layoutKey === 'image-portfolio' ? (
          <section className="mb-12 grid gap-6 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
            <div>
              <div className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] ${ui.soft}`}>
                <Icon className="h-3.5 w-3.5" /> Visual feed
              </div>
              <h1 className="mt-5 text-5xl font-semibold tracking-[-0.05em]">{taskConfig?.description || 'Latest posts'}</h1>
              <p className={`mt-5 max-w-2xl text-sm leading-8 ${ui.muted}`}>This surface leans into stronger imagery, larger modules, and more expressive spacing so visual content feels materially different from reading and directory pages.</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className={`min-h-[220px] rounded-[2rem] ${ui.panel}`} />
              <div className={`min-h-[220px] rounded-[2rem] ${ui.soft}`} />
              <div className={`col-span-2 min-h-[120px] rounded-[2rem] ${ui.panel}`} />
            </div>
          </section>
        ) : null}

        {layoutKey === 'profile-creator' || layoutKey === 'profile-business' ? (
          <section className={`mb-12 rounded-[2.2rem] p-8 shadow-[0_24px_70px_rgba(15,23,42,0.1)] ${ui.panel}`}>
            <div className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
              <div className={`min-h-[240px] rounded-[2rem] ${ui.soft}`} />
              <div>
                <p className={`text-xs uppercase tracking-[0.3em] ${ui.muted}`}>{taskConfig?.label || task}</p>
                <h1 className="mt-3 text-4xl font-semibold tracking-[-0.05em] text-foreground">Profiles with stronger identity, trust, and reputation cues.</h1>
                <p className={`mt-5 max-w-2xl text-sm leading-8 ${ui.muted}`}>This layout prioritizes the person or business surface first, then lets the feed continue below without borrowing the same visual logic used by articles or listings.</p>
              </div>
            </div>
          </section>
        ) : null}

        {layoutKey === 'classified-bulletin' || layoutKey === 'classified-market' ? (
          <section className="mb-12 grid gap-4 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
            <div className={`rounded-[1.8rem] p-6 ${ui.panel}`}>
              <p className={`text-xs uppercase tracking-[0.3em] ${ui.muted}`}>{taskConfig?.label || task}</p>
              <h1 className="mt-3 text-4xl font-semibold tracking-[-0.05em] text-foreground">Fast-moving notices, offers, and responses in a compact board format.</h1>
            </div>
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
              {['Quick to scan', 'Shorter response path', 'Clearer urgency cues'].map((item) => (
                <div key={item} className={`rounded-[1.5rem] p-5 ${ui.soft}`}>
                  <p className="text-sm font-semibold">{item}</p>
                </div>
              ))}
            </div>
          </section>
        ) : null}

        {layoutKey === 'sbm-curation' || layoutKey === 'sbm-library' ? (
          <section className="mb-12 grid gap-6 lg:grid-cols-[1.15fr_0.85fr] lg:items-start">
            <div>
              <p className={`text-xs uppercase tracking-[0.3em] ${ui.muted}`}>{taskConfig?.label || task}</p>
              <h1 className="mt-3 text-4xl font-semibold tracking-[-0.05em] text-foreground">Curated resources arranged more like collections than a generic post feed.</h1>
              <p className={`mt-5 max-w-2xl text-sm leading-8 ${ui.muted}`}>Bookmarks, saved resources, and reference-style items need calmer grouping and lighter metadata. This variant gives them that separation.</p>
            </div>
            <div className={`rounded-[2rem] p-6 ${ui.panel}`}>
              <p className={`text-xs uppercase tracking-[0.24em] ${ui.muted}`}>Collection filter</p>
              <form className="mt-4 flex items-center gap-3" action={taskConfig?.route || '#'}>
                <select name="category" defaultValue={normalizedCategory} className={`h-11 flex-1 rounded-xl px-3 text-sm ${ui.input}`}>
                  <option value="all">All categories</option>
                  {CATEGORY_OPTIONS.map((item) => (
                    <option key={item.slug} value={item.slug}>{item.name}</option>
                  ))}
                </select>
                <button type="submit" className={`h-11 rounded-xl px-4 text-sm font-medium ${ui.button}`}>Apply</button>
              </form>
            </div>
          </section>
        ) : null}

        {intro ? (
          <section className={`mb-12 rounded-[2rem] p-6 shadow-[0_18px_50px_rgba(15,23,42,0.06)] sm:p-8 ${ui.panel}`}>
            <h2 className="text-2xl font-semibold text-foreground">{intro.title}</h2>
            {intro.paragraphs.map((paragraph) => (
              <p key={paragraph.slice(0, 40)} className={`mt-4 text-sm leading-7 ${ui.muted}`}>{paragraph}</p>
            ))}
            {task !== 'article' ? (
              <div className="mt-4 flex flex-wrap gap-4 text-sm">
                {intro.links.map((link) => (
                  <a key={link.href} href={link.href} className="font-semibold text-foreground hover:underline">{link.label}</a>
                ))}
              </div>
            ) : null}
          </section>
        ) : null}

        {featuredPosts.length && shouldShowFeaturedSection ? (
          <section className="mb-12">
            <div className="mb-4 flex items-center justify-between gap-4">
              <div>
                <p className={`text-xs font-semibold uppercase tracking-[0.24em] ${ui.muted}`}>Featured selection</p>
                <h2 className="mt-2 text-2xl font-semibold text-foreground">Three posts that set the tone for this section</h2>
              </div>
              <Link href={taskConfig?.route || '#'} className={`hidden text-sm font-semibold ${ui.muted} hover:text-foreground sm:inline-flex`}>
                Open all
              </Link>
            </div>
            <div className={isPdfTask ? 'grid gap-4 md:grid-cols-3' : isSocialTask ? 'grid gap-4 md:grid-cols-3 lg:grid-cols-3' : 'grid gap-6 md:grid-cols-3'}>
              {featuredPosts.map((post) => (
                <TaskPostCard
                  key={post.id}
                  post={post}
                  href={buildPostUrl(task, post.slug)}
                  taskKey={task}
                  compact={isPdfTask || isSocialTask}
                />
              ))}
            </div>
          </section>
        ) : null}

        <TaskListClient task={task} initialPosts={remainingPosts} category={normalizedCategory} query={normalizedQuery} />
      </main>
      <Footer />
    </div>
  )
}
