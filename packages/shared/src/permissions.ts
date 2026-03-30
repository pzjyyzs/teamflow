export const PERMISSIONS = {
  AdminAccess: 'admin:access',
  RequestsRead: 'requests:read',
  RequestsWrite: 'requests:write',
} as const

export type Permission = (typeof PERMISSIONS)[keyof typeof PERMISSIONS]
