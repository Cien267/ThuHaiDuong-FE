import { useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
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
        <div className="space-y-1">
          <Label>Từ ngày</Label>
          <Input
            type="date"
            className="w-40"
            value={query.from}
            onChange={(e) =>
              setQuery((prev) => ({ ...prev, from: e.target.value }))
            }
          />
        </div>
        <div className="space-y-1">
          <Label>Đến ngày</Label>
          <Input
            type="date"
            className="w-40"
            value={query.to}
            onChange={(e) =>
              setQuery((prev) => ({ ...prev, to: e.target.value }))
            }
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
        <div className="space-y-1">
          <Label>Từ ngày</Label>
          <Input
            type="date"
            className="w-40"
            value={query.from ?? ''}
            onChange={(e) =>
              setQuery((prev) => ({
                ...prev,
                from: e.target.value || undefined,
              }))
            }
          />
        </div>
        <div className="space-y-1">
          <Label>Đến ngày</Label>
          <Input
            type="date"
            className="w-40"
            value={query.to ?? ''}
            onChange={(e) =>
              setQuery((prev) => ({ ...prev, to: e.target.value || undefined }))
            }
          />
        </div>
      </div>

      {/* Table */}
      <div className="rounded-md border bg-card">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-muted/50">
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                  #
                </th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                  Link
                </th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                  Vị trí
                </th>
                <th className="px-4 py-3 text-center font-medium text-muted-foreground">
                  Tổng clicks
                </th>
                <th className="px-4 py-3 text-center font-medium text-muted-foreground">
                  IP duy nhất
                </th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                  Click cuối
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
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
                  <tr key={stat.affiliateLinkId} className="hover:bg-muted/20">
                    <td className="px-4 py-3 text-muted-foreground">
                      {index + 1}
                    </td>
                    <td className="px-4 py-3">
                      <p className="font-medium">{stat.linkName}</p>
                      <p className="text-xs text-muted-foreground font-mono">
                        {stat.trackingCode}
                      </p>
                    </td>
                    <td className="px-4 py-3">
                      <PlacementBadge placement={stat.placement} />
                    </td>
                    <td className="px-4 py-3 text-center font-medium">
                      {stat.totalClicks.toLocaleString('vi-VN')}
                    </td>
                    <td className="px-4 py-3 text-center text-muted-foreground">
                      {stat.uniqueIps.toLocaleString('vi-VN')}
                    </td>
                    <td className="px-4 py-3 text-xs text-muted-foreground">
                      {formatDateTime(stat.lastClickedAt)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
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
        <div className="space-y-1">
          <Label>Từ ngày</Label>
          <Input
            type="date"
            className="w-40"
            value={query.fromDate ?? ''}
            onChange={(e) =>
              setQuery((prev) => ({
                ...prev,
                fromDate: e.target.value || undefined,
                pageNumber: 1,
              }))
            }
          />
        </div>
        <div className="space-y-1">
          <Label>Đến ngày</Label>
          <Input
            type="date"
            className="w-40"
            value={query.toDate ?? ''}
            onChange={(e) =>
              setQuery((prev) => ({
                ...prev,
                toDate: e.target.value || undefined,
                pageNumber: 1,
              }))
            }
          />
        </div>
      </div>

      {/* Table */}
      <div className="rounded-md border bg-card">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-muted/50">
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                  Link
                </th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                  Người dùng
                </th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                  Chapter
                </th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                  IP
                </th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                  Referrer
                </th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                  Thời gian
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
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
                  <tr key={click.id} className="hover:bg-muted/20">
                    <td className="px-4 py-3">
                      <p className="font-medium">{click.linkName}</p>
                      <p className="text-xs text-muted-foreground font-mono">
                        {click.trackingCode}
                      </p>
                    </td>
                    <td className="px-4 py-3">
                      {click.userName ? (
                        <span>{click.userName}</span>
                      ) : (
                        <Badge variant="outline" className="text-xs">
                          Khách
                        </Badge>
                      )}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground max-w-[200px]">
                      {click.chapterTitle ? (
                        <div>
                          <p className="text-xs truncate">
                            {click.chapterTitle}
                          </p>
                          {click.storyTitle && (
                            <p className="text-xs text-muted-foreground/70 truncate">
                              {click.storyTitle}
                            </p>
                          )}
                        </div>
                      ) : (
                        '—'
                      )}
                    </td>
                    <td className="px-4 py-3 font-mono text-xs text-muted-foreground">
                      {click.ipAddress ?? '—'}
                    </td>
                    <td className="px-4 py-3 text-xs text-muted-foreground max-w-[150px] truncate">
                      {click.referrer ?? '—'}
                    </td>
                    <td className="px-4 py-3 text-xs text-muted-foreground whitespace-nowrap">
                      {formatDateTime(click.clickedAt)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
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
    <div className="p-6 space-y-5">
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
