import { useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import {
  useAffiliateDailyStats,
  useAffiliateLinkStats,
  useAffiliateClicks,
} from '../hooks/useAffiliate'
import { PlacementBadge } from '../components/AffiliateLinkStatusBadge'
import type {
  AffiliateClickReportQuery,
  AffiliateDailyStatQuery,
  AffiliateLinkStatQuery,
} from '../types/affiliate.types'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { DatePicker } from '@/components/common/DatePicker'

// ── Helpers ───────────────────────────────────────────────────────────────────

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('vi-VN')
}

function formatDateTime(dateStr: string | null) {
  if (!dateStr) return '—'
  return new Date(dateStr).toLocaleString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

function defaultDateRange() {
  const to = new Date()
  const from = new Date()
  from.setDate(from.getDate() - 29)
  return {
    from: from.toISOString().slice(0, 10),
    to: to.toISOString().slice(0, 10),
  }
}

// ── Tab: Daily stats ──────────────────────────────────────────────────────────

function DailyStatsTab() {
  const [query, setQuery] = useState<AffiliateDailyStatQuery>(defaultDateRange)

  const { data = [], isLoading } = useAffiliateDailyStats(query)

  const totalClicks = data.reduce((s, d) => s + d.totalClicks, 0)
  const totalUnique = data.reduce((s, d) => s + d.uniqueIps, 0)
  const maxClicks = Math.max(...data.map((d) => d.totalClicks), 1)

  return (
    <div className="space-y-4">
      {/* Date range filter */}
      <div className="flex flex-wrap items-end gap-3">
        <div className="space-y-1 w-50">
          <Label>Từ ngày</Label>
          <DatePicker
            value={query.from ? new Date(query.from) : undefined}
            onChange={(value) =>
              setQuery((prev) => ({
                ...prev,
                from: (value ?? new Date()).toISOString().slice(0, 10),
              }))
            }
            placeholder="Pick a date"
          />
        </div>
        <div className="space-y-1 w-50">
          <Label>Đến ngày</Label>
          <DatePicker
            value={query.to ? new Date(query.to) : undefined}
            onChange={(value) =>
              setQuery((prev) => ({
                ...prev,
                to: (value ?? new Date()).toISOString().slice(0, 10),
              }))
            }
            placeholder="Pick a date"
          />
        </div>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 gap-4">
        <div className="rounded-lg border bg-card p-4 text-center">
          <p className="text-2xl font-bold">
            {totalClicks.toLocaleString('vi-VN')}
          </p>
          <p className="text-sm text-muted-foreground mt-1">Tổng clicks</p>
        </div>
        <div className="rounded-lg border bg-card p-4 text-center">
          <p className="text-2xl font-bold">
            {totalUnique.toLocaleString('vi-VN')}
          </p>
          <p className="text-sm text-muted-foreground mt-1">IP duy nhất</p>
        </div>
      </div>

      {/* Bar chart */}
      <div className="rounded-lg border bg-card p-5">
        {isLoading ? (
          <div className="text-center text-muted-foreground py-8">
            Đang tải...
          </div>
        ) : data.length === 0 ? (
          <div className="text-center text-muted-foreground py-8">
            Không có dữ liệu
          </div>
        ) : (
          <div className="space-y-2">
            {data.map((day) => (
              <div key={day.date} className="flex items-center gap-3 text-sm">
                <span className="w-24 text-right text-muted-foreground shrink-0 text-xs">
                  {formatDate(day.date)}
                </span>
                <div className="flex-1 h-6 bg-muted rounded overflow-hidden">
                  <div
                    className="h-full bg-primary/70 rounded transition-all duration-500 flex items-center px-2"
                    style={{
                      width: `${(day.totalClicks / maxClicks) * 100}%`,
                      minWidth: day.totalClicks > 0 ? '2rem' : 0,
                    }}
                  >
                    {day.totalClicks > 0 && (
                      <span className="text-xs text-primary-foreground font-medium">
                        {day.totalClicks}
                      </span>
                    )}
                  </div>
                </div>
                <span className="w-16 text-xs text-muted-foreground shrink-0">
                  {day.uniqueIps} IP
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

// ── Tab: Link stats ───────────────────────────────────────────────────────────

function LinkStatsTab() {
  const [query, setQuery] = useState<AffiliateLinkStatQuery>({})

  const { data = [], isLoading } = useAffiliateLinkStats(query)

  return (
    <div className="space-y-4">
      {/* Date range filter */}
      <div className="flex flex-wrap items-end gap-3">
        <div className="space-y-1 w-50">
          <Label>Từ ngày</Label>
          <DatePicker
            value={query.from ? new Date(query.from) : undefined}
            onChange={(value) =>
              setQuery((prev) => ({
                ...prev,
                from: value ? value.toISOString().slice(0, 10) : undefined,
                pageNumber: 1,
              }))
            }
            placeholder="Pick a date"
          />
        </div>
        <div className="space-y-1 w-50">
          <Label>Đến ngày</Label>
          <DatePicker
            value={query.to ? new Date(query.to) : undefined}
            onChange={(value) =>
              setQuery((prev) => ({
                ...prev,
                to: value ? value.toISOString().slice(0, 10) : undefined,
                pageNumber: 1,
              }))
            }
            placeholder="Pick a date"
          />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <Table className="w-full text-sm">
          <TableHeader>
            <TableRow>
              <TableHead className="px-4 py-3 text-left font-medium text-muted-foreground">
                #
              </TableHead>
              <TableHead className="px-4 py-3 text-left font-medium text-muted-foreground">
                Link
              </TableHead>
              <TableHead className="px-4 py-3 text-left font-medium text-muted-foreground">
                Vị trí
              </TableHead>
              <TableHead className="px-4 py-3 text-center font-medium text-muted-foreground">
                Tổng clicks
              </TableHead>
              <TableHead className="px-4 py-3 text-center font-medium text-muted-foreground">
                IP duy nhất
              </TableHead>
              <TableHead className="px-4 py-3 text-left font-medium text-muted-foreground">
                Click cuối
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="divide-y divide-border">
            {isLoading ? (
              <tr>
                <td
                  colSpan={6}
                  className="px-4 py-10 text-center text-muted-foreground"
                >
                  Đang tải...
                </td>
              </tr>
            ) : data.length === 0 ? (
              <tr>
                <td
                  colSpan={6}
                  className="px-4 py-10 text-center text-muted-foreground"
                >
                  Không có dữ liệu
                </td>
              </tr>
            ) : (
              data.map((stat, index) => (
                <TableRow
                  key={stat.affiliateLinkId}
                  className="hover:bg-muted/20"
                >
                  <TableHead className="px-4 py-3 text-muted-foreground">
                    {index + 1}
                  </TableHead>
                  <TableHead className="px-4 py-3">
                    <p className="font-medium">{stat.linkName}</p>
                    <p className="text-xs text-muted-foreground font-mono">
                      {stat.trackingCode}
                    </p>
                  </TableHead>
                  <TableHead className="px-4 py-3">
                    <PlacementBadge placement={stat.placement} />
                  </TableHead>
                  <TableHead className="px-4 py-3 text-center font-medium">
                    {stat.totalClicks.toLocaleString('vi-VN')}
                  </TableHead>
                  <TableHead className="px-4 py-3 text-center text-muted-foreground">
                    {stat.uniqueIps.toLocaleString('vi-VN')}
                  </TableHead>
                  <TableHead className="px-4 py-3 text-xs text-muted-foreground">
                    {formatDateTime(stat.lastClickedAt)}
                  </TableHead>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

// ── Tab: Raw clicks ───────────────────────────────────────────────────────────

function RawClicksTab() {
  const [query, setQuery] = useState<AffiliateClickReportQuery>({
    pageNumber: 1,
  })

  const { data, isLoading } = useAffiliateClicks(query)

  const totalPages = data?.totalPages ?? 1

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-wrap items-end gap-3">
        <div className="space-y-1 w-50">
          <Label>Từ ngày</Label>
          <DatePicker
            value={query.fromDate ? new Date(query.fromDate) : undefined}
            onChange={(value) =>
              setQuery((prev) => ({
                ...prev,
                fromDate: value ? value.toISOString().slice(0, 10) : undefined,
                pageNumber: 1,
              }))
            }
            placeholder="Pick a date"
          />
        </div>
        <div className="space-y-1 w-50">
          <Label>Đến ngày</Label>
          <DatePicker
            value={query.toDate ? new Date(query.toDate) : undefined}
            onChange={(value) =>
              setQuery((prev) => ({
                ...prev,
                toDate: value ? value.toISOString().slice(0, 10) : undefined,
                pageNumber: 1,
              }))
            }
            placeholder="Pick a date"
          />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <Table className="w-full text-sm">
          <TableHeader>
            <TableRow>
              <TableHead className="px-4 py-3 text-left font-medium text-muted-foreground">
                Link
              </TableHead>
              <TableHead className="px-4 py-3 text-left font-medium text-muted-foreground">
                Người dùng
              </TableHead>
              <TableHead className="px-4 py-3 text-left font-medium text-muted-foreground">
                Chapter
              </TableHead>
              <TableHead className="px-4 py-3 text-left font-medium text-muted-foreground">
                IP
              </TableHead>
              <TableHead className="px-4 py-3 text-left font-medium text-muted-foreground">
                Referrer
              </TableHead>
              <TableHead className="px-4 py-3 text-left font-medium text-muted-foreground">
                Thời gian
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="divide-y divide-border">
            {isLoading ? (
              <tr>
                <td
                  colSpan={6}
                  className="px-4 py-10 text-center text-muted-foreground"
                >
                  Đang tải...
                </td>
              </tr>
            ) : data?.data.length === 0 ? (
              <tr>
                <td
                  colSpan={6}
                  className="px-4 py-10 text-center text-muted-foreground"
                >
                  Không có dữ liệu
                </td>
              </tr>
            ) : (
              data?.data.map((click) => (
                <TableRow key={click.id} className="hover:bg-muted/20">
                  <TableCell className="px-4 py-3">
                    <p className="font-medium">{click.linkName}</p>
                    <p className="text-xs text-muted-foreground font-mono">
                      {click.trackingCode}
                    </p>
                  </TableCell>
                  <TableCell className="px-4 py-3">
                    {click.userName ? (
                      <span>{click.userName}</span>
                    ) : (
                      <Badge variant="outline" className="text-xs">
                        Khách
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-muted-foreground max-w-[200px]">
                    {click.chapterTitle ? (
                      <div>
                        <p className="text-xs truncate">{click.chapterTitle}</p>
                        {click.storyTitle && (
                          <p className="text-xs text-muted-foreground/70 truncate">
                            {click.storyTitle}
                          </p>
                        )}
                      </div>
                    ) : (
                      '—'
                    )}
                  </TableCell>
                  <TableCell className="px-4 py-3 font-mono text-xs text-muted-foreground">
                    {click.ipAddress ?? '—'}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-xs text-muted-foreground max-w-[150px] truncate">
                    {click.referrer ?? '—'}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-xs text-muted-foreground whitespace-nowrap">
                    {formatDateTime(click.clickedAt)}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {data && totalPages > 1 && (
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>
            Trang {data.pageNumber} / {totalPages}
          </span>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={(query.pageNumber ?? 1) <= 1}
              onClick={() =>
                setQuery((prev) => ({
                  ...prev,
                  pageNumber: (prev.pageNumber ?? 1) - 1,
                }))
              }
            >
              Trước
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={(query.pageNumber ?? 1) >= totalPages}
              onClick={() =>
                setQuery((prev) => ({
                  ...prev,
                  pageNumber: (prev.pageNumber ?? 1) + 1,
                }))
              }
            >
              Sau
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}

// ── Main page ─────────────────────────────────────────────────────────────────

export default function AffiliateReportsPage() {
  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">
          Báo cáo Affiliate
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Thống kê click theo ngày, xếp hạng link và log chi tiết
        </p>
      </div>

      <Tabs defaultValue="daily">
        <TabsList>
          <TabsTrigger value="daily">Theo ngày</TabsTrigger>
          <TabsTrigger value="links">Xếp hạng link</TabsTrigger>
          <TabsTrigger value="clicks">Log clicks</TabsTrigger>
        </TabsList>

        <TabsContent value="daily" className="mt-5">
          <DailyStatsTab />
        </TabsContent>
        <TabsContent value="links" className="mt-5">
          <LinkStatsTab />
        </TabsContent>
        <TabsContent value="clicks" className="mt-5">
          <RawClicksTab />
        </TabsContent>
      </Tabs>
    </div>
  )
}
