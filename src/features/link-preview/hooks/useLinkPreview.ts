import { useQuery } from '@tanstack/react-query'
import { commentService } from '../services/linkPreviewService'

export const useLinkPreview = (url: string, enabled: boolean) =>
  useQuery({
    queryKey: ['link-preview', url],
    queryFn: () => commentService.getLinkPreview(url),
    enabled: enabled && url.startsWith('http'),
    staleTime: 1000 * 60 * 10, // cache 10 phút — preview không thay đổi thường xuyên
    retry: false, // không retry nếu site block
  })
