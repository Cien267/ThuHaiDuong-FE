import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { PROFILE_QUERY_KEYS } from '../constants/profile.constants'
import { profileService } from '../services/profileService'
import type {
  UpdateProfileInput,
  UpdateUsernameInput,
} from '../types/profile.types'

export const useMyProfile = () =>
  useQuery({
    queryKey: PROFILE_QUERY_KEYS.me(),
    queryFn: profileService.getMyProfile,
  })

export const useUpdateProfile = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (input: UpdateProfileInput) =>
      profileService.updateProfile(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PROFILE_QUERY_KEYS.me() })
      toast.success('Đã cập nhật thông tin')
    },
    onError: () => toast.error('Có lỗi xảy ra, vui lòng thử lại'),
  })
}

export const useUpdateUsername = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (input: UpdateUsernameInput) =>
      profileService.updateUsername(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PROFILE_QUERY_KEYS.me() })
      toast.success('Đã cập nhật tên đăng nhập')
    },
    onError: () => toast.error('Có lỗi xảy ra, vui lòng thử lại'),
  })
}

export const useUploadAvatar = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (file: File) => profileService.uploadAvatar(file),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PROFILE_QUERY_KEYS.me() })
      toast.success('Đã cập nhật ảnh đại diện')
    },
    onError: () => toast.error('Upload thất bại, vui lòng thử lại'),
  })
}

export const useRemoveAvatar = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: profileService.removeAvatar,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PROFILE_QUERY_KEYS.me() })
      toast.success('Đã xóa ảnh đại diện')
    },
    onError: () => toast.error('Có lỗi xảy ra, vui lòng thử lại'),
  })
}
