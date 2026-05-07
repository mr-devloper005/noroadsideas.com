export const siteIdentity = {
  code: process.env.NEXT_PUBLIC_SITE_CODE || '5qg7dh9200',
  name: process.env.NEXT_PUBLIC_SITE_NAME || 'Noroadsideas',
  tagline: process.env.NEXT_PUBLIC_SITE_TAGLINE || 'Editorial reading room',
  description:
    process.env.NEXT_PUBLIC_SITE_DESCRIPTION ||
    'An article-led publication.',
  domain: process.env.NEXT_PUBLIC_SITE_DOMAIN || 'noroadsideas.com',
  url: process.env.NEXT_PUBLIC_SITE_URL || 'https://noroadsideas.com',
  ogImage: process.env.NEXT_PUBLIC_SITE_OG_IMAGE || '/og-default.png',
  googleMapsEmbedApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_EMBED_API_KEY || 'AIzaSyBco7dIECu3rJWjP3J0MImnR_uxlbeqAe0',
  contactEmail: process.env.NEXT_PUBLIC_CONTACT_EMAIL || 'contact@noroadsideas.com',

} as const

export const defaultAuthorProfile = {
  name: siteIdentity.name,
  avatar: '/placeholder.svg?height=80&width=80',
} as const

