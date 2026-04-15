import { create } from 'zustand'

interface BreadcrumbState {
  labels: Record<string, string>
  setLabel: (id: string, label: string) => void
}

export const useBreadcrumbStore = create<BreadcrumbState>((set) => ({
  labels: {},
  setLabel: (id, label) => {
    set((state) => ({
      labels: { ...state.labels, [id]: label },
    }))
    document.title = `${label} | Thu Hải Đường`
  },
}))
