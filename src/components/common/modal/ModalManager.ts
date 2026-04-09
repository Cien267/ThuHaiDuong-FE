export interface ModalConfig {
  title?: string
  description?: string
  content?: React.ReactNode
  footer?: React.ReactNode
  showCloseButton?: boolean
  closeOnOverlayClick?: boolean
  onClose?: () => void
  className?: string
}

class ModalManager {
  private listeners: Set<(config: ModalConfig | null) => void> = new Set()
  private currentModal: ModalConfig | null = null

  subscribe(listener: (config: ModalConfig | null) => void) {
    this.listeners.add(listener)
    return () => {
      this.listeners.delete(listener)
    }
  }

  open(config: ModalConfig) {
    this.currentModal = config
    this.listeners.forEach((listener) => listener(config))
  }

  close() {
    const onClose = this.currentModal?.onClose
    this.currentModal = null
    this.listeners.forEach((listener) => listener(null))
    onClose?.()
  }

  getCurrentModal() {
    return this.currentModal
  }
}

export const modalManager = new ModalManager()
