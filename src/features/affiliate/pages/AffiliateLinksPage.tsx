import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Plus, Trash2, Pencil, ExternalLink } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
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
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import {
  useAffiliateLinkList,
  useDeleteAffiliateLink,
} from '../hooks/useAffiliate'
import {
  AffiliateLinkStatusBadge,
  PlacementBadge,
} from '../components/AffiliateLinkStatusBadge'
import {
  AFFILIATE_PLACEMENTS,
  PLACEMENT_LABELS,
  type AffiliateLinkQuery,
  type AffiliateLinkResult,
} from '@/features/affiliate/types/affiliate.types'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

function formatDate(dateStr: string | null) {
  if (!dateStr) return '—'
  return new Date(dateStr).toLocaleDateString('vi-VN')
}

export default function AffiliateLinksPage() {
  const navigate = useNavigate()
  const [query, setQuery] = useState<AffiliateLinkQuery>({ pageNumber: 1 })
  const [nameInput, setNameInput] = useState('')

  const { data, isLoading } = useAffiliateLinkList(query)
  const deleteLink = useDeleteAffiliateLink()

  const handleNameSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      setQuery((prev: AffiliateLinkQuery) => ({
        ...prev,
        name: nameInput || undefined,
        pageNumber: 1,
      }))
    }
  }

  const setFilter = (
    key: keyof AffiliateLinkQuery,
    value: string | boolean | undefined
  ) => {
    setQuery((prev: AffiliateLinkQuery) => ({
      ...prev,
      [key]: value,
      pageNumber: 1,
    }))
  }

  const totalPages = data?.totalPages ?? 1

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            Affiliate Links
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            {data ? `${data.totalCount} link` : 'Đang tải...'}
          </p>
        </div>
        <Button
          variant={'greenShiny'}
          onClick={() => navigate('/affiliate/links/create')}
        >
          <Plus className="h-4 w-4 mr-2" />
          Tạo link mới
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <Input
          className="w-60"
          placeholder="Tìm theo tên... (Enter)"
          value={nameInput}
          onChange={(e) => setNameInput(e.target.value)}
          onKeyDown={handleNameSearch}
        />

        <Select
          value={query.placement ?? 'all'}
          onValueChange={(val) =>
            setFilter('placement', val === 'all' ? undefined : val)
          }
        >
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Vị trí" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả vị trí</SelectItem>
            {AFFILIATE_PLACEMENTS.map((p) => (
              <SelectItem key={p} value={p}>
                {PLACEMENT_LABELS[p]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={
            query.isActive === undefined
              ? 'all'
              : query.isActive
                ? 'active'
                : 'inactive'
          }
          onValueChange={(val) =>
            setFilter('isActive', val === 'all' ? undefined : val === 'active')
          }
        >
          <SelectTrigger className="w-44">
            <SelectValue placeholder="Trạng thái" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả</SelectItem>
            <SelectItem value="active">Đang hoạt động</SelectItem>
            <SelectItem value="inactive">Tạm dừng</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <Table className="w-full text-sm">
          <TableHeader>
            <TableRow>
              <TableHead className="px-4 py-3 text-left font-medium text-muted-foreground">
                Tên
              </TableHead>
              <TableHead className="px-4 py-3 text-left font-medium text-muted-foreground">
                Vị trí
              </TableHead>
              <TableHead className="px-4 py-3 text-left font-medium text-muted-foreground">
                Trạng thái
              </TableHead>
              <TableHead className="px-4 py-3 text-center font-medium text-muted-foreground">
                Clicks
              </TableHead>
              <TableHead className="px-4 py-3 text-center font-medium text-muted-foreground">
                Truyện
              </TableHead>
              <TableHead className="px-4 py-3 text-center font-medium text-muted-foreground">
                Chapter
              </TableHead>
              <TableHead className="px-4 py-3 text-left font-medium text-muted-foreground">
                Hết hạn
              </TableHead>
              <TableHead className="px-4 py-3 text-right font-medium text-muted-foreground">
                Thao tác
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="divide-y divide-border">
            {isLoading ? (
              <TableRow>
                <TableCell
                  colSpan={8}
                  className="px-4 py-12 text-center text-muted-foreground"
                >
                  Đang tải...
                </TableCell>
              </TableRow>
            ) : data?.data.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={8}
                  className="px-4 py-12 text-center text-muted-foreground"
                >
                  Không có affiliate link nào
                </TableCell>
              </TableRow>
            ) : (
              data?.data.map((link: AffiliateLinkResult) => (
                <TableRow
                  key={link.id}
                  className="hover:bg-muted/20 cursor-pointer"
                  onClick={() => navigate(`/admin/affiliate/links/${link.id}`)}
                >
                  <TableCell className="px-4 py-3">
                    <div>
                      <p className="font-medium">{link.name}</p>
                      <p className="text-xs text-muted-foreground font-mono mt-0.5">
                        {link.trackingCode}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell className="px-4 py-3">
                    <PlacementBadge placement={link.placement} />
                  </TableCell>
                  <TableCell className="px-4 py-3">
                    <AffiliateLinkStatusBadge isActive={link.isActive} />
                  </TableCell>
                  <TableCell className="px-4 py-3 text-center font-medium">
                    {link.totalClicks.toLocaleString('vi-VN')}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-center text-muted-foreground">
                    {link.totalStories}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-center text-muted-foreground">
                    {link.totalChapters}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-muted-foreground text-xs">
                    {formatDate(link.endDate)}
                  </TableCell>
                  <TableCell
                    className="px-4 py-3"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="flex items-center gap-1 justify-end">
                      <TooltipProvider delayDuration={200}>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() =>
                                window.open(link.targetUrl, '_blank')
                              }
                            >
                              <ExternalLink className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Mở URL đích</TooltipContent>
                        </Tooltip>

                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() =>
                                navigate(
                                  `/admin/affiliate/links/${link.id}/edit`
                                )
                              }
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Chỉnh sửa</TooltipContent>
                        </Tooltip>

                        <AlertDialog>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <AlertDialogTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8 text-destructive hover:text-destructive"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </AlertDialogTrigger>
                            </TooltipTrigger>
                            <TooltipContent>Xóa</TooltipContent>
                          </Tooltip>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>
                                Xóa affiliate link?
                              </AlertDialogTitle>
                              <AlertDialogDescription>
                                Link <strong>{link.name}</strong> sẽ bị xóa.
                                Lịch sử click vẫn được giữ lại cho báo cáo.
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
                      </TooltipProvider>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {data && totalPages > 1 && (
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>
            Trang {data.pageNumber} / {totalPages}
          </span>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={data.pageNumber <= 1}
              onClick={() =>
                setQuery((prev: AffiliateLinkQuery) => ({
                  ...prev,
                  pageNumber: (prev.pageNumber ?? 1) - 1,
                }))
              }
            >
              Trước
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={data.pageNumber >= totalPages}
              onClick={() =>
                setQuery((prev: AffiliateLinkQuery) => ({
                  ...prev,
                  pageNumber: (prev.pageNumber ?? 1) + 1,
                }))
              }
            >
              Sau
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
