import { useParams } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { AffiliateLinkForm } from '../components/AffiliateLinkForm'
import {
  useUpdateAffiliateLink,
  useAffiliateLinkDetail,
} from '../hooks/useAffiliate'
import type { AffiliateLinkFormValues } from '../constants/affiliate.constants'

export function EditAffiliateLinkPage() {
  const { id } = useParams<{ id: string }>()
  const { data: link, isLoading } = useAffiliateLinkDetail(id!)
  const updateLink = useUpdateAffiliateLink(id!)

  const handleSubmit = (values: AffiliateLinkFormValues) => {
    updateLink.mutate({
      name: values.name,
      targetUrl: values.targetUrl,
      placement: values.placement,
      priority: values.priority,
      isActive: values.isActive,
      startDate: values.startDate || undefined,
      endDate: values.endDate || undefined,
      storyIds: values.storyIds,
      chapterIds: values.chapterIds,
      imageUrl: values.imageUrl || undefined,
    })
  }

  if (isLoading) {
    return (
      <div className="p-6 text-center text-muted-foreground">Đang tải...</div>
    )
  }

  if (!link) {
    return (
      <div className="p-6 text-center text-muted-foreground">
        Không tìm thấy link
      </div>
    )
  }

  return (
    <div className="max-w-full mx-auto space-y-4">
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
            Chỉnh sửa link
          </h1>
          <p className="text-sm text-muted-foreground font-mono mt-0.5">
            {link.trackingCode}
          </p>
        </div>
      </div>

      <AffiliateLinkForm
        initialData={link}
        isEdit
        onSubmit={handleSubmit}
        isPending={updateLink.isPending}
      />
    </div>
  )
}

export default EditAffiliateLinkPage
