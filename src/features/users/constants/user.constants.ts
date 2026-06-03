import { z } from 'zod'
import { STAFF_ROLES } from '../types/user.types'

export const USER_QUERY_KEYS = {
  all: ['users'] as const,
  staffList: () => [...USER_QUERY_KEYS.all, 'staff'] as const,
}

export const createStaffSchema = z.object({
  userName: z
    .string()
    .min(1, 'Tên đăng nhập không được để trống')
    .max(100)
    .regex(/^\S+$/, 'Tên đăng nhập không được có khoảng trắng'),
  email: z
    .string()
    .min(1, 'Email không được để trống')
    .email('Email không hợp lệ')
    .max(256),
  password: z.string().min(6, 'Mật khẩu tối thiểu 6 ký tự').max(256),
  fullName: z.string().max(200).optional().or(z.literal('')),
  role: z.enum(STAFF_ROLES, {
    message: 'Vui lòng chọn vai trò',
  }),
})

export type CreateStaffFormValues = z.infer<typeof createStaffSchema>

export const CREATE_STAFF_DEFAULTS: CreateStaffFormValues = {
  userName: '',
  email: '',
  password: '',
  fullName: '',
  role: 'Contributor',
}
