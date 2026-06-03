export interface UserAuthInfo {
  id: string
  userName: string
  email: string
  fullName: string | null
  avatar: string | null
  role: 'Contributor' | 'Admin' | 'SuperAdmin'
  isActive: boolean
}

export interface CreateStaffInput {
  userName: string
  email: string
  password: string
  fullName?: string
  role: 'Contributor' | 'Admin'
}

export const STAFF_ROLES = ['Contributor', 'Admin'] as const
export type StaffRole = (typeof STAFF_ROLES)[number]

export const ROLE_LABELS: Record<string, string> = {
  Contributor: 'Contributor',
  Admin: 'Admin',
  SuperAdmin: 'Super Admin',
}

export const ROLE_VARIANTS: Record<
  string,
  'default' | 'secondary' | 'outline'
> = {
  SuperAdmin: 'default',
  Admin: 'secondary',
  Contributor: 'outline',
}
