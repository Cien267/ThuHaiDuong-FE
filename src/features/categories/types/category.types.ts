export interface CategorySummary {
  id: string
  name: string
  slug: string
  description?: string | null
  parentId?: string | null
  sortOrder: number
  children: CategorySummary[]
}

export interface CategoryResult {
  id: string
  name: string
  slug: string
  description?: string | null
  parentId?: string | null
  parentName?: string | null
  sortOrder: number
  isActive: boolean
  storyCount: number
  createdAt: string
  updatedAt: string
}

export interface TagResult {
  id: string
  name: string
  slug: string
  storyCount: number
  createdAt: string
}

export interface TagSummary {
  id: string
  name: string
  slug: string
}

// ── Pagination ─────────────────────────────────────────────────────────────────

export interface PagedResult<T> {
  items: T[]
  totalCount: number
  pageNumber: number
  pageSize: number
  totalPages: number
}

// ── Query params ───────────────────────────────────────────────────────────────

export interface CategoryQuery {
  name?: string
  isActive?: boolean
  parentId?: string
  pageNumber?: number
  pageSize?: number
  sortBy?: string
  sortDescending?: boolean
}

export interface TagQuery {
  name?: string
  pageNumber?: number
  pageSize?: number
  sortBy?: string
  sortDescending?: boolean
}

// ── Form inputs (khớp backend CreateCategoryInput / UpdateCategoryInput) ───────

export interface CategoryFormValues {
  name: string
  slug?: string
  description?: string
  parentId?: string
  sortOrder: number
  isActive: boolean
}

export interface TagFormValues {
  name: string
  slug?: string
}
