import { useState, useEffect, useCallback } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { X } from "lucide-react"
import { modalManager, type ModalConfig } from "./ModalManager"

interface ModalProviderProps {
  children: React.ReactNode
}

export const ModalProvider: React.FC<ModalProviderProps> = ({ children }) => {
  const [modalConfig, setModalConfig] = useState<ModalConfig | null>(null)

  useEffect(() => {
    return modalManager.subscribe(setModalConfig)
  }, [])

  const handleClose = useCallback(() => {
    modalManager.close()
  }, [])

  const handleOpenChange = useCallback(
    (open: boolean) => {
      if (!open) {
        if (modalConfig?.closeOnOverlayClick !== false) {
          handleClose()
        }
      }
    },
    [modalConfig, handleClose]
  )

  return (
    <>
      {children}
      <Dialog open={!!modalConfig} onOpenChange={handleOpenChange}>
        <DialogContent
          className={modalConfig?.className}
          onEscapeKeyDown={(e) => {
            if (modalConfig?.closeOnOverlayClick === false) {
              e.preventDefault()
            }
          }}
        >
          {modalConfig?.showCloseButton !== false && (
            <button
              onClick={handleClose}
              className="absolute right-4 top-4 rounded-sm opacity-70 transition-opacity hover:opacity-100 focus:outline-none focus:ring-0 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground"
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Close</span>
            </button>
          )}

          {(modalConfig?.title || modalConfig?.description) && (
            <DialogHeader>
              {modalConfig?.title && (
                <DialogTitle>{modalConfig.title}</DialogTitle>
              )}
              {modalConfig?.description && (
                <DialogDescription>{modalConfig.description}</DialogDescription>
              )}
            </DialogHeader>
          )}

          {modalConfig?.content && (
            <div className="py-4 overflow-x-hidden overflow-y-auto max-h-[80vh]">
              {modalConfig.content}
            </div>
          )}

          {modalConfig?.footer && (
            <DialogFooter>{modalConfig.footer}</DialogFooter>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}
