import { useEffect, useState } from 'react'
import { requestNotificationPermission } from '@/shared/utils/notifications'

type PermissionState = 'default' | 'granted' | 'denied' | 'unsupported'

interface UseNotificationsReturn {
  permission: PermissionState
  requestPermission: () => Promise<void>
}

export function useNotifications(): UseNotificationsReturn {
  const [permission, setPermission] = useState<PermissionState>(() => {
    if (!('Notification' in window)) return 'unsupported'
    return Notification.permission as PermissionState
  })

  useEffect(() => {
    if (!('Notification' in window)) return
    setPermission(Notification.permission as PermissionState)
  }, [])

  const requestPermission = async () => {
    const granted = await requestNotificationPermission()
    setPermission(granted ? 'granted' : 'denied')
  }

  return { permission, requestPermission }
}
