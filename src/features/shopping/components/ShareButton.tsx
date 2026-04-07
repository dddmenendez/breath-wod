import { Share2 } from 'lucide-react'

import type { ShoppingItem } from '../types/shopping.types'

interface ShareButtonProps {
  items: ShoppingItem[]
}

function buildPlainText(items: ShoppingItem[]): string {
  const grouped = new Map<string, ShoppingItem[]>()
  for (const item of items) {
    const list = grouped.get(item.category) ?? []
    list.push(item)
    grouped.set(item.category, list)
  }

  const lines: string[] = ['Lista de compras — A.R.M. Protocol', '']
  for (const [category, categoryItems] of grouped) {
    lines.push(`## ${category.toUpperCase()}`)
    for (const item of categoryItems) {
      const check = item.checked ? '[x]' : '[ ]'
      lines.push(`${check} ${item.name} — ${item.amount} ${item.unit}`)
    }
    lines.push('')
  }

  return lines.join('\n')
}

async function shareList(items: ShoppingItem[]): Promise<void> {
  const text = buildPlainText(items)

  if (navigator.share) {
    try {
      await navigator.share({ title: 'Lista de compras', text })
      return
    } catch {
      // User cancelled or share failed — fall through to clipboard
    }
  }

  await navigator.clipboard.writeText(text)
}

function ShareButton({ items }: ShareButtonProps) {
  const handleShare = () => {
    shareList(items)
  }

  return (
    <button
      type="button"
      onClick={handleShare}
      className="flex items-center gap-2 rounded-xl bg-bg-surface px-4 py-2.5 text-sm font-medium text-text transition-colors active:bg-bg-elevated"
    >
      <Share2 size={16} />
      Compartir lista
    </button>
  )
}

export default ShareButton
