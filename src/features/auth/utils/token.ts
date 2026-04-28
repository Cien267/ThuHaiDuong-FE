import type {
  TokenPayload,
  UserAuthInfo,
} from '@/features/auth/types/auth.types'

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

  return {
    id: payload[
      'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'
    ],
    userName:
      payload['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'],
    email:
      payload[
        'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress'
      ],
    role: payload['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/role'],
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
  return payload.exp * 1000 // convert Unix seconds → ms
}
