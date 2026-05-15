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
import { MoreHorizontal, Plus, Search, Pencil, Trash2 } from 'lucide-react'
import { useDebounce } from '@/hooks/useDebounce'
import { CategoryForm } from '../components/CategoryForm'
import {
  useCategoryList,
  useCategoryDetail,
  useCreateCategory,
  useUpdateCategory,
  useDeleteCategory,
} from '../hooks/useCategories'
import type {
  CategoryResult,
  CategoryFormValues,
} from '../types/category.types'
import { CATEGORY_PAGE_SIZE } from '../constants/category.constants'

export const CategoriesPage = () => {
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [editId, setEditId] = useState<string | null>(null)

  const debouncedSearch = useDebounce(search, 400)

  // ── Data ────────────────────────────────────────────────────────────────────
  const { data, isLoading } = useCategoryList({
    name: debouncedSearch || undefined,
    pageNumber: page,
    pageSize: CATEGORY_PAGE_SIZE,
  })

  const { data: editData, isLoading: isLoadingEdit } = useCategoryDetail(
    editId ?? ''
  )

  // ── Mutations ────────────────────────────────────────────────────────────────
  const createMutation = useCreateCategory()
  const updateMutation = useUpdateCategory(editId ?? '')
  const deleteMutation = useDeleteCategory()

  // ── Handlers ─────────────────────────────────────────────────────────────────
  const handleOpenCreate = () => {
    setEditId(null)
    setDialogOpen(true)
  }

  const handleOpenEdit = (id: string) => {
    setEditId(id)
    setDialogOpen(true)
  }

  const handleSubmit = async (values: CategoryFormValues) => {
    if (editId) {
      await updateMutation.mutateAsync(values)
    } else {
      await createMutation.mutateAsync(values)
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
  const totalPages = data ? Math.ceil(data.totalCount / CATEGORY_PAGE_SIZE) : 1

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Danh mục</h1>
          <p className="text-sm text-muted-foreground">
            Quản lý danh mục và phân mục con.
          </p>
        </div>
        <Button variant="greenShiny" onClick={handleOpenCreate}>
          <Plus className="h-4 w-4" />
          Tạo mới
        </Button>
      </div>

      {/* Search */}
      <div className="relative w-72">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Tìm kiếm danh mục..."
          className="pl-8!"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value)
            setPage(1)
          }}
        />
      </div>

      {/* Table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Tên</TableHead>
              <TableHead>Slug</TableHead>
              <TableHead>Danh mục cha</TableHead>
              <TableHead className="text-center">Thứ tự</TableHead>
              <TableHead className="text-center">Truyện</TableHead>
              <TableHead className="text-center">Trạng thái</TableHead>
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
                  Không tìm thấy danh mục nào.
                </TableCell>
              </TableRow>
            ) : (
              data?.data.map((cat: CategoryResult) => (
                <TableRow key={cat.id}>
                  <TableCell className="font-medium">{cat.name}</TableCell>
                  <TableCell className="text-muted-foreground font-mono text-sm">
                    {cat.slug}
                  </TableCell>
                  <TableCell>
                    {cat.parentName ?? (
                      <span className="text-muted-foreground">—</span>
                    )}
                  </TableCell>
                  <TableCell className="text-center">{cat.sortOrder}</TableCell>
                  <TableCell className="text-center">
                    {cat.storyCount}
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge variant={cat.isActive ? 'info' : 'secondary'}>
                      {cat.isActive ? 'Active' : 'Inactive'}
                    </Badge>
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
                          onClick={() => handleOpenEdit(cat.id)}
                        >
                          <Pencil className="mr-2 h-4 w-4" />
                          Chỉnh sửa
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-destructive"
                          onClick={() => setDeleteId(cat.id)}
                          disabled={cat.storyCount > 0}
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Xóa
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
        <div className="flex items-center justify-end gap-2">
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
      )}

      {/* Create / Edit Dialog */}
      <Dialog
        open={dialogOpen}
        onOpenChange={(open) => {
          setDialogOpen(open)
          if (!open) setEditId(null)
        }}
      >
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {editId ? 'Chỉnh sửa Danh Mục' : 'Tạo Danh Mục Mới'}
            </DialogTitle>
          </DialogHeader>
          {editId && isLoadingEdit ? (
            <div className="py-8 text-center text-muted-foreground">
              Loading...
            </div>
          ) : (
            <CategoryForm
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
            <AlertDialogTitle>Xóa danh mục?</AlertDialogTitle>
            <AlertDialogDescription>
              Hành động này không thể hoàn tác. Danh mục sẽ bị xóa mềm và bị
              loại bỏ khỏi tất cả các truyện.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground! hover:bg-destructive/90"
              onClick={handleDelete}
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

export default CategoriesPage
