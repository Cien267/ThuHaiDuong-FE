export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    LOGOUT: '/auth/logout',
    ME: '/auth/me',
    REFRESH_TOKEN: '/auth/refresh-token',
    FORGOT_PASSWORD: '/auth/forgot-password',
    RESET_PASSWORD: '/auth/reset-password',
    VERIFY_EMAIL: '/auth/verify-email',
    UPDATE_PROFILE: '/auth/update-profile',
    CHANGE_PASSWORD: '/auth/change-password',
    GET__LIST_USERS: '/auth/users',
    DETAIL: (id: string) => `/auth/users/${id}`,
  },
  USER: {
    BASE: '/users',
    DETAIL: (id: string) => `/users/${id}`,
    ROLES: (id: string) => `/users/${id}/roles`,
  },
  PEOPLE: {
    BASE: '/people',
    ALL: '/people/all',
    DETAIL: (id: string) => `/people/${id}`,
  },
} as const
