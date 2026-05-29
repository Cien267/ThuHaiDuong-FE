import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import type { DailyStoryViewResult } from '../types/analytics.types'

interface StoryDailyViewChartProps {
  data: DailyStoryViewResult[]
}

function formatDateTick(dateStr: string) {
  const d = new Date(dateStr)
  return `${d.getDate()}/${d.getMonth() + 1}`
}

export function StoryDailyViewChart({ data }: StoryDailyViewChartProps) {
  if (data.length === 0) {
    return (
      <div className="h-52 flex items-center justify-center text-muted-foreground text-sm">
        Chưa có dữ liệu view trong 30 ngày qua
      </div>
    )
  }

  return (
    <ResponsiveContainer width="100%" height={220}>
      <BarChart data={data} margin={{ top: 4, right: 8, left: -16, bottom: 0 }}>
        <CartesianGrid
          strokeDasharray="3 3"
          stroke="hsl(var(--border))"
          vertical={false}
        />
        <XAxis
          dataKey="date"
          tickFormatter={formatDateTick}
          tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }}
          tickLine={false}
          axisLine={false}
          interval="preserveStartEnd"
        />
        <YAxis
          tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }}
          tickLine={false}
          axisLine={false}
        />
        <Tooltip
          labelFormatter={(v) => new Date(v).toLocaleDateString('vi-VN')}
          formatter={(value: number, name: string) => [
            value.toLocaleString('vi-VN'),
            name === 'viewCount' ? 'Lượt xem' : 'Khách truy cập',
          ]}
          contentStyle={{
            backgroundColor: 'hsl(var(--card))',
            border: '1px solid hsl(var(--border))',
            borderRadius: '6px',
            fontSize: '12px',
          }}
        />
        <Bar
          dataKey="viewCount"
          fill="#6366f1"
          radius={[3, 3, 0, 0]}
          maxBarSize={20}
        />
        <Bar
          dataKey="uniqueVisitors"
          fill="#22c55e"
          radius={[3, 3, 0, 0]}
          maxBarSize={20}
        />
      </BarChart>
    </ResponsiveContainer>
  )
}
