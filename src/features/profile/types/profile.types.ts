export interface StaffProfileResult {
  id: string
  userName: string
  email: string
  fullName: string | null
  phoneNumber: string | null
  avatar: string | null
  role: string
  lastLoginAt: string | null
  createdAt: string
}

export interface UpdateProfileInput {
  fullName?: string
  phoneNumber?: string
}

export interface UpdateUsernameInput {
  userName: string
}

export interface AvatarUploadResult {
  avatarUrl: string
}
