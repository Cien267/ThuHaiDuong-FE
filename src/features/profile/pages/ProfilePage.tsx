import { useRef } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Camera, Loader2, Trash2, User } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
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
  updateProfileSchema,
  updateUsernameSchema,
  type UpdateProfileFormValues,
  type UpdateUsernameFormValues,
} from '../constants/profile.constants'
import {
  useMyProfile,
  useRemoveAvatar,
  useUpdateProfile,
  useUpdateUsername,
  useUploadAvatar,
} from '../hooks/useProfile'
import { ROLE_LABELS } from '@/features/users/types/user.types'

// ── Avatar section ────────────────────────────────────────────────────────────

interface AvatarSectionProps {
  avatar: string | null
  userName: string
}

function AvatarSection({ avatar, userName }: AvatarSectionProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const uploadAvatar = useUploadAvatar()
  const removeAvatar = useRemoveAvatar()

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate client-side trước: 5MB + mime type
    const allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
    if (!allowed.includes(file.type)) {
      return
    }
    if (file.size > 5 * 1024 * 1024) {
      return
    }

    uploadAvatar.mutate(file)
    // Reset input để có thể chọn lại cùng file
    e.target.value = ''
  }

  const isPending = uploadAvatar.isPending || removeAvatar.isPending

  return (
    <div className="flex items-center gap-5">
      {/* Avatar display */}
      <div className="relative shrink-0">
        {avatar ? (
          <img
            src={avatar}
            alt={userName}
            className="h-20 w-20 rounded-full object-cover border"
          />
        ) : (
          <div className="h-20 w-20 rounded-full bg-muted border flex items-center justify-center">
            <User className="h-8 w-8 text-muted-foreground" />
          </div>
        )}

        {/* Upload overlay button */}
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={isPending}
          className="absolute -bottom-1 -right-1 h-7 w-7 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow hover:bg-primary/90 disabled:opacity-50 transition-colors"
        >
          {uploadAvatar.isPending ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
          ) : (
            <Camera className="h-3.5 w-3.5" />
          )}
        </button>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          className="hidden"
          onChange={handleFileChange}
        />
      </div>

      {/* Actions */}
      <div className="space-y-1.5">
        <Button
          variant="outline"
          size="sm"
          onClick={() => fileInputRef.current?.click()}
          disabled={isPending}
        >
          Đổi ảnh
        </Button>

        {avatar && (
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="flex items-center gap-1.5 text-destructive hover:text-destructive"
                disabled={isPending}
              >
                <Trash2 className="h-3.5 w-3.5" />
                Xóa ảnh
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Xóa ảnh đại diện?</AlertDialogTitle>
                <AlertDialogDescription>
                  Ảnh đại diện của bạn sẽ bị xóa vĩnh viễn khỏi hệ thống.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Hủy</AlertDialogCancel>
                <AlertDialogAction
                  className="bg-destructive hover:bg-destructive/90"
                  onClick={() => removeAvatar.mutate()}
                >
                  Xóa
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}

        <p className="text-xs text-muted-foreground">
          JPEG, PNG, WebP, GIF. Tối đa 5MB.
        </p>
      </div>
    </div>
  )
}

// ── Profile info form ─────────────────────────────────────────────────────────

interface ProfileFormProps {
  defaultValues: UpdateProfileFormValues
}

function ProfileForm({ defaultValues }: ProfileFormProps) {
  const updateProfile = useUpdateProfile()

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
  } = useForm<UpdateProfileFormValues, unknown, UpdateProfileFormValues>({
    resolver: zodResolver(updateProfileSchema),
    defaultValues,
  })

  const onSubmit = (values: UpdateProfileFormValues) => {
    updateProfile.mutate({
      fullName: values.fullName || undefined,
      phoneNumber: values.phoneNumber || undefined,
    })
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label htmlFor="fullName">Họ và tên</Label>
          <Input
            id="fullName"
            {...register('fullName')}
            placeholder="Nguyễn Văn A"
          />
          {errors.fullName && (
            <p className="text-xs text-destructive">
              {errors.fullName.message}
            </p>
          )}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="phoneNumber">Số điện thoại</Label>
          <Input
            id="phoneNumber"
            {...register('phoneNumber')}
            placeholder="0912345678"
          />
          {errors.phoneNumber && (
            <p className="text-xs text-destructive">
              {errors.phoneNumber.message}
            </p>
          )}
        </div>
      </div>

      <div className="flex justify-end">
        <Button type="submit" disabled={!isDirty || updateProfile.isPending}>
          {updateProfile.isPending && (
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          )}
          Lưu thay đổi
        </Button>
      </div>
    </form>
  )
}

