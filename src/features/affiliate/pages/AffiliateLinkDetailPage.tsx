import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Pencil, Trash2, ExternalLink, Copy } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import {
  useAffiliateLinkDetail,
  useDeleteAffiliateLink,
} from '../hooks/useAffiliate'
import {
  AffiliateLinkStatusBadge,
  PlacementBadge,
} from '../components/AffiliateLinkStatusBadge'

function InfoRow({
  label,
  children,
}: {
  label: string
  children: React.ReactNode
}) {
  return (
    <div className="flex items-start gap-4 py-3 border-b last:border-0">
      <span className="text-sm text-muted-foreground w-36 shrink-0">
        {label}
      </span>
      <div className="text-sm flex-1">{children}</div>
    </div>
  )
}

function formatDateTime(dateStr: string | null) {
  if (!dateStr) return '—'
  return new Date(dateStr).toLocaleString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export default function AffiliateLinkDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { data: link, isLoading } = useAffiliateLinkDetail(id!)
  const deleteLink = useDeleteAffiliateLink()

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

  const copyRedirectUrl = () => {
    navigator.clipboard.writeText(
      `${window.location.origin}${link.redirectUrl}`
    )
    toast.success('Đã copy URL redirect')
  }

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-5">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate('/admin/affiliate/links')}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">
              {link.name}
            </h1>
            <p className="text-sm text-muted-foreground font-mono mt-0.5">
              {link.trackingCode}
            </p>
          </div>
        </div>

        <div className="flex gap-2 shrink-0">
          <Button
            variant="outline"
            onClick={() => navigate(`/admin/affiliate/links/${id}/edit`)}
          >
            <Pencil className="h-4 w-4 mr-2" />
            Chỉnh sửa
          </Button>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive">
                <Trash2 className="h-4 w-4 mr-2" />
                Xóa
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Xóa affiliate link?</AlertDialogTitle>
                <AlertDialogDescription>
                  Link <strong>{link.name}</strong> sẽ bị xóa. Lịch sử click vẫn
                  được giữ lại cho báo cáo.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Hủy</AlertDialogCancel>
                <AlertDialogAction
                  className="bg-destructive hover:bg-destructive/90"
                  onClick={() => deleteLink.mutate(link.id)}
                >
                  Xóa
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-3 gap-4">
        {[
          {
            label: 'Tổng clicks',
            value: link.totalClicks.toLocaleString('vi-VN'),
          },
          { label: 'Truyện gắn', value: link.totalStories },
          { label: 'Chapter gắn', value: link.totalChapters },
        ].map((card) => (
          <div
            key={card.label}
            className="rounded-lg border bg-card p-4 text-center"
          >
            <p className="text-2xl font-bold">{card.value}</p>
            <p className="text-sm text-muted-foreground mt-1">{card.label}</p>
          </div>
        ))}
      </div>

      {/* Info */}
      <div className="rounded-lg border bg-card p-5">
        <h2 className="font-medium mb-2">Thông tin link</h2>

        <InfoRow label="Trạng thái">
          <AffiliateLinkStatusBadge isActive={link.isActive} />
        </InfoRow>

        <InfoRow label="Vị trí">
          <PlacementBadge placement={link.placement} />
        </InfoRow>

        <InfoRow label="Độ ưu tiên">
          <span>{link.priority}</span>
        </InfoRow>

        <InfoRow label="URL đích">
          <a
            href={link.targetUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary underline underline-offset-2 inline-flex items-center gap-1 break-all"
          >
            {link.targetUrl}
            <ExternalLink className="h-3.5 w-3.5 shrink-0" />
          </a>
        </InfoRow>

        <InfoRow label="Redirect URL">
          <div className="flex items-center gap-2">
            <code className="text-xs bg-muted px-2 py-1 rounded font-mono">
              {window.location.origin}
              {link.redirectUrl}
            </code>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7"
              onClick={copyRedirectUrl}
            >
              <Copy className="h-3.5 w-3.5" />
            </Button>
          </div>
        </InfoRow>

        <InfoRow label="Thời gian">
          {link.startDate || link.endDate ? (
            <span>
              {formatDateTime(link.startDate)} → {formatDateTime(link.endDate)}
            </span>
          ) : (
            <span className="text-muted-foreground">Không giới hạn</span>
          )}
        </InfoRow>

        <InfoRow label="Ngày tạo">{formatDateTime(link.createdAt)}</InfoRow>
        <InfoRow label="Cập nhật lần cuối">
          {formatDateTime(link.updatedAt)}
        </InfoRow>
      </div>

      {/* Target stories */}
      {link.stories.length > 0 && (
        <div className="rounded-lg border bg-card p-5">
          <h2 className="font-medium mb-3">
            Truyện được gắn
            <Badge variant="secondary" className="ml-2">
              {link.stories.length}
            </Badge>
          </h2>
          <div className="space-y-2">
            {link.stories.map((story) => (
              <div
                key={story.id}
                className="flex items-center justify-between py-2 border-b last:border-0"
              >
                <span className="text-sm">{story.title}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-xs text-muted-foreground"
                  onClick={() => navigate(`/admin/stories/${story.id}`)}
                >
                  Xem truyện
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Target chapters */}
      {link.chapters.length > 0 && (
        <div className="rounded-lg border bg-card p-5">
          <h2 className="font-medium mb-3">
            Chapter được gắn
            <Badge variant="secondary" className="ml-2">
              {link.chapters.length}
            </Badge>
          </h2>
          <div className="space-y-2">
            {link.chapters.map((chapter) => (
              <div
                key={chapter.id}
                className="flex items-center justify-between py-2 border-b last:border-0"
              >
                <span className="text-sm">{chapter.title}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-xs text-muted-foreground"
                  onClick={() => navigate(`/admin/chapters/${chapter.id}`)}
                >
                  Xem chapter
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Global notice */}
      {link.stories.length === 0 && link.chapters.length === 0 && (
        <div className="rounded-lg border border-dashed bg-muted/30 p-5 text-center">
          <p className="text-sm text-muted-foreground">
            Link này là <strong>toàn cục</strong> — hiển thị trên tất cả truyện
            và chapter
          </p>
        </div>
      )}
    </div>
  )
}
