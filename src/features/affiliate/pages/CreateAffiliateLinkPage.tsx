import { ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { AffiliateLinkForm } from '../components/AffiliateLinkForm'
import { useCreateAffiliateLink } from '../hooks/useAffiliate'
import type { AffiliateLinkFormValues } from '../constants/affiliate.constants'

// ── Create ────────────────────────────────────────────────────────────────────

export function CreateAffiliateLinkPage() {
  const createLink = useCreateAffiliateLink()

  const handleSubmit = (values: AffiliateLinkFormValues) => {
    createLink.mutate({
      name: values.name,
      targetUrl: values.targetUrl,
      trackingCode: values.trackingCode || undefined,
      placement: values.placement,
      priority: values.priority,
      isActive: values.isActive,
      startDate: values.startDate || undefined,
      endDate: values.endDate || undefined,
      storyIds: values.storyIds,
      chapterIds: values.chapterIds,
    })
  }

  return (
    <div className="max-w-full space-y-4">
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => window.history.back()}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            Tạo affiliate link
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Tracking code sẽ tự tạo nếu để trống
          </p>
        </div>
      </div>

      <AffiliateLinkForm
        onSubmit={handleSubmit}
        isPending={createLink.isPending}
      />
    </div>
  )
}

export default CreateAffiliateLinkPage
