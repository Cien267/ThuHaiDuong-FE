import { z } from 'zod'
export interface AuthResult {
  accessToken: string
  refreshToken: string
  accessTokenExpiresAt: string // ISO string
  user: UserAuthInfo
}

export interface UserAuthInfo {
  id: string
  userName: string
  email: string
  fullName: string | null
  avatar: string | null
  role: UserRole
}

export interface UserProfile extends UserAuthInfo {
  phoneNumber: string | null
  lastLoginAt: string | null
  createdAt: string
}

export type UserRole = 'Contributor' | 'Admin' | 'SuperAdmin'

export const ROLE_HIERARCHY: Record<UserRole, number> = {
  Contributor: 1,
  Admin: 2,
  SuperAdmin: 3,
}

export const LoginSchema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})
export type LoginInput = z.infer<typeof LoginSchema>

export interface RefreshTokenInput {
  refreshToken: string
}

export interface AuthContextType {
  login: (data: LoginInput) => Promise<void>
  logout: () => void
  isLoading: boolean
  error: string | null
}

export const UpdateProfileSchema = z.object({
  fullName: z.string().min(1, 'Name is required'),
  phoneNumber: z.string().nullable().optional(),
})
export type UpdateProfileInput = z.infer<typeof UpdateProfileSchema>

export const ChangePasswordSchema = z
  .object({
    id: z.string().optional(),
    currentPassword: z.string().min(1, 'Current password is required'),
    newPassword: z
      .string()
      .min(6, 'New password must be at least 6 characters'),
    confirmPassword: z.string().optional(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'New passwords do not match',
    path: ['confirmPassword'],
  })
export type ChangePasswordInput = z.infer<typeof ChangePasswordSchema>

export interface UpdateUsernameInput {
  userName: string
}

export interface TokenPayload {
  'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier': string
  'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name': string
  'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress': string
  'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/role': UserRole
  exp: number // Unix timestamp
  jti: string
}
