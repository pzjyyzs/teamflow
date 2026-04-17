import { PERMISSIONS, type Permission } from './permissions'

export const ROLES = {
  Admin: 'admin',
  Member: 'member',
} as const

export type Role = (typeof ROLES)[keyof typeof ROLES]

export const ROLE_PERMISSIONS: Record<Role, Permission[]> = {
  [ROLES.Admin]: [
    PERMISSIONS.AdminAccess,
    PERMISSIONS.RequestsRead,
    PERMISSIONS.RequestsWrite,
  ],
  [ROLES.Member]: [PERMISSIONS.RequestsRead],
}

export function getPermissionsForRoles(roles: string[]): Permission[] {
  const permissions = new Set<Permission>()

  for (const role of roles) {
    const rolePermissions = ROLE_PERMISSIONS[role as Role] ?? []
    for (const permission of rolePermissions) {
      permissions.add(permission)
    }
  }

  return [...permissions]
}
