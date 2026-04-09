import api from '@/services/api'
import { API_ENDPOINTS } from '@/services/endpoints'
import type { ApiResponse } from '@/types/api.types'
import type {
  LoginInput,
  LoginResponse,
  UpdateProfileInput,
  ChangePasswordInput,
} from '../types/auth.types'
import type { User } from '@/features/auth/types/auth.types'

export const authService = {
  async login(credentials: LoginInput): Promise<LoginResponse> {
    const response = await api.post<ApiResponse<LoginResponse>>(
      API_ENDPOINTS.AUTH.LOGIN,
      credentials
    )
    return response.data
  },

  async logout(): Promise<void> {
    await api.post(API_ENDPOINTS.AUTH.LOGOUT)
  },

  async getCurrentUser(): Promise<User> {
    const response = await api.get<ApiResponse<User>>(API_ENDPOINTS.AUTH.ME)
    return response.data
  },

  async forgotPassword(email: string): Promise<void> {
    await api.post(API_ENDPOINTS.AUTH.FORGOT_PASSWORD, { email })
  },

  async resetPassword(token: string, password: string): Promise<void> {
    await api.post(API_ENDPOINTS.AUTH.RESET_PASSWORD, { token, password })
  },

  async verifyEmail(token: string): Promise<void> {
    await api.post(API_ENDPOINTS.AUTH.VERIFY_EMAIL, { token })
  },

  async updateProfile(data: UpdateProfileInput): Promise<User> {
    const response = await api.put<ApiResponse<User>>(
      `${API_ENDPOINTS.AUTH.UPDATE_PROFILE}/${data.id}`,
      data
    )
    return response.data
  },

  async changePassword(data: ChangePasswordInput): Promise<void> {
    await api.put(`${API_ENDPOINTS.AUTH.CHANGE_PASSWORD}/${data.id}`, {
      currentPassword: data.currentPassword,
      newPassword: data.newPassword,
      confirmPassword: data.confirmPassword,
    })
  },
}
