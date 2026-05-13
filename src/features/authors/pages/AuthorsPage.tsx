import { useState } from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  MoreHorizontal,
  Plus,
  Search,
  Pencil,
  Trash2,
  BookOpen,
} from 'lucide-react'
import { useDebounce } from '@/hooks/useDebounce'
import { AuthorForm } from '../components/AuthorForm'
import {
  useAuthorList,
  useAuthorDetail,
  useCreateAuthor,
  useUpdateAuthor,
  useDeleteAuthor,
} from '../hooks/useAuthors'
import { COUNTRIES } from '../types/author.types'
import { AUTHOR_PAGE_SIZE } from '../constants/author.constants'
import type { AuthorFormValues } from '../types/author.types'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { formatDate } from '@/lib/utils'

export const AuthorsPage = () => {
  const [search, setSearch] = useState('')
  const [country, setCountry] = useState('all')
  const [page, setPage] = useState(1)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [editId, setEditId] = useState<string | null>(null)

  const debouncedSearch = useDebounce(search, 400)

  // ── Data ─────────────────────────────────────────────────────────────────────
  const { data, isLoading } = useAuthorList({
    name: debouncedSearch || undefined,
    country: country || undefined,
    pageNumber: page,
    pageSize: AUTHOR_PAGE_SIZE,
  })

  const { data: editData, isLoading: isLoadingEdit } = useAuthorDetail(
    editId ?? ''
  )

  // ── Mutations ─────────────────────────────────────────────────────────────────
  const createMutation = useCreateAuthor()
  const updateMutation = useUpdateAuthor(editId ?? '')
  const deleteMutation = useDeleteAuthor()

  // ── Handlers ──────────────────────────────────────────────────────────────────
  const handleOpenCreate = () => {
    setEditId(null)
    setDialogOpen(true)
  }
  const handleOpenEdit = (id: string) => {
    setEditId(id)
    setDialogOpen(true)
  }

  const handleSubmit = async (values: AuthorFormValues) => {
    // Clean empty strings → undefined trước khi gửi lên backend
    const payload: AuthorFormValues = {
      name: values.name,
      slug: values.slug || undefined,
      penName: values.penName || undefined,
      country: values.country || undefined,
      description: values.description || undefined,
      avatarUrl: values.avatarUrl || undefined,
    }

    if (editId) {
      await updateMutation.mutateAsync(payload)
    } else {
      await createMutation.mutateAsync(payload)
    }
    setDialogOpen(false)
    setEditId(null)
  }

  const handleDelete = async () => {
    if (!deleteId) return
    await deleteMutation.mutateAsync(deleteId)
    setDeleteId(null)
  }

  const isSaving = createMutation.isPending || updateMutation.isPending
  const totalPages = data ? Math.ceil(data.totalCount / AUTHOR_PAGE_SIZE) : 1

  // Helper: lấy label quốc gia từ code
  const getCountryLabel = (code?: string | null) =>
    COUNTRIES.find((c) => c.code === code)?.label ?? code ?? '—'

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Authors</h1>
          <p className="text-sm text-muted-foreground">
            Manage story authors and their profiles.
          </p>
        </div>
        <Button variant={'greenShiny'} onClick={handleOpenCreate}>
          <Plus className="mr-2 h-4 w-4" />
          Tạo tác giả
        </Button>
      </div>

      {/* Filters */}
      <div className="flex gap-3">
        <div className="relative w-72">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by name or pen name..."
            className="pl-8!"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value)
              setPage(1)
            }}
          />
        </div>

        {/* Country filter */}
        <Select
          onValueChange={(e) => {
            setCountry(e)
            setPage(1)
          }}
          value={country}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Chọn quốc gia" />
          </SelectTrigger>
          <SelectContent className="w-full">
            <SelectItem value="all">Tất cả quốc gia</SelectItem>
            {COUNTRIES.map((country) => (
              <SelectItem key={country.code} value={country.code}>
                {country.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Tác giả</TableHead>
              <TableHead>Slug</TableHead>
              <TableHead>Quốc gia</TableHead>
              <TableHead className="text-center">
                <div className="flex items-center justify-center gap-1">
                  <BookOpen className="h-3.5 w-3.5" />
                  Truyện
                </div>
              </TableHead>
              <TableHead className="text-center">Đã xuất bản</TableHead>
              <TableHead>Ngày tạo</TableHead>
              <TableHead className="w-10" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="py-10 text-center text-muted-foreground"
                >
                  Loading...
                </TableCell>
              </TableRow>
            ) : data?.data.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="py-10 text-center text-muted-foreground"
                >
                  Không tìm thấy tác giả nào.
                </TableCell>
              </TableRow>
            ) : (
              data?.data.map((author) => (
                <TableRow key={author.id}>
                  {/* Avatar + Name + PenName */}
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage
                          src={author.avatarUrl ?? undefined}
                          alt={author.name}
                        />
                        <AvatarFallback className="text-xs">
                          {author.name.slice(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium leading-none">
                          {author.name}
                        </p>
                        {author.penName && (
                          <p className="text-xs text-muted-foreground mt-0.5">
                            {author.penName}
                          </p>
                        )}
                      </div>
                    </div>
                  </TableCell>

                  <TableCell className="font-mono text-sm text-muted-foreground">
                    {author.slug}
                  </TableCell>

                  <TableCell>
                    {author.country ? (
                      <Badge variant="outline">
                        {getCountryLabel(author.country)}
                      </Badge>
                    ) : (
                      <span className="text-muted-foreground">—</span>
                    )}
                  </TableCell>

                  <TableCell className="text-center">
                    {author.storyCount}
                  </TableCell>

                  <TableCell className="text-center">
                    <Badge
                      variant={
                        author.publishedStoryCount > 0 ? 'default' : 'secondary'
                      }
                    >
                      {author.publishedStoryCount}
                    </Badge>
                  </TableCell>

                  <TableCell className="text-sm text-muted-foreground">
                    {formatDate(author.createdAt)}
                  </TableCell>

                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() => handleOpenEdit(author.id)}
                        >
                          <Pencil className="mr-2 h-4 w-4" />
                          Chỉnh sửa
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-destructive"
                          onClick={() => setDeleteId(author.id)}
                          disabled={author.storyCount > 0}
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          {author.storyCount > 0 ? 'Có truyện' : 'Xóa'}
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            {data?.totalCount} tổng số tác giả
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={page === 1}
              onClick={() => setPage((p) => p - 1)}
            >
              Trước
            </Button>
            <span className="text-sm text-muted-foreground">
              Trang {page} của {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              disabled={page === totalPages}
              onClick={() => setPage((p) => p + 1)}
            >
              Tiếp theo
            </Button>
          </div>
        </div>
      )}

      {/* Create / Edit Dialog */}
      <Dialog
        open={dialogOpen}
        onOpenChange={(open) => {
          setDialogOpen(open)
          if (!open) setEditId(null)
        }}
      >
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editId ? 'Chỉnh sửa tác giả' : 'Tác giả mới'}
            </DialogTitle>
          </DialogHeader>
          {editId && isLoadingEdit ? (
            <div className="py-8 text-center text-muted-foreground">
              Loading...
            </div>
          ) : (
            <AuthorForm
              initialData={editId ? editData : undefined}
              onSubmit={handleSubmit}
              isLoading={isSaving}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirm */}
      <AlertDialog
        open={!!deleteId}
        onOpenChange={(open) => !open && setDeleteId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xóa tác giả?</AlertDialogTitle>
            <AlertDialogDescription>
              Hành động này không thể hoàn tác. Các tác giả có truyện gán không
              thể bị xóa — hãy gán lại hoặc xóa các truyện của họ trước.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground! hover:bg-destructive/90"
              onClick={handleDelete}
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending ? 'Đang xóa...' : 'Xóa'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

export default AuthorsPage
