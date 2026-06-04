import { z } from 'zod'

export const PROFILE_QUERY_KEYS = {
  all: ['profile'] as const,
  me: () => [...PROFILE_QUERY_KEYS.all, 'me'] as const,
}

export const updateProfileSchema = z.object({
  fullName: z.string().max(200).optional().or(z.literal('')),
  phoneNumber: z
    .string()
    .max(20)
    .optional()
    .or(z.literal(''))
    .refine((val) => !val || /^[0-9+\-\s()]*$/.test(val), {
      message: 'Số điện thoại không hợp lệ',
    }),
})

export const updateUsernameSchema = z.object({
  userName: z
    .string()
    .min(1, 'Tên đăng nhập không được để trống')
    .max(100)
    .regex(/^\S+$/, 'Tên đăng nhập không được có khoảng trắng'),
})

export type UpdateProfileFormValues = z.infer<typeof updateProfileSchema>
export type UpdateUsernameFormValues = z.infer<typeof updateUsernameSchema>
