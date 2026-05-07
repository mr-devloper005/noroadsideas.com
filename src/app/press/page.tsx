'use client'

import { useState } from 'react'
import Image from 'next/image'
import { PageShell } from '@/components/shared/page-shell'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { useToast } from '@/components/ui/use-toast'

export default function PressPage() {
  const { toast } = useToast()
  const [activeAssetId, setActiveAssetId] = useState<string | null>(null)
  const activeAsset = undefined

  return (
    <PageShell
      title="Press"
      description="Media resources, brand assets, and press coverage."
    >
      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <Card className="border-border bg-card">
          <CardContent className="p-6 space-y-3">
            <h2 className="text-lg font-semibold text-foreground">Press Kit</h2>
            <p className="text-sm text-muted-foreground">
              Download logos, product screenshots, and brand guidelines for media use.
            </p>
            <div className="grid gap-2">
              <p className="text-sm text-muted-foreground">No press assets available</p>
            </div>
          </CardContent>
        </Card>
        <div className="space-y-4">
          {([] as any[]).map((item) => (
            <Card key={item.id} className="border-border bg-card transition-transform hover:-translate-y-1">
              <CardContent className="p-6">
                <div className="text-xs uppercase tracking-wide text-muted-foreground">{item.outlet}</div>
                <p className="mt-2 text-sm text-foreground">{item.headline}</p>
                <p className="mt-2 text-xs text-muted-foreground">{item.date}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

          </PageShell>
  )
}
