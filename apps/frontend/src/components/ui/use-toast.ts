import { create } from 'zustand'

export type ToastProps = {
  id: string
  title?: string
  description?: string
  action?: React.ReactNode
  duration?: number
  variant?: 'default' | 'destructive' | 'success' | 'list'
}

type ToastStore = {
  toasts: ToastProps[]
  addToast: (toast: Omit<ToastProps, "id">) => void
  dismissToast: (toastId: string) => void
}

const useToastStore = create<ToastStore>((set) => ({
  toasts: [],
  addToast: (toast) =>
    set((state) => ({
      toasts: [...state.toasts, { ...toast, id: crypto.randomUUID() }],
    })),
  dismissToast: (toastId) =>
    set((state) => ({
      toasts: state.toasts.filter((toast) => toast.id !== toastId),
    })),
}))

export const useToast = () => {
  const { addToast, dismissToast, toasts } = useToastStore()
  return { toast: addToast, dismiss: dismissToast, toasts }
}