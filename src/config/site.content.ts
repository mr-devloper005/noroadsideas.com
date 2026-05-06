import type { TaskKey } from '@/lib/site-config'

export const siteContent = {
  navbar: {
    tagline: '',
  },
  footer: {
    tagline: 'Articles, notes, and supporting resources',
  },
  hero: {
    badge: 'Structured publishing',
    title: ['Stories, visuals, and content.'],
    description:
      'Explore essays, resources, and content with a structured publishing experience.',
    primaryCta: {
      label: 'Discover content',
      href: '/articles',
    },
  },
  searchPlaceholder: 'Search articles',
  focusLabel: 'Feature',
  featureCardBadge: 'lead story',
  featureCardTitle: 'A publication-style homepage keeps reading at the center.',
  featureCardDescription:
    'The layout gives primary and secondary tasks the spotlight while keeping supporting sections accessible but quieter.',
  home: {
    metadata: {
      title: 'Editorial articles and resource library',
      description:
        'Explore articles and supporting community pages through a clearer editorial experience.',
      openGraphTitle: 'Editorial articles and resource library',
      openGraphDescription:
        'Discover article-first reading, document resources, and quieter supporting sections through a refined editorial layout.',
      keywords: ['article site', 'editorial homepage', 'reading desk'],
    },
    introBadge: 'Editorial direction',
    introTitle: 'Built like a publication with a clear lead story and a quieter archive.',
    introParagraphs: [
      'This site centers articles first, then layers in supporting community pages so the homepage feels authored rather than assembled.',
      'The design avoids a generic content-feed rhythm by giving the lead story, the archive, and the resource shelf their own pacing and whitespace.',
      'Supporting sections stay accessible through navigation, search, and footer links, but they no longer compete with the primary reading path.',
    ],
    sideBadge: 'At a glance',
    sidePoints: [
      'Article-first homepage with a publication cover feel.',
      'Community and bookmark surfaces moved into quieter navigation.',
      'Lightweight motion and high-contrast typography for readability.',
    ],
    primaryLink: {
      label: 'Browse articles',
      href: '/articles',
    },
  },
  cta: {
    badge: 'Start reading',
    title: 'Explore articles and supporting pages through one connected editorial system.',
    description:
      'Move between essays and quieter support pages without losing the reading rhythm.',
    primaryCta: {
      label: 'Get started',
      href: '/register',
    },
    secondaryCta: {
      label: 'Contact',
      href: '/contact',
    },
  },
  taskSectionHeading: 'Latest {label}',
  taskSectionDescriptionSuffix: 'Browse newest posts in this section.',
} as const

export const taskPageMetadata: Record<Exclude<TaskKey, 'comment' | 'org' | 'profile'>, { title: string; description: string }> = {
  article: {
    title: 'Articles and features',
    description: 'Read essays, features, and long-form writing with a calmer publication rhythm.',
  },
  listing: {
    title: 'Listings and discoverable pages',
    description: 'Explore listings, services, brands, and structured pages organized for easier browsing.',
  },
  classified: {
    title: 'Classifieds and announcements',
    description: 'Browse classifieds, offers, notices, and time-sensitive posts across categories.',
  },
  image: {
    title: 'Images and visual posts',
    description: 'Explore image-led posts, galleries, and visual stories from across the platform.',
  },
  sbm: {
    title: 'Curated links and saved resources',
    description: 'Browse useful links, saved references, and curated resources organized for slower discovery.',
  },
  social: {
    title: 'Community notes and short updates',
    description: 'Browse short updates, link posts, and community signals with a quieter bulletin rhythm.',
  },
}

export const taskIntroCopy: Record<
  Exclude<TaskKey, 'comment' | 'org' | 'profile'>,
  { title: string; paragraphs: string[]; links: { label: string; href: string }[] }
> = {
  listing: {
    title: 'Listings, services, and structured pages',
    paragraphs: [
      'Explore listings, services, brands, and discoverable pages across categories. Each entry is organized to make browsing clearer and help visitors quickly understand what a post offers.',
      'Listings connect naturally with articles, images, resources, and other content types so supporting information stays easy to reach from the same platform.',
      'Browse by category to compare posts in context, discover related content, and move between formats without losing your place.',
    ],
    links: [
      { label: 'Read articles', href: '/articles' },
      { label: 'Explore classifieds', href: '/classifieds' },
    ],
  },
  article: {
    title: 'Articles, essays, and long-form reading',
    paragraphs: [
      'This section is built for essays, explainers, criticism, and slower reading across topics and interests.',
      'Articles connect with support pages so deeper reading can lead naturally into related material.',
      'Use this section to browse thoughtful posts, revisit useful writing, and move into the archive when you want more context.',
    ],
    links: [
      { label: 'Read community notes', href: '/community' },
      { label: 'Browse bookmarks', href: '/sbm' },
    ],
  },
  classified: {
    title: 'Classifieds, offers, and timely updates',
    paragraphs: [
      'Classified posts help surface offers, notices, deals, and time-sensitive opportunities in a faster-scanning format.',
      'They work well alongside articles, listings, and profiles, making it easier to connect short-term posts with more structured content.',
      'Browse by category to find announcements quickly, then continue into related sections when you need more detail.',
    ],
    links: [
      { label: 'Business listings', href: '/listings' },
      { label: 'Read articles', href: '/articles' },
    ],
  },
  image: {
    title: 'Image-led posts and visual stories',
    paragraphs: [
      'Images take the lead in this section through galleries, visual posts, and story-led content where imagery carries the experience.',
      'These posts connect with articles, listings, and other sections so visuals can act as entry points into deeper content.',
      'Browse the latest visual updates, then continue into related stories or supporting pages for more context.',
    ],
    links: [
      { label: 'Read articles', href: '/articles' },
      { label: 'Explore listings', href: '/listings' },
      { label: 'Open classifieds', href: '/classifieds' },
    ],
  },
  sbm: {
    title: 'Curated links and bookmarked resources',
    paragraphs: [
      'This section collects useful links, references, tools, and saved resources in a text-first browsing format.',
      'Bookmarks stay connected to the rest of the site, making it easier to move from a saved link into related articles.',
      'Use this section to organize helpful sources and discover connected content without leaving the broader reading experience.',
    ],
    links: [
      { label: 'Browse articles', href: '/articles' },
      { label: 'Community', href: '/community' },
    ],
  },
  social: {
    title: 'Short updates and community signals',
    paragraphs: [
      'Short updates add quick signals that keep activity flowing without taking over the reading experience.',
      'They work well with articles by helping visitors move from brief notes into deeper content.',
      'Use these posts as lightweight entry points into the broader site experience.',
    ],
    links: [
      { label: 'Read articles', href: '/articles' },
      { label: 'Browse bookmarks', href: '/sbm' },
    ],
  },
}
