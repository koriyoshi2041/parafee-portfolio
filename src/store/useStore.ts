import { create } from 'zustand'

interface AppState {
  isLoading: boolean
  loadingProgress: number
  cursorVariant: 'default' | 'hover' | 'text' | 'hidden'
  setLoading: (loading: boolean) => void
  setLoadingProgress: (progress: number) => void
  setCursorVariant: (variant: 'default' | 'hover' | 'text' | 'hidden') => void
}

export const useStore = create<AppState>((set) => ({
  isLoading: true,
  loadingProgress: 0,
  cursorVariant: 'default',
  setLoading: (loading) => set({ isLoading: loading }),
  setLoadingProgress: (progress) => set({ loadingProgress: progress }),
  setCursorVariant: (variant) => set({ cursorVariant: variant }),
}))
