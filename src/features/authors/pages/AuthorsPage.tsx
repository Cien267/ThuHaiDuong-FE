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

export const AuthorsPage = () => {
  const [search, setSearch] = useState('')
  const [country, setCountry] = useState('')
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
        <Button onClick={handleOpenCreate}>
          <Plus className="mr-2 h-4 w-4" />
          New Author
        </Button>
      </div>

      {/* Filters */}
      <div className="flex gap-3">
        <div className="relative w-72">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by name or pen name..."
            className="pl-8"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value)
              setPage(1)
            }}
          />
        </div>

        {/* Country filter */}
        <select
          className="h-9 rounded-md border border-input bg-background px-3 text-sm"
          value={country}
          onChange={(e) => {
            setCountry(e.target.value)
            setPage(1)
          }}
        >
          <option value="">All countries</option>
          {COUNTRIES.map((c) => (
            <option key={c.code} value={c.code}>
              {c.label}
            </option>
          ))}
        </select>
      </div>

      {/* Table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Author</TableHead>
              <TableHead>Slug</TableHead>
              <TableHead>Country</TableHead>
              <TableHead className="text-center">
                <div className="flex items-center justify-center gap-1">
                  <BookOpen className="h-3.5 w-3.5" />
                  Stories
                </div>
              </TableHead>
              <TableHead className="text-center">Published</TableHead>
              <TableHead>Created</TableHead>
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
                  No authors found.
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
                    {new Date(author.createdAt).toLocaleDateString()}
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
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-destructive"
                          onClick={() => setDeleteId(author.id)}
                          disabled={author.storyCount > 0}
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          {author.storyCount > 0 ? 'Has stories' : 'Delete'}
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
            {data?.totalCount} authors total
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={page === 1}
              onClick={() => setPage((p) => p - 1)}
            >
              Previous
            </Button>
            <span className="text-sm text-muted-foreground">
              Page {page} of {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              disabled={page === totalPages}
              onClick={() => setPage((p) => p + 1)}
            >
              Next
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
            <DialogTitle>{editId ? 'Edit Author' : 'New Author'}</DialogTitle>
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
            <AlertDialogTitle>Delete Author?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. Authors with stories assigned cannot
              be deleted — reassign or delete their stories first.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
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

export default AuthorsPage
