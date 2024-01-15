import type { NotificationColor } from '@nuxt/ui/dist/runtime/types'

export function useNotification() {
  const toast = useToast()

  const addToast = (message: string, color: NotificationColor) => {
    toast.add({
      title: message,
      color,
    })
  }

  const methods = {
    success: (message: string) => {
      addToast(message, 'green')
    },

    error: (message: string) => {
      addToast(message, 'red')
    },
  }

  return methods
}
