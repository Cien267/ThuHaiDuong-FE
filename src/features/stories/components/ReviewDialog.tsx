import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { reviewSchema } from '../constants/story.constants'
import type { ReviewStoryValues } from '../types/story.types'

interface ReviewDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (values: ReviewStoryValues) => void
  isLoading?: boolean
  storyTitle: string
}

export const ReviewDialog = ({
  open,
  onOpenChange,
  onSubmit,
  isLoading,
  storyTitle,
}: ReviewDialogProps) => {
  const form = useForm<ReviewStoryValues>({
    resolver: zodResolver(reviewSchema),
    defaultValues: { isApproved: true, rejectionReason: '' },
  })

  const isApproved = form.watch('isApproved')

  const handleSubmit = (values: ReviewStoryValues) => {
    onSubmit({
      isApproved: values.isApproved,
      rejectionReason: values.isApproved ? undefined : values.rejectionReason,
    })
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(o) => {
        onOpenChange(o)
        if (!o) form.reset()
      }}
    >
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Review Story</DialogTitle>
          <p className="text-sm text-muted-foreground mt-1 truncate">
            {storyTitle}
          </p>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-4"
          >
            {/* Approve / Reject radio */}
            <FormField
              control={form.control}
              name="isApproved"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Decision</FormLabel>
                  <FormControl>
                    <RadioGroup
                      value={field.value ? 'approve' : 'reject'}
                      onValueChange={(v) => field.onChange(v === 'approve')}
                      className="flex gap-6"
                    >
                      <div className="flex items-center gap-2">
                        <RadioGroupItem value="approve" id="approve" />
                        <label
                          htmlFor="approve"
                          className="text-sm font-medium text-green-600 cursor-pointer"
                        >
                          ✓ Approve
                        </label>
                      </div>
                      <div className="flex items-center gap-2">
                        <RadioGroupItem value="reject" id="reject" />
                        <label
                          htmlFor="reject"
                          className="text-sm font-medium text-destructive cursor-pointer"
                        >
                          ✗ Reject
                        </label>
                      </div>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Rejection reason — chỉ hiện khi Reject */}
            {!isApproved && (
              <FormField
                control={form.control}
                name="rejectionReason"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Rejection Reason{' '}
                      <span className="text-destructive">*</span>
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Tell the contributor what needs to be fixed..."
                        className="resize-none"
                        rows={4}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isLoading}
                variant={isApproved ? 'default' : 'destructive'}
              >
                {isLoading
                  ? 'Submitting...'
                  : isApproved
                    ? 'Approve Story'
                    : 'Reject Story'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
