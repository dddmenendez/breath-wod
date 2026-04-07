const scheduledTimers = new Map<string, number>()

export async function requestNotificationPermission(): Promise<boolean> {
  if (!('Notification' in window)) return false
  if (Notification.permission === 'granted') return true
  if (Notification.permission === 'denied') return false

  const result = await Notification.requestPermission()
  return result === 'granted'
}

export async function scheduleNotification(opts: {
  id: string
  title: string
  body: string
  at: Date
}): Promise<void> {
  const granted = await requestNotificationPermission()
  if (!granted) return

  cancelScheduledNotification(opts.id)

  const delay = opts.at.getTime() - Date.now()
  if (delay <= 0) {
    showNotification(opts.title, opts.body)
    return
  }

  const timerId = window.setTimeout(() => {
    showNotification(opts.title, opts.body)
    scheduledTimers.delete(opts.id)
  }, delay)

  scheduledTimers.set(opts.id, timerId)
}

export function cancelScheduledNotification(id: string): void {
  const timerId = scheduledTimers.get(id)
  if (timerId !== undefined) {
    window.clearTimeout(timerId)
    scheduledTimers.delete(id)
  }
}

export function cancelAllNotifications(): void {
  scheduledTimers.forEach((timerId) => window.clearTimeout(timerId))
  scheduledTimers.clear()
}

function showNotification(title: string, body: string): void {
  try {
    if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
      navigator.serviceWorker.controller.postMessage({
        type: 'SHOW_NOTIFICATION',
        title,
        body,
      })
      return
    }
    new Notification(title, { body })
  } catch (err) {
    console.error('[notifications] showNotification failed', err)
  }
}
