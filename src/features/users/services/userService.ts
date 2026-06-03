import api from '@/services/api'
import type { CreateStaffInput, UserAuthInfo } from '../types/user.types'

export const userService = {
  getStaffList: async (): Promise<UserAuthInfo[]> => {
    const { data } = await api.get('/admin/auth/staff')
    return data
  },

  createStaff: async (input: CreateStaffInput): Promise<UserAuthInfo> => {
    const { data } = await api.post('/admin/auth/staff', input)
    return data
  },

  toggleActive: async (id: string): Promise<void> => {
    await api.patch(`/admin/auth/staff/${id}/toggle-active`)
  },
}
