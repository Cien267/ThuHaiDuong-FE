import { useState } from 'react'
import { Plus, PowerOff, Power } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { useStaffList, useToggleActive } from '../hooks/useUsers'
import { CreateStaffDialog } from '../components/CreateStaffDialog'
import { ROLE_LABELS, ROLE_VARIANTS } from '../types/user.types'
import type { UserAuthInfo } from '../types/user.types'

// ── Role badge ────────────────────────────────────────────────────────────────

function RoleBadge({ role }: { role: string }) {
  return (
    <Badge variant={ROLE_VARIANTS[role] ?? 'outline'}>
      {ROLE_LABELS[role] ?? role}
    </Badge>
  )
}

// ── Avatar fallback ───────────────────────────────────────────────────────────

function UserAvatar({ user }: { user: UserAuthInfo }) {
  if (user.avatar) {
    return (
      <img
        src={user.avatar}
        alt={user.userName}
        className="h-9 w-9 rounded-full object-cover"
      />
    )
  }
  return (
    <div className="h-9 w-9 rounded-full bg-muted flex items-center justify-center text-sm font-medium text-muted-foreground">
      {user.userName.charAt(0).toUpperCase()}
    </div>
  )
}

// ── Main page ─────────────────────────────────────────────────────────────────

export default function StaffPage() {
  const [createOpen, setCreateOpen] = useState(false)
  const { data: staff = [], isLoading } = useStaffList()
  const toggleActive = useToggleActive()

  // Group by role để dễ đọc
  const superAdmins = staff.filter((u) => u.role === 'SuperAdmin')
  const admins = staff.filter((u) => u.role === 'Admin')
  const contributors = staff.filter((u) => u.role === 'Contributor')

  const groups = [
    { label: 'Super Admin', items: superAdmins },
    { label: 'Admin', items: admins },
    { label: 'Contributor', items: contributors },
  ].filter((g) => g.items.length > 0)

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            Quản lý staff
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            {isLoading ? 'Đang tải...' : `${staff.length} tài khoản`}
          </p>
        </div>
        <Button variant={'greenShiny'} onClick={() => setCreateOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Tạo tài khoản
        </Button>
      </div>

      {/* Table grouped by role */}
      {isLoading ? (
        <div className="rounded-md border bg-card divide-y">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="px-4 py-4 flex items-center gap-3 animate-pulse"
            >
              <div className="h-9 w-9 rounded-full bg-muted shrink-0" />
              <div className="flex-1 space-y-1.5">
                <div className="h-3.5 w-32 bg-muted rounded" />
                <div className="h-3 w-48 bg-muted rounded" />
              </div>
            </div>
          ))}
        </div>
      ) : staff.length === 0 ? (
        <div className="rounded-md border bg-card px-4 py-12 text-center text-muted-foreground">
          Chưa có tài khoản nào
        </div>
      ) : (
        <div className="rounded-md border bg-card overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-muted/50">
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                  Tài khoản
                </th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                  Email
                </th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                  Vai trò
                </th>
                <th className="px-4 py-3 text-right font-medium text-muted-foreground">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {groups.map((group) => (
                <>
                  {/* Group header row */}
                  <tr key={`group-${group.label}`} className="bg-muted/30">
                    <td
                      colSpan={4}
                      className="px-4 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wide"
                    >
                      {group.label} ({group.items.length})
                    </td>
                  </tr>

                  {/* User rows */}
                  {group.items.map((user) => (
                    <tr
                      key={user.id}
                      className={`hover:bg-muted/20 ${!user.isActive ? 'opacity-50' : ''}`}
                    >
                      {/* User info */}
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <UserAvatar user={user} />
                          <div>
                            <div className="flex items-center gap-2">
                              <p className="font-medium">{user.userName}</p>
                              {!user.isActive && (
                                <Badge
                                  variant="destructive"
                                  className="text-xs px-1 py-0"
                                >
                                  Đã tắt
                                </Badge>
                              )}
                            </div>
                            {user.fullName && (
                              <p className="text-xs text-muted-foreground">
                                {user.fullName}
                              </p>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Email */}
                      <td className="px-4 py-3 text-muted-foreground">
                        {user.email}
                      </td>

                      {/* Role */}
                      <td className="px-4 py-3">
                        <RoleBadge role={user.role} />
                      </td>

                      {/* Actions */}
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end">
                          {user.role === 'SuperAdmin' ? (
                            <span className="text-xs text-muted-foreground italic pr-2">
                              Không thể chỉnh sửa
                            </span>
                          ) : (
                            <TooltipProvider delayDuration={200}>
                              <AlertDialog>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <AlertDialogTrigger asChild>
                                      <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-8 w-8"
                                        disabled={toggleActive.isPending}
                                      >
                                        {user.isActive ? (
                                          <PowerOff className="h-4 w-4 text-muted-foreground" />
                                        ) : (
                                          <Power className="h-4 w-4 text-green-600" />
                                        )}
                                      </Button>
                                    </AlertDialogTrigger>
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    {user.isActive
                                      ? 'Vô hiệu hóa tài khoản'
                                      : 'Kích hoạt tài khoản'}
                                  </TooltipContent>
                                </Tooltip>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>
                                      {user.isActive
                                        ? 'Vô hiệu hóa tài khoản?'
                                        : 'Kích hoạt tài khoản?'}
                                    </AlertDialogTitle>
                                    <AlertDialogDescription>
                                      {user.isActive ? (
                                        <>
                                          Tài khoản{' '}
                                          <strong>{user.userName}</strong> sẽ bị
                                          tắt và không thể đăng nhập. Refresh
                                          token hiện tại cũng bị thu hồi.
                                        </>
                                      ) : (
                                        <>
                                          Tài khoản{' '}
                                          <strong>{user.userName}</strong> sẽ
                                          được kích hoạt trở lại và có thể đăng
                                          nhập bình thường.
                                        </>
                                      )}
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>Hủy</AlertDialogCancel>
                                    <AlertDialogAction
                                      className={
                                        user.isActive
                                          ? 'bg-destructive hover:bg-destructive/90'
                                          : 'bg-green-600 hover:bg-green-700'
                                      }
                                      onClick={() =>
                                        toggleActive.mutate(user.id)
                                      }
                                    >
                                      {user.isActive
                                        ? 'Vô hiệu hóa'
                                        : 'Kích hoạt'}
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            </TooltipProvider>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <CreateStaffDialog open={createOpen} onOpenChange={setCreateOpen} />
    </div>
  )
}
