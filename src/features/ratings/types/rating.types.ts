export interface RatingResult {
  id: string
  storyId: string
  userId: string
  userName: string
  score: number
  comment: string | null
  createdAt: string
}

export interface RatingSummary {
  averageScore: number
  totalRatings: number
  scoreDistribution: Record<string, number> // key "1"–"5"
  myRating: RatingResult | null
}

export interface RatingQuery {
  storyId: string
  page?: number
  pageSize?: number
}
