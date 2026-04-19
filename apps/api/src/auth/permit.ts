import { Context } from "hono";
import { HTTPException } from "hono/http-exception";

export function permit(requiredPermissions: string[]) {
    return async (c: Context, next: () => Promise<void>) => {
        const user = c.get('user')

        if (!user) {
            throw new HTTPException(401, { message: 'Unauthorized' })
        }

        const userPermissions = user.permissions || []

        const hasPermission = requiredPermissions.every(
            permission => userPermissions.includes(permission)
        )

        if (!hasPermission) {
            throw new HTTPException(403, {
                message: 'Forbidden: You do not have permission to access this resource'
            })
        }

        await next()
    }
}