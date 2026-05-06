import { ContentImage } from '@/components/shared/content-image'
import Link from 'next/link'
import { ArrowUpRight, ExternalLink, FileText, Mail, MapPin, Tag } from 'lucide-react'
import type { SitePost } from '@/lib/site-connector'
import { CATEGORY_OPTIONS, normalizeCategory } from '@/lib/categories'
import type { TaskKey } from '@/lib/site-config'
import { SITE_THEME } from '@/config/site.theme'
import { getFactoryState } from '@/design/factory/get-factory-state'
import { TASK_POST_CARD_OVERRIDE_ENABLED, TaskPostCardOverride } from '@/overrides/task-post-card'
import { Badge } from '@/components/ui/badge'

type ListingContent = {
  location?: string
  category?: string
  description?: string
  email?: string
}

const stripHtml = (value?: string | null) =>
  (value || '')
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, ' ')
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, ' ')
    .replace(/<\/?[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()

const getExcerpt = (value?: string | null, maxLength = 140) => {
  const text = stripHtml(value)
  if (!text) return ''
  if (text.length <= maxLength) return text
  return `${text.slice(0, maxLength).trimEnd()}…`
}

const getContent = (post: SitePost): ListingContent => {
  const content = post.content && typeof post.content === 'object' ? post.content : {}
  return content as ListingContent
}

const getImageUrl = (post: SitePost, content: ListingContent) => {
  const media = Array.isArray(post.media) ? post.media : []
  const mediaUrl = media[0]?.url
  if (mediaUrl) return mediaUrl

  const contentAny = content as Record<string, unknown>
  const contentImage = typeof contentAny.image === 'string' ? contentAny.image : null
  if (contentImage) return contentImage

  const contentImages = Array.isArray(contentAny.images) ? contentAny.images : []
  const firstImage = contentImages.find((value) => typeof value === 'string')
  if (firstImage) return firstImage as string

  const contentLogo = typeof contentAny.logo === 'string' ? contentAny.logo : null
  if (contentLogo) return contentLogo

  return '/placeholder.svg?height=640&width=960'
}

const cardStyles = {
  'listing-elevated': {
    frame: 'rounded-[1.9rem] border border-[rgba(53,88,114,0.14)] bg-white shadow-[0_20px_60px_rgba(27,46,60,0.08)] hover:-translate-y-1 hover:shadow-[0_28px_75px_rgba(27,46,60,0.14)]',
    muted: 'text-[#586b78]',
    title: 'text-[#172633]',
    badge: 'bg-[#355872] text-[#f7f8f0]',
    cta: 'text-[#172633]',
  },
  'editorial-feature': {
    frame: 'rounded-[1.8rem] border border-[rgba(53,88,114,0.14)] bg-[linear-gradient(180deg,rgba(255,253,246,0.96),rgba(243,247,250,0.96))] shadow-[0_18px_55px_rgba(27,46,60,0.1)] hover:-translate-y-1 hover:shadow-[0_26px_75px_rgba(27,46,60,0.14)]',
    muted: 'text-[#586b78]',
    title: 'text-[#172633]',
    badge: 'bg-[#355872] text-[#f7f8f0]',
    cta: 'text-[#172633]',
  },
  'studio-panel': {
    frame: 'rounded-[1.9rem] border border-white/10 bg-[linear-gradient(180deg,rgba(7,17,31,0.96),rgba(12,23,43,0.96))] text-white shadow-[0_24px_80px_rgba(15,23,42,0.35)] hover:-translate-y-1 hover:shadow-[0_30px_90px_rgba(15,23,42,0.42)]',
    muted: 'text-slate-300',
    title: 'text-white',
    badge: 'bg-[#8df0c8] text-[#07111f]',
    cta: 'text-white',
  },
  'catalog-grid': {
    frame: 'rounded-[1.8rem] border border-[rgba(53,88,114,0.14)] bg-[rgba(247,248,240,0.96)] shadow-[0_18px_58px_rgba(27,46,60,0.08)] hover:-translate-y-1 hover:shadow-[0_28px_70px_rgba(27,46,60,0.12)]',
    muted: 'text-[#586b78]',
    title: 'text-[#172633]',
    badge: 'bg-[#355872] text-[#f7f8f0]',
    cta: 'text-[#172633]',
  },
} as const

const getVariantForTask = (taskKey: TaskKey) => SITE_THEME.cards[taskKey] || 'listing-elevated'

export function TaskPostCard({
  post,
  href,
  taskKey,
  compact,
}: {
  post: SitePost
  href: string
  taskKey?: TaskKey
  compact?: boolean
}) {
  if (TASK_POST_CARD_OVERRIDE_ENABLED) {
    return <TaskPostCardOverride post={post} href={href} taskKey={taskKey} compact={compact} />
  }

  const content = getContent(post)
  const image = getImageUrl(post, content)
  const rawCategory = content.category || post.tags?.[0] || 'Post'
  const normalizedCategory = normalizeCategory(rawCategory)
  const category = CATEGORY_OPTIONS.find((item) => item.slug === normalizedCategory)?.name || rawCategory
  const variant = taskKey || 'listing'
  const visualVariant = cardStyles[getVariantForTask(variant)]
  const isBookmarkVariant = variant === 'sbm' || variant === 'social'
  const imageAspect = variant === 'image' ? 'aspect-[4/5]' : variant === 'article' ? 'aspect-[16/10]' : variant === 'classified' ? 'aspect-[16/11]' : 'aspect-[4/3]'
  const altText = `${post.title} ${category} ${variant === 'listing' ? 'business listing' : variant} image`
  const imageSizes = variant === 'article' ? '(max-width: 640px) 90vw, (max-width: 1024px) 48vw, 420px' : variant === 'image' ? '(max-width: 640px) 82vw, (max-width: 1024px) 34vw, 320px' : '(max-width: 640px) 85vw, (max-width: 1024px) 42vw, 340px'

  const { recipe } = getFactoryState()
  const isDirectoryProduct = recipe.homeLayout === 'listing-home' || recipe.homeLayout === 'classified-home'
  const isDirectorySurface = isDirectoryProduct && (variant === 'listing' || variant === 'classified' || variant === 'profile')

  if (isDirectorySurface) {
    const cardTone = recipe.brandPack === 'market-utility'
      ? {
          frame: 'rounded-[1.75rem] border border-[#d7deca] bg-white shadow-[0_18px_44px_rgba(64,76,34,0.08)] hover:-translate-y-1 hover:shadow-[0_22px_50px_rgba(64,76,34,0.14)]',
          badge: 'bg-[#1f2617] text-[#edf5dc]',
          muted: 'text-[#5b664c]',
          title: 'text-[#1f2617]',
          cta: 'text-[#1f2617]',
        }
      : {
          frame: 'rounded-[1.75rem] border border-slate-200 bg-white shadow-[0_18px_44px_rgba(15,23,42,0.08)] hover:-translate-y-1 hover:shadow-[0_22px_50px_rgba(15,23,42,0.14)]',
          badge: 'bg-slate-950 text-white',
          muted: 'text-slate-600',
          title: 'text-slate-950',
          cta: 'text-slate-950',
        }

    return (
    <Link href={href} className={`group flex h-full flex-col overflow-hidden transition-all duration-300 ${cardTone.frame} hover:shadow-lg`}>
        <div className="relative aspect-video overflow-hidden bg-gradient-to-br from-slate-50 to-slate-100">
          <ContentImage src={image} alt={altText} fill sizes={imageSizes} quality={85} className="object-cover transition-all duration-500 group-hover:scale-[1.05]" intrinsicWidth={960} intrinsicHeight={540} />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent p-4">
            <div className="flex items-center justify-between">
              <Badge className={`inline-flex items-center gap-2 px-3 py-1.5 text-xs font-semibold ${cardTone.badge}`}>
                <Tag className="h-3 w-3" />
                {category}
              </Badge>
              <div className="flex items-center gap-2">
                <span className={`text-xs font-medium ${cardTone.muted}`}>{variant === 'classified' ? 'Available' : 'Featured'}</span>
                {variant === 'classified' ? (
                  <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-500 text-white text-xs font-medium rounded-full">New</span>
                ) : (
                  <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-500 text-white text-xs font-medium rounded-full">Premium</span>
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="flex-1 p-6">
          <div className="space-y-4">
            <h3 className={`text-xl font-bold leading-tight ${cardTone.title}`}>{post.title}</h3>
            <p className={`line-clamp-2 text-sm leading-6 ${cardTone.muted} mt-2`}>{getExcerpt(content.description || post.summary, 160) || 'Discover this amazing listing.'}</p>
            <div className="flex items-center gap-4 mt-4">
              {content.location && (
                <div className={`flex items-center gap-2 text-xs ${cardTone.muted}`}>
                  <MapPin className="h-4 w-4" />
                  <span>{content.location}</span>
                </div>
              )}
              {content.email && (
                <div className={`flex items-center gap-2 text-xs ${cardTone.muted}`}>
                  <Mail className="h-4 w-4" />
                  <span>{content.email}</span>
                </div>
              )}
            </div>
            <div className={`pt-4 border-t ${cardTone.frame} mt-4`}>
              <div className={`text-sm font-medium ${cardTone.cta} flex items-center justify-between`}>
                <span>{variant === 'classified' ? 'Contact now' : 'Learn more'}</span>
                <ArrowUpRight className={`h-4 w-4 ${cardTone.muted}`} />
              </div>
            </div>
          </div>
        </div>
      </Link>
    )
  }

  if (isBookmarkVariant) {
    return (
      <Link href={href} className={`group flex h-full flex-row items-start gap-4 overflow-hidden p-5 transition duration-300 ${visualVariant.frame}`}>
        <div className="mt-1 rounded-full bg-white/10 p-2.5 text-current transition group-hover:scale-105">
          <ExternalLink className="h-4 w-4" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] ${visualVariant.badge}`}>
              <Tag className="h-3.5 w-3.5" />
              {category}
            </span>
            {content.location ? <span className={`inline-flex items-center gap-1 text-xs ${visualVariant.muted}`}><MapPin className="h-3.5 w-3.5" />{content.location}</span> : null}
          </div>
          <h3 className={`mt-3 line-clamp-2 text-lg font-semibold leading-snug group-hover:opacity-85 ${visualVariant.title}`}>{post.title}</h3>
          <p className={`mt-2 line-clamp-3 text-sm leading-7 ${visualVariant.muted}`}>{getExcerpt(content.description || post.summary, compact ? 120 : 180) || 'Explore this bookmark.'}</p>
          {content.email ? <div className={`mt-3 inline-flex items-center gap-1 text-xs ${visualVariant.muted}`}><Mail className="h-3.5 w-3.5" />{content.email}</div> : null}
        </div>
      </Link>
    )
  }

  return (
    <Link href={href} className={`group flex h-full flex-col overflow-hidden transition-all duration-500 ${visualVariant.frame} hover:shadow-xl hover:-translate-y-2`}>
      <div className="relative">
        <div className={`relative ${imageAspect} overflow-hidden bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50`}>
          <ContentImage src={image} alt={altText} fill sizes={imageSizes} quality={90} className="object-cover transition-all duration-700 group-hover:scale-[1.08] group-hover:rotate-1" intrinsicWidth={960} intrinsicHeight={540} />
          <div className="absolute inset-0 bg-gradient-to-t from-purple-900/80 via-transparent to-transparent" />
          <div className="absolute top-4 left-4 right-4">
            <div className="flex justify-between items-start">
              <Badge className={`inline-flex items-center gap-2 px-4 py-2 text-xs font-bold uppercase tracking-wider ${visualVariant.badge} shadow-lg`}>
                <Tag className="h-3.5 w-3.5" />
                {category}
              </Badge>
                          </div>
          </div>
        </div>
        <div className={`flex-1 p-8 ${compact ? 'py-4' : ''}`}>
          <div className="space-y-6">
            <h3 className={`text-2xl font-black leading-tight ${visualVariant.title}`}>{post.title}</h3>
            <div className="flex items-center justify-center gap-2">
              <span className={`text-sm font-semibold ${visualVariant.cta}`}>Continue Reading</span>
              <ArrowUpRight className={`h-5 w-5 ${visualVariant.cta} group-hover:translate-x-1 transition-transform`} />
            </div>
            <p className={`line-clamp-4 text-base leading-7 ${visualVariant.muted} mt-4`}>{getExcerpt(content.description || post.summary, 200) || 'Discover this premium article with exclusive insights and expert analysis.'}</p>
            <div className="flex items-center gap-4 mt-6">
              {content.location && (
                <div className={`flex items-center gap-3 px-4 py-3 rounded-2xl bg-gradient-to-r from-blue-50 to-indigo-100 border-2 border-blue-200 ${visualVariant.frame} shadow-lg`}>
                  <MapPin className="h-5 w-5 text-blue-600" />
                  <span className="text-sm font-medium text-blue-800">{content.location}</span>
                </div>
              )}
              {content.email && (
                <div className={`flex items-center gap-3 px-4 py-3 rounded-2xl bg-gradient-to-r from-green-50 to-emerald-100 border-2 border-green-200 ${visualVariant.frame} shadow-lg`}>
                  <Mail className="h-5 w-5 text-green-600" />
                  <span className="text-sm font-medium text-green-800">{content.email}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}
