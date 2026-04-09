import React from "react"
import { Button } from "@/components/ui/button"
import { modalManager, type ModalConfig } from "./ModalManager"

export const Modal = {
  open: (config: ModalConfig) => {
    modalManager.open(config)
  },

  close: () => {
    modalManager.close()
  },

  confirm: (options: {
    title: string
    description?: string
    content?: React.ReactNode
    confirmText?: string
    cancelText?: string
    onConfirm?: () => void
    onCancel?: () => void
  }) => {
    return new Promise<boolean>((resolve) => {
      Modal.open({
        title: options.title,
        description: options.description,
        content: options.content,
        closeOnOverlayClick: false,
        footer: (
          <div className="flex gap-2 w-full justify-end">
            <Button
              variant="outline"
              onClick={() => {
                options.onCancel?.()
                Modal.close()
                resolve(false)
              }}
            >
              {options.cancelText || "Cancel"}
            </Button>
            <Button
              onClick={() => {
                options.onConfirm?.()
                Modal.close()
                resolve(true)
              }}
            >
              {options.confirmText || "Confirm"}
            </Button>
          </div>
        ),
      })
    })
  },

  alert: (options: {
    title: string
    description?: string
    content?: React.ReactNode
    buttonText?: string
  }) => {
    return new Promise<void>((resolve) => {
      Modal.open({
        title: options.title,
        description: options.description,
        content: options.content,
        footer: (
          <Button
            onClick={() => {
              Modal.close()
              resolve()
            }}
            className="w-full"
          >
            {options.buttonText || "OK"}
          </Button>
        ),
      })
    })
  },
}
