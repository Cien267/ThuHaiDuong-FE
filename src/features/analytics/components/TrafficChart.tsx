import { useState } from 'react'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import { Badge } from '@/components/ui/badge'
import type { DailyTrafficResult } from '../types/analytics.types'

interface TrafficChartProps {
  data: DailyTrafficResult[]
}

type MetricKey = keyof Omit<DailyTrafficResult, 'date'>

const METRICS: { key: MetricKey; label: string; color: string }[] = [
  { key: 'chapterViews', label: 'Lượt xem', color: '#6366f1' },
  { key: 'uniqueVisitors', label: 'Khách truy cập', color: '#22c55e' },
  { key: 'newUsers', label: 'Người dùng mới', color: '#f59e0b' },
  { key: 'newComments', label: 'Bình luận mới', color: '#ec4899' },
  { key: 'newRatings', label: 'Đánh giá mới', color: '#14b8a6' },
]

function formatDateTick(dateStr: string) {
  const d = new Date(dateStr)
  return `${d.getDate()}/${d.getMonth() + 1}`
}

export function TrafficChart({ data }: TrafficChartProps) {
  const [activeMetrics, setActiveMetrics] = useState<Set<MetricKey>>(
    new Set(['chapterViews', 'uniqueVisitors'])
  )

  const toggleMetric = (key: MetricKey) => {
    setActiveMetrics((prev) => {
      const next = new Set(prev)
      if (next.has(key)) {
        if (next.size === 1) return prev // ít nhất 1 metric
        next.delete(key)
      } else {
        next.add(key)
      }
      return next
    })
  }

  return (
    <div className="rounded-lg border bg-card p-5 space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <h2 className="font-medium">Traffic theo ngày</h2>
        <div className="flex flex-wrap gap-1.5">
          {METRICS.map((m) => (
            <button
              key={m.key}
              type="button"
              onClick={() => toggleMetric(m.key)}
            >
              <Badge
                variant={activeMetrics.has(m.key) ? 'default' : 'outline'}
                className="cursor-pointer text-xs transition-colors"
                style={
                  activeMetrics.has(m.key)
                    ? { backgroundColor: m.color, borderColor: m.color }
                    : {}
                }
              >
                {m.label}
              </Badge>
            </button>
          ))}
        </div>
      </div>

      {data.length === 0 ? (
        <div className="h-64 flex items-center justify-center text-muted-foreground text-sm">
          Không có dữ liệu
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={280}>
          <LineChart
            data={data}
            margin={{ top: 4, right: 8, left: -16, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis
              dataKey="date"
              tickFormatter={formatDateTick}
              tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip
              labelFormatter={(v) => new Date(v).toLocaleDateString('vi-VN')}
              contentStyle={{
                backgroundColor: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '6px',
                fontSize: '12px',
              }}
            />
            {METRICS.filter((m) => activeMetrics.has(m.key)).map((m) => (
              <Line
                key={m.key}
                type="monotone"
                dataKey={m.key}
                name={m.label}
                stroke={m.color}
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 4 }}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      )}
    </div>
  )
}
