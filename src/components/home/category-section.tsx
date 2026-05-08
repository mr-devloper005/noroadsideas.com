'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  Monitor,
  Palette,
  Briefcase,
  Heart,
  UtensilsCrossed,
  Wrench,
  Smartphone,
  Home,
  Bike,
  Building
} from 'lucide-react'

const iconMap: Record<string, React.ElementType> = {
  Monitor,
  Palette,
  Briefcase,
  Heart,
  UtensilsCrossed,
  Wrench,
  Smartphone,
  Home,
  Bike,
  Building
}

export function CategorySection() {
  return (
    <section className="border-b border-border py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10 text-center">
          <h2 className="text-2xl font-bold text-foreground sm:text-3xl">
            Explore Categories
          </h2>
          <p className="mt-2 text-muted-foreground">
            Browse through our diverse range of content and listings
          </p>
        </div>

        <div className="text-center text-muted-foreground">
          Categories coming soon
        </div>
      </div>
    </section>
  )
}
