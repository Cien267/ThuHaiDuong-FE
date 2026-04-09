import type { Person } from '@/features/people/types'
import type { Company } from '@/features/companies/types'
import type { Asset } from '@/features/assets/types'
import type { Liability } from '@/features/liabilities/types'

export interface BaseEntity {
  id: string
  createdAt: string
  updatedAt: string
  deletedAt?: string
}

export interface PaginationParams {
  pageNumber?: number
  pageSize?: number
  sortBy?: string
  sortDescending?: boolean
}

export interface PaginatedResponse<T> {
  data: T[]
  totalCount: number
  pageNumber: number
  pageSize: number
  totalPages: number
  hasPreviousPage: boolean
  hasNextPage: boolean
}

export interface ExportSettings {
  format: 'excel' | 'csv' | 'pdf'
  entities: {
    people: boolean
    companies: boolean
    assets: boolean
    liabilities: boolean
  }
  columns: {
    people: string[]
    companies: string[]
    assets: string[]
    liabilities: string[]
  }
  includeHeaders: boolean
  fileName: string
}

export interface ExportData {
  people: Person[]
  companies: Company[]
  assets: Asset[]
  liabilities: Liability[]
}
