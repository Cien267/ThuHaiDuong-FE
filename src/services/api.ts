import axios, { type AxiosError, type InternalAxiosRequestConfig } from 'axios'
import { tokenStorage, isTokenExpired } from '@/features/auth/utils/token'
import useAuthStore from '@/store/authStore'

const BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:5000'

export const api = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 15_000,
})

const refreshApi = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 10_000,
})

let isRefreshing = false
let pendingQueue: Array<{
  resolve: (token: string) => void
  reject: (error: unknown) => void
}> = []

const processPendingQueue = (error: unknown, token: string | null) => {
  pendingQueue.forEach(({ resolve, reject }) => {
    if (error) reject(error)
    else resolve(token!)
  })
  pendingQueue = []
}

api.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    const accessToken = tokenStorage.getAccess()

    if (!accessToken) return config

    if (isTokenExpired(accessToken, 30)) {
      const newToken = await proactiveRefresh()
      if (newToken) {
        config.headers.Authorization = `Bearer ${newToken}`
        return config
      }
      return config
    }

    config.headers.Authorization = `Bearer ${accessToken}`
    return config
  },
  (error) => Promise.reject(error)
)

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean
    }

    if (error.response?.status !== 401 || originalRequest._retry) {
      return Promise.reject(error)
    }

    originalRequest._retry = true

    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        pendingQueue.push({
          resolve: (token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`
            resolve(api(originalRequest))
          },
          reject,
        })
      })
    }

    isRefreshing = true

    try {
      const refreshToken = tokenStorage.getRefresh()

      if (!refreshToken) throw new Error('No refresh token')

      const { data } = await refreshApi.post('/api/auth/refresh', {
        refreshToken,
      })

      const { accessToken, refreshToken: newRefreshToken, user } = data

      tokenStorage.set(accessToken, newRefreshToken)

      useAuthStore
        .getState()
        .setAuthFromResult(user, accessToken, newRefreshToken)

      processPendingQueue(null, accessToken)

      originalRequest.headers.Authorization = `Bearer ${accessToken}`
      return api(originalRequest)
    } catch (refreshError) {
      processPendingQueue(refreshError, null)
      useAuthStore.getState().logout()

      window.location.href = '/login'

      return Promise.reject(refreshError)
    } finally {
      isRefreshing = false
    }
  }
)

async function proactiveRefresh(): Promise<string | null> {
  if (isRefreshing) {
    // Đợi refresh đang chạy
    return new Promise((resolve) => {
      pendingQueue.push({
        resolve,
        reject: () => resolve(null),
      })
    })
  }

  isRefreshing = true

  try {
    const refreshToken = tokenStorage.getRefresh()
    if (!refreshToken) return null

    const { data } = await refreshApi.post('/api/auth/refresh', {
      refreshToken,
    })

    tokenStorage.set(data.accessToken, data.refreshToken)
    useAuthStore
      .getState()
      .setAuthFromResult(data.user, data.accessToken, data.refreshToken)

    processPendingQueue(null, data.accessToken)
    return data.accessToken
  } catch {
    processPendingQueue(new Error('Refresh failed'), null)
    useAuthStore.getState().logout()
    return null
  } finally {
    isRefreshing = false
  }
}

export default api
