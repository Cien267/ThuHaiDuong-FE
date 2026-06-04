import api from '@/services/api'
import type {
  AvatarUploadResult,
  StaffProfileResult,
  UpdateProfileInput,
  UpdateUsernameInput,
} from '../types/profile.types'

export const profileService = {
  getMyProfile: async (): Promise<StaffProfileResult> => {
    const { data } = await api.get('admin/profile')
    return data
  },

  updateProfile: async (
    input: UpdateProfileInput
  ): Promise<StaffProfileResult> => {
    const { data } = await api.put('admin/profile', input)
    return data
  },

  updateUsername: async (
    input: UpdateUsernameInput
  ): Promise<StaffProfileResult> => {
    const { data } = await api.patch('admin/profile/username', input)
    return data
  },

  uploadAvatar: async (file: File): Promise<AvatarUploadResult> => {
    const formData = new FormData()
    formData.append('file', file)
    const { data } = await api.post('admin/profile/avatar', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    return data
  },

  removeAvatar: async (): Promise<void> => {
    await api.delete('/admin/profile/avatar')
  },
}