// ── Username form ─────────────────────────────────────────────────────────────

interface UsernameFormProps {
  currentUsername: string
}

function UsernameForm({ currentUsername }: UsernameFormProps) {
  const updateUsername = useUpdateUsername()

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
  } = useForm<UpdateUsernameFormValues, unknown, UpdateUsernameFormValues>({
    resolver: zodResolver(updateUsernameSchema),
    defaultValues: { userName: currentUsername },
  })

  const onSubmit = (values: UpdateUsernameFormValues) => {
    updateUsername.mutate({ userName: values.userName })
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
      <div className="space-y-1.5">
        <Label htmlFor="userName">Tên đăng nhập</Label>
        <Input
          id="userName"
          {...register('userName')}
          className="font-mono max-w-xs"
          autoComplete="off"
        />
        {errors.userName && (
          <p className="text-xs text-destructive">{errors.userName.message}</p>
        )}
        <p className="text-xs text-muted-foreground">
          Tên đăng nhập dùng để đăng nhập vào hệ thống. Không được có khoảng
          trắng.
        </p>
      </div>

      <div className="flex justify-end">
        <Button
          type="submit"
          variant="outline"
          disabled={!isDirty || updateUsername.isPending}
        >
          {updateUsername.isPending && (
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          )}
          Đổi tên đăng nhập
        </Button>
      </div>
    </form>
  )
}

// ── Main page ─────────────────────────────────────────────────────────────────

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

export default function ProfilePage() {
  const { data: profile, isLoading } = useMyProfile()

  if (isLoading) {
    return (
      <div className="p-6 text-center text-muted-foreground">Đang tải...</div>
    )
  }

  if (!profile) {
    return (
      <div className="p-6 text-center text-muted-foreground">
        Không thể tải thông tin
      </div>
    )
  }

  return (
    <div className="p-6 max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Hồ sơ cá nhân</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Quản lý thông tin tài khoản của bạn
        </p>
      </div>

      {/* Avatar + role info */}
      <div className="rounded-lg border bg-card p-5 space-y-4">
        <AvatarSection avatar={profile.avatar} userName={profile.userName} />

        <div className="border-t pt-4 grid grid-cols-2 gap-x-6 gap-y-2 text-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            Email
            <span className="text-foreground font-medium truncate">
              {profile.email}
            </span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            Vai trò
            <Badge variant="secondary">
              {ROLE_LABELS[profile.role] ?? profile.role}
            </Badge>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            Đăng nhập lần cuối
            <span className="text-foreground">
              {formatDateTime(profile.lastLoginAt)}
            </span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            Ngày tạo
            <span className="text-foreground">
              {formatDateTime(profile.createdAt)}
            </span>
          </div>
        </div>
      </div>

      {/* Profile info */}
      <div className="rounded-lg border bg-card p-5 space-y-4">
        <h2 className="font-medium">Thông tin cá nhân</h2>
        <ProfileForm
          defaultValues={{
            fullName: profile.fullName ?? '',
            phoneNumber: profile.phoneNumber ?? '',
          }}
        />
      </div>

      {/* Username */}
      <div className="rounded-lg border bg-card p-5 space-y-4">
        <div>
          <h2 className="font-medium">Tên đăng nhập</h2>
          <p className="text-sm text-muted-foreground mt-0.5">
            Thay đổi sẽ yêu cầu đăng nhập lại nếu token hết hạn
          </p>
        </div>
        <UsernameForm currentUsername={profile.userName} />
      </div>
    </div>
  )
}
