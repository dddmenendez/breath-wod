import { db } from '@/db/database'

import type { FastingSession } from '@/features/fasting/types/fasting.types'
import type { DayMenu } from '@/features/menu/types/menu.types'
import type { ShoppingItem } from '@/features/shopping/types/shopping.types'
import type { SupplementLog } from '@/features/supplements/types/supplement.types'
import type { UserPreferences } from '@/types/global.types'

interface BackupFile {
  version: 1
  exportDate: string
  fasting: FastingSession[]
  menus: DayMenu[]
  shopping: ShoppingItem[]
  supplements: SupplementLog[]
  preferences: UserPreferences[]
}

interface ImportResult {
  success: boolean
  error?: string
}

function isValidBackup(data: unknown): data is BackupFile {
  if (typeof data !== 'object' || data === null) return false
  const obj = data as Record<string, unknown>
  return (
    obj.version === 1 &&
    typeof obj.exportDate === 'string' &&
    Array.isArray(obj.fasting) &&
    Array.isArray(obj.menus) &&
    Array.isArray(obj.shopping) &&
    Array.isArray(obj.supplements) &&
    Array.isArray(obj.preferences)
  )
}

export async function exportToJson(): Promise<void> {
  const [fasting, menus, shopping, supplements, preferences] = await Promise.all([
    db.fasting.toArray(),
    db.menus.toArray(),
    db.shopping.toArray(),
    db.supplements.toArray(),
    db.preferences.toArray(),
  ])

  const backup: BackupFile = {
    version: 1,
    exportDate: new Date().toISOString(),
    fasting,
    menus,
    shopping,
    supplements,
    preferences,
  }

  const blob = new Blob([JSON.stringify(backup, null, 2)], {
    type: 'application/json',
  })
  const url = URL.createObjectURL(blob)
  const date = new Date().toISOString().slice(0, 10)

  const a = document.createElement('a')
  a.href = url
  a.download = `arm-backup-${date}.json`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

export async function importFromJson(file: File): Promise<ImportResult> {
  try {
    const text = await file.text()
    const data: unknown = JSON.parse(text)

    if (!isValidBackup(data)) {
      return {
        success: false,
        error: 'Archivo inválido. Asegúrate de que sea un backup de A.R.M. Protocol (versión 1).',
      }
    }

    await db.transaction('rw', [db.fasting, db.menus, db.shopping, db.supplements, db.preferences], async () => {
      await db.fasting.clear()
      await db.menus.clear()
      await db.shopping.clear()
      await db.supplements.clear()
      await db.preferences.clear()

      if (data.fasting.length > 0) await db.fasting.bulkAdd(data.fasting)
      if (data.menus.length > 0) await db.menus.bulkAdd(data.menus)
      if (data.shopping.length > 0) await db.shopping.bulkAdd(data.shopping)
      if (data.supplements.length > 0) await db.supplements.bulkAdd(data.supplements)
      if (data.preferences.length > 0) await db.preferences.bulkAdd(data.preferences)
    })

    return { success: true }
  } catch (err) {
    console.error('[exportData] importFromJson failed', err)
    return {
      success: false,
      error: 'Error al importar. El archivo puede estar corrupto.',
    }
  }
}
