import Dexie from 'dexie'

import type { Table } from 'dexie'
import type { FastingSession } from '@/features/fasting/types/fasting.types'
import type { DayMenu } from '@/features/menu/types/menu.types'
import type { ShoppingItem } from '@/features/shopping/types/shopping.types'
import type { SupplementLog } from '@/features/supplements/types/supplement.types'
import type { UserPreferences } from '@/types/global.types'

class ARMDatabase extends Dexie {
  fasting!: Table<FastingSession, number>
  menus!: Table<DayMenu, number>
  shopping!: Table<ShoppingItem, number>
  supplements!: Table<SupplementLog, number>
  preferences!: Table<UserPreferences, string>

  constructor() {
    super('arm-protocol')
    this.version(1).stores({
      fasting: '++id, startTime, status',
      menus: '++id, weekId, dayOfWeek',
      shopping: '++id, weekId, category, checked',
      supplements: '++id, date, supplementId, timing',
      preferences: 'key',
    })
  }
}

export const db = new ARMDatabase()
