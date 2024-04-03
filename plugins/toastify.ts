import {
  type Id,
  type ToastOptions,
  type ToastType,
  toast,
} from 'vue3-toastify'
import 'vue3-toastify/dist/index.css'

export default defineNuxtPlugin(() => {
  const defaultOptions = {
    onOpen: () => {},
    onClose: () => {},
    autoClose: 5000,
    hideProgressBar: false,
    position: toast.POSITION.TOP_CENTER,
    pauseOnHover: true,
    transition: toast.TRANSITIONS.SLIDE,
    multiple: true,
    limit: 2,
    dangerouslyHTMLString: true,
    theme: 'colored',
  } as ToastOptions

  // Success
  const success = (message: string) =>
    toast.success(message, {
      ...defaultOptions,
    })

  // Error
  const error = (message: string) => {
    toast.error(message, {
      ...defaultOptions,
      autoClose: false,
    })
  }

  // Information
  const info = (message: string) =>
    toast.info(message, {
      ...defaultOptions,
    })

  // Warning
  const warning = (message: string) =>
    toast.warning(message, {
      ...defaultOptions,
    })

  // Remove given toast
  const remove = (toastId: Id) => toast.remove(toastId)

  // Remove All toasts
  const removeAll = () => toast.clearAll()

  // Check if a toast active
  const isActive = (toastId: Id) => toast.isActive(toastId)

  // Update a toast
  const update = (toastId: Id, type: ToastType) => {
    toast.update(toastId, {
      type,
    })
  }

  // Completes the controlled progress bar
  const done = (toastId: Id) => toast.done(toastId)

  return {
    provide: {
      success,
      error,
      info,
      warning,
      remove,
      removeAll,
      isActive,
      update,
      done,
    },
  }
})
