export function useNotification() {
  const toast = useToast()

  const methods = {
    success: (message: string) => {
      toast.add({
        title: message,
        color: 'green',
      })
    },

    error: (message: string) => {
      toast.add({
        title: message,
        color: 'red',
      })
    },
  }

  return methods
}
