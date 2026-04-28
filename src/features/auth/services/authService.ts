import api from '@/services/api'
import type {
  AuthResult,
  LoginInput,
  ChangePasswordInput,
  UpdateProfileInput,
  UpdateUsernameInput,
  UserProfile,
} from '../types/auth.types'

export const authService = {
  login: (data: LoginInput): Promise<AuthResult> =>
    api.post<AuthResult>('admin/auth/login', data).then((r) => r.data),

  logout: (): Promise<void> => api.post('auth/logout').then(() => undefined),

  getProfile: (): Promise<UserProfile> =>
    api.get<UserProfile>('profile').then((r) => r.data),

  updateProfile: (data: UpdateProfileInput): Promise<UserProfile> =>
    api.put<UserProfile>('profile', data).then((r) => r.data),

  updateUsername: (data: UpdateUsernameInput): Promise<UserProfile> =>
    api.patch<UserProfile>('profile/username', data).then((r) => r.data),

  changePassword: (data: ChangePasswordInput): Promise<void> =>
    api.put('auth/change-password', data).then(() => undefined),
}
