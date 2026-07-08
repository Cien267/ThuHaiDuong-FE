import type {
  TokenPayload,
  UserAuthInfo,
} from '@/features/auth/types/auth.types'

// ── Claim type constants — hỗ trợ cả 2 dạng ASP.NET có thể generate ──────────
const CLAIM_NAMEIDENTIFIER = [
  'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier',
  'nameid',
  'sub',
]
const CLAIM_NAME = [
  'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name',
  'unique_name',
  'name',
]
const CLAIM_EMAIL = [
  'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress',
  'email',
]
const CLAIM_ROLE = [
  'http://schemas.microsoft.com/ws/2008/06/identity/claims/role',
  'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/role',
  'role',
  'roles',
]

// Helper: thử tất cả các key có thể, trả về giá trị đầu tiên tìm được
function readClaim(
  payload: Record<string, unknown>,
  keys: string[]
): string | undefined {
  for (const key of keys) {
    const value = payload[key]
    if (value !== undefined && value !== null) {
      // Role claim đôi khi là array nếu user có nhiều role — lấy phần tử đầu
      return Array.isArray(value) ? value[0] : String(value)
    }
  }
  return undefined
}

export const decodeToken = (token: string): TokenPayload | null => {
  try {
    const base64Payload = token.split('.')[1]
    if (!base64Payload) return null

    const base64 = base64Payload
      .replace(/-/g, '+')
      .replace(/_/g, '/')
      .padEnd(
        base64Payload.length + ((4 - (base64Payload.length % 4)) % 4),
        '='
      )

    return JSON.parse(atob(base64)) as TokenPayload
  } catch {
    return null
  }
}

export const getUserFromToken = (token: string): UserAuthInfo | null => {
  const payload = decodeToken(token)
  if (!payload) return null

  const claims = payload as unknown as Record<string, unknown>
  const role = readClaim(claims, CLAIM_ROLE)
  const id = readClaim(claims, CLAIM_NAMEIDENTIFIER)

  // Token không có role hoặc id hợp lệ → coi như token không hợp lệ
  // Tránh trả về user "ma" với role undefined gây lỗi hasMinRole ngầm
  if (!role || !id) {
    if (import.meta.env.DEV) {
      console.warn('[auth] Token missing role or id claim. Payload:', payload)
    }
    return null
  }

  return {
    id,
    userName: readClaim(claims, CLAIM_NAME) ?? '',
    email: readClaim(claims, CLAIM_EMAIL) ?? '',
    role: role as UserAuthInfo['role'],
    fullName: null,
    avatar: null,
  }
}

export const isTokenExpired = (token: string, bufferSeconds = 30): boolean => {
  const payload = decodeToken(token)
  if (!payload?.exp) return true

  const nowSeconds = Math.floor(Date.now() / 1000)
  return payload.exp <= nowSeconds + bufferSeconds
}

export const isTokenValid = (token: string | null): boolean => {
  if (!token) return false
  const payload = decodeToken(token)
  if (!payload) return false
  return !isTokenExpired(token)
}

export const getTokenExpiryMs = (token: string): number | null => {
  const payload = decodeToken(token)
  if (!payload?.exp) return null
  return payload.exp * 1000
}

// ── Token storage (giữ nguyên) ────────────────────────────────────────────────
const ACCESS_TOKEN_KEY = 'access_token'
const REFRESH_TOKEN_KEY = 'refresh_token'

export const tokenStorage = {
  getAccess: (): string | null => localStorage.getItem(ACCESS_TOKEN_KEY),
  getRefresh: (): string | null => localStorage.getItem(REFRESH_TOKEN_KEY),
  set: (accessToken: string, refreshToken: string): void => {
    localStorage.setItem(ACCESS_TOKEN_KEY, accessToken)
    localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken)
  },
  clear: (): void => {
    localStorage.removeItem(ACCESS_TOKEN_KEY)
    localStorage.removeItem(REFRESH_TOKEN_KEY)
  },
}
