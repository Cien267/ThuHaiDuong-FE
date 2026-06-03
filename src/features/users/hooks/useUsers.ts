import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { USER_QUERY_KEYS } from '../constants/user.constants'
import { userService } from '../services/userService'
import type { CreateStaffInput } from '../types/user.types'

export const useStaffList = () =>
  useQuery({
    queryKey: USER_QUERY_KEYS.staffList(),
    queryFn: userService.getStaffList,
  })

export const useCreateStaff = (onSuccess?: () => void) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (input: CreateStaffInput) => userService.createStaff(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: USER_QUERY_KEYS.staffList() })
      toast.success('Đã tạo tài khoản thành công')
      onSuccess?.()
    },
    onError: () => toast.error('Có lỗi xảy ra, vui lòng thử lại'),
  })
}

export const useToggleActive = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: userService.toggleActive,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: USER_QUERY_KEYS.staffList() })
      toast.success('Đã cập nhật trạng thái tài khoản')
    },
    onError: () => toast.error('Có lỗi xảy ra, vui lòng thử lại'),
  })
}
