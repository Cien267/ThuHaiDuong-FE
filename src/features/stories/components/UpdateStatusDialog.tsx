import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { PUBLISHABLE_STATUSES } from '../constants/story.constants'
import { StoryStatusBadge } from './StoryStatusBadge'
import type { StoryStatus } from '../types/story.types'

interface UpdateStatusDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  currentStatus: StoryStatus
  onSubmit: (status: StoryStatus) => void
  isLoading?: boolean
}

export const UpdateStatusDialog = ({
  open,
  onOpenChange,
  currentStatus,
  onSubmit,
  isLoading,
}: UpdateStatusDialogProps) => {
  const [selected, setSelected] = useState<StoryStatus>(
    PUBLISHABLE_STATUSES.includes(currentStatus as any)
      ? currentStatus
      : 'Publishing'
  )

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>Update Publish Status</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div className="flex items-center gap-2 text-sm">
            <span className="text-muted-foreground">Current:</span>
            <StoryStatusBadge status={currentStatus} />
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium">New Status</label>
            <Select
              value={selected}
              onValueChange={(v) => setSelected(v as StoryStatus)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {PUBLISHABLE_STATUSES.map((s) => (
                  <SelectItem key={s} value={s}>
                    {s}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {selected === 'Paused' && (
              <p className="text-xs text-muted-foreground mt-1">
                ⚠ Paused stories are hidden from the client site immediately.
              </p>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            onClick={() => onSubmit(selected)}
            disabled={isLoading || selected === currentStatus}
          >
            {isLoading ? 'Updating...' : 'Update Status'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
