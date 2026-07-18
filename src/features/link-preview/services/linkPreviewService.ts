import api from '@/services/api'
import type { LinkPreviewResult } from '../types/linkPreview.types'

export const commentService = {
  getLinkPreview: async (url: string): Promise<LinkPreviewResult> => {
    const { data } = await api.post('/admin/utils/link-preview', { url })
    return data
  },
}
