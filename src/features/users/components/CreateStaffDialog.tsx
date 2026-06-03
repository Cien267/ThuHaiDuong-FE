import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2, Eye, EyeOff } from 'lucide-react'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Controller } from 'react-hook-form'
import {
  createStaffSchema,
  CREATE_STAFF_DEFAULTS,
  type CreateStaffFormValues,
} from '../constants/user.constants'
import { useCreateStaff } from '../hooks/useUsers'
import { ROLE_LABELS, STAFF_ROLES } from '../types/user.types'

interface CreateStaffDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CreateStaffDialog({
  open,
  onOpenChange,
}: CreateStaffDialogProps) {
  const [showPassword, setShowPassword] = useState(false)

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<CreateStaffFormValues, unknown, CreateStaffFormValues>({
    resolver: zodResolver(createStaffSchema),
    defaultValues: CREATE_STAFF_DEFAULTS,
  })

  const createStaff = useCreateStaff(() => {
    reset()
    onOpenChange(false)
  })

  const handleFormSubmit = (values: CreateStaffFormValues) => {
    createStaff.mutate({
      userName: values.userName,
      email: values.email,
      password: values.password,
      fullName: values.fullName || undefined,
      role: values.role,
    })
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(open) => {
        if (!createStaff.isPending) onOpenChange(open)
      }}
    >
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Tạo tài khoản staff</DialogTitle>
          <DialogDescription>
            Tạo tài khoản Contributor hoặc Admin. Không thể tạo SuperAdmin qua
            giao diện này.
          </DialogDescription>
        </DialogHeader>

        <form
          onSubmit={handleSubmit(handleFormSubmit)}
          className="space-y-4 mt-2"
        >
          {/* Username */}
          <div className="space-y-1.5">
            <Label htmlFor="userName">
              Tên đăng nhập <span className="text-destructive">*</span>
            </Label>
            <Input
              id="userName"
              {...register('userName')}
              placeholder="vd: john_doe"
              autoComplete="off"
            />
            {errors.userName && (
              <p className="text-xs text-destructive">
                {errors.userName.message}
              </p>
            )}
          </div>

          {/* Email */}
          <div className="space-y-1.5">
            <Label htmlFor="email">
              Email <span className="text-destructive">*</span>
            </Label>
            <Input
              id="email"
              type="email"
              {...register('email')}
              placeholder="vd: john@example.com"
              autoComplete="off"
            />
            {errors.email && (
              <p className="text-xs text-destructive">{errors.email.message}</p>
            )}
          </div>

          {/* Password */}
          <div className="space-y-1.5">
            <Label htmlFor="password">
              Mật khẩu <span className="text-destructive">*</span>
            </Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                {...register('password')}
                placeholder="Tối thiểu 6 ký tự"
                autoComplete="new-password"
                className="pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
            {errors.password && (
              <p className="text-xs text-destructive">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Full name */}
          <div className="space-y-1.5">
            <Label htmlFor="fullName">Họ và tên</Label>
            <Input
              id="fullName"
              {...register('fullName')}
              placeholder="Tùy chọn"
            />
          </div>

          {/* Role */}
          <div className="space-y-1.5">
            <Label>
              Vai trò <span className="text-destructive">*</span>
            </Label>
            <Controller
              name="role"
              control={control}
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn vai trò" />
                  </SelectTrigger>
                  <SelectContent>
                    {STAFF_ROLES.map((role) => (
                      <SelectItem key={role} value={role}>
                        {ROLE_LABELS[role]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.role && (
              <p className="text-xs text-destructive">{errors.role.message}</p>
            )}
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={createStaff.isPending}
            >
              Hủy
            </Button>
            <Button
              variant={'greenShiny'}
              type="submit"
              disabled={createStaff.isPending}
            >
              {createStaff.isPending && (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              )}
              Tạo tài khoản
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
