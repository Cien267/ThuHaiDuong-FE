import { Badge } from '@/components/ui/badge'
import {
  PLACEMENT_LABELS,
  type AffiliatePlacement,
} from '../types/affiliate.types'

interface PlacementBadgeProps {
  placement: AffiliatePlacement
}

const PLACEMENT_VARIANTS: Record<
  AffiliatePlacement,
  'default' | 'secondary' | 'outline' | 'destructive'
> = {
  'in-chapter': 'default',
  sidebar: 'secondary',
  popup: 'outline',
  global: 'destructive',
}

export function PlacementBadge({ placement }: PlacementBadgeProps) {
  return (
    <Badge variant={PLACEMENT_VARIANTS[placement] ?? 'outline'}>
      {PLACEMENT_LABELS[placement] ?? placement}
    </Badge>
  )
}

interface StatusBadgeProps {
  isActive: boolean
}

export function AffiliateLinkStatusBadge({ isActive }: StatusBadgeProps) {
  return isActive ? (
    <Badge className="bg-green-600 hover:bg-green-600">Đang hoạt động</Badge>
  ) : (
    <Badge variant="secondary">Tạm dừng</Badge>
  )
}
