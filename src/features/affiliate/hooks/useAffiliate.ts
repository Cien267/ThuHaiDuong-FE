import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import {
  AFFILIATE_CLICKS_PAGE_SIZE,
  AFFILIATE_PAGE_SIZE,
  AFFILIATE_QUERY_KEYS,
} from '../constants/affiliate.constants'
import { affiliateService } from '../services/affiliateService'
import type {
  AffiliateClickReportQuery,
  AffiliateDailyStatQuery,
  AffiliateLinkQuery,
  AffiliateLinkStatQuery,
  CreateAffiliateLinkInput,
  UpdateAffiliateLinkInput,
} from '../types/affiliate.types'

// ── CRUD hooks ────────────────────────────────────────────────────────────────

export const useAffiliateLinkList = (query: AffiliateLinkQuery) =>
  useQuery({
    queryKey: AFFILIATE_QUERY_KEYS.linkList(query as Record<string, unknown>),
    queryFn: () =>
      affiliateService.getList({
        ...query,
        pageSize: query.pageSize ?? AFFILIATE_PAGE_SIZE,
      }),
  })

export const useAffiliateLinkDetail = (id: string) =>
  useQuery({
    queryKey: AFFILIATE_QUERY_KEYS.linkDetail(id),
    queryFn: () => affiliateService.getById(id),
    enabled: !!id,
  })

export const useCreateAffiliateLink = () => {
  const queryClient = useQueryClient()
  const navigate = useNavigate()
  return useMutation({
    mutationFn: (input: CreateAffiliateLinkInput) =>
      affiliateService.create(input),
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: AFFILIATE_QUERY_KEYS.links() })
      toast.success('Đã tạo affiliate link')
      navigate(`/affiliate/links/${result.id}`)
    },
    onError: () => toast.error('Có lỗi xảy ra, vui lòng thử lại'),
  })
}

export const useUpdateAffiliateLink = (id: string) => {
  const queryClient = useQueryClient()
  const navigate = useNavigate()
  return useMutation({
    mutationFn: (input: UpdateAffiliateLinkInput) =>
      affiliateService.update(id, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: AFFILIATE_QUERY_KEYS.links() })
      queryClient.invalidateQueries({
        queryKey: AFFILIATE_QUERY_KEYS.linkDetail(id),
      })
      toast.success('Đã cập nhật affiliate link')
      navigate(`/affiliate/links/${id}`)
    },
    onError: () => toast.error('Có lỗi xảy ra, vui lòng thử lại'),
  })
}

export const useDeleteAffiliateLink = () => {
  const queryClient = useQueryClient()
  const navigate = useNavigate()
  return useMutation({
    mutationFn: affiliateService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: AFFILIATE_QUERY_KEYS.links() })
      toast.success('Đã xóa affiliate link')
      navigate('/affiliate/links')
    },
    onError: () => toast.error('Có lỗi xảy ra, vui lòng thử lại'),
  })
}

export const useUploadAffiliateImage = () =>
  useMutation({
    mutationFn: (file: File) => affiliateService.uploadAffiliateImage(file),
    onError: () => toast.error('Upload ảnh thất bại, vui lòng thử lại'),
  })

// ── Report hooks ──────────────────────────────────────────────────────────────

export const useAffiliateDailyStats = (query: AffiliateDailyStatQuery) =>
  useQuery({
    queryKey: AFFILIATE_QUERY_KEYS.dailyStats(
      query as unknown as Record<string, unknown>
    ),
    queryFn: () => affiliateService.getDailyStats(query),
    enabled: !!query.from && !!query.to,
  })

export const useAffiliateLinkStats = (query: AffiliateLinkStatQuery) =>
  useQuery({
    queryKey: AFFILIATE_QUERY_KEYS.linkStats(query as Record<string, unknown>),
    queryFn: () => affiliateService.getLinkStats(query),
  })

export const useAffiliateClicks = (query: AffiliateClickReportQuery) =>
  useQuery({
    queryKey: AFFILIATE_QUERY_KEYS.clicks(query as Record<string, unknown>),
    queryFn: () =>
      affiliateService.getClicks({
        ...query,
        pageSize: query.pageSize ?? AFFILIATE_CLICKS_PAGE_SIZE,
      }),
  })
