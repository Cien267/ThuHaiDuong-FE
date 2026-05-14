import { z } from 'zod'
import type { StoryFormValues } from '../types/story.types'
import { STORY_TYPE, CONTENT_SOURCE } from '../types/story.types'

// ── Query Keys ─────────────────────────────────────────────────────────────────

export const storyKeys = {
  all: ['stories'] as const,
  lists: () => [...storyKeys.all, 'list'] as const,
  list: (q: object) => [...storyKeys.lists(), q] as const,
  detail: (id: string) => [...storyKeys.all, id] as const,
  pending: () => [...storyKeys.all, 'pending'] as const,
}

// ── Zod Schema ─────────────────────────────────────────────────────────────────

export const storySchema = z
  .object({
    title: z
      .string()
      .min(1, 'Title is required')
      .max(300, 'Title must be at most 300 characters'),

    slug: z.string().max(350).optional().or(z.literal('')),
    authorId: z.string().min(1, 'Author is required'),
    sourceUrl: z.string().max(1000).optional().or(z.literal('')),
    description: z.string().optional().or(z.literal('')),
    coverImageUrl: z.string().max(500).optional().or(z.literal('')),
    storyType: z.enum(['Serial', 'Completed']),
    releaseSchedule: z
      .enum(['Daily', 'Weekly', 'BiWeekly', 'Monthly'])
      .optional(),
    nextChapterAt: z.string().optional().or(z.literal('')),
    contentSource: z.enum(['Manual', 'Crawled', 'UGC']),
    categoryIds: z.array(z.string()),
    tagIds: z.array(z.string()),
  })
  .superRefine((data, ctx) => {
    // ReleaseSchedule chỉ required khi StoryType = Serial
    if (data.storyType === 'Serial' && !data.releaseSchedule) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Release schedule is required for Serial stories',
        path: ['releaseSchedule'],
      })
    }
  })

export const reviewSchema = z
  .object({
    isApproved: z.boolean(),
    rejectionReason: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    if (!data.isApproved && !data.rejectionReason?.trim()) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Rejection reason is required',
        path: ['rejectionReason'],
      })
    }
  })

// ── Form defaults ──────────────────────────────────────────────────────────────

export const storyDefaults: StoryFormValues = {
  title: '',
  slug: '',
  authorId: '',
  sourceUrl: '',
  description: '',
  coverImageUrl: '',
  storyType: STORY_TYPE.Completed,
  releaseSchedule: undefined,
  nextChapterAt: '',
  contentSource: CONTENT_SOURCE.Manual,
  categoryIds: [],
  tagIds: [],
}

// ── Table / page config ────────────────────────────────────────────────────────

export const STORY_PAGE_SIZE = 20

// Các status Admin có thể chuyển sau khi Approved
export const PUBLISHABLE_STATUSES = [
  'Publishing',
  'Completed',
  'Paused',
] as const
