import { createContext, useContext, useState, type ReactNode } from 'react'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'

type AlertOptions = {
  title?: string
  description: string | ReactNode
  cancelText?: string
  confirmText?: string
  showTimelineCheckbox?: boolean
  onConfirm: () => Promise<void> | void
  onSuccess?: (reason?: string, addToTimeline?: boolean) => Promise<void> | void
}

type AlertContextType = {
  openAlert: (options: AlertOptions) => void
}

const AlertContext = createContext<AlertContextType | undefined>(undefined)

export const AlertProvider = ({ children }: { children: ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [config, setConfig] = useState<AlertOptions | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [addToTimeline, setAddToTimeline] = useState(true)
  const [reason, setReason] = useState('')

  const openAlert = (options: AlertOptions) => {
    setConfig(options)
    setReason('')
    setAddToTimeline(true)
    setIsOpen(true)
  }

  const handleConfirm = async (e: React.MouseEvent) => {
    e.preventDefault()
    if (config?.onConfirm) {
      setIsLoading(true)
      try {
        await config.onConfirm()

        if (config.onSuccess) {
          await config.onSuccess(reason, addToTimeline)
        }
        setIsOpen(false)
      } catch (error) {
        console.error('Action failed', error)
      } finally {
        setIsLoading(false)
      }
    }
  }

  const isConfirmDisabled =
    isLoading ||
    (config?.showTimelineCheckbox && addToTimeline && !reason.trim())

  return (
    <AlertContext.Provider value={{ openAlert }}>
      {children}
      <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {config?.title || 'Are you sure?'}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {config?.description}
            </AlertDialogDescription>
          </AlertDialogHeader>
          {config?.showTimelineCheckbox && (
            <div className="space-y-4 py-2">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="timeline"
                  checked={addToTimeline}
                  onCheckedChange={(checked) => setAddToTimeline(!!checked)}
                />
                <label
                  htmlFor="timeline"
                  className="text-sm leading-none cursor-pointer"
                >
                  Add this action to Event Timeline
                </label>
              </div>

              {addToTimeline && (
                <div className="space-y-2 animate-in fade-in slide-in-from-top-1">
                  <label className="text-sm text-muted-foreground">
                    Reason for deletion
                  </label>
                  <Textarea
                    placeholder="Provide a brief explanation..."
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    autoFocus
                  />
                </div>
              )}
            </div>
          )}
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isLoading}>
              {config?.cancelText || 'Hủy'}
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirm}
              disabled={isConfirmDisabled}
              className="bg-destructive text-destructive-foreground! hover:bg-destructive/90"
            >
              {isLoading ? 'Processing...' : config?.confirmText || 'Confirm'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AlertContext.Provider>
  )
}

export const useAlert = () => {
  const context = useContext(AlertContext)
  if (!context) throw new Error('useAlert must be used within AlertProvider')
  return context
}
