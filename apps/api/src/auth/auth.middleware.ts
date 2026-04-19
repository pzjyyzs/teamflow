import { Context } from "hono"
import { HTTPException } from "hono/http-exception"
import { verifyToken } from "./jwt"
import { UserModel } from "./user.model"
import { getPermissionsForRoles } from "../../../../packages/shared/src/rbac"

export async function authMiddleware(c: Context, next: () => Promise<void>) {
    const auth = c.req.header('authorization') ?? ''
    if (!auth.startsWith('Bearer ')) {
        throw new HTTPException(401, { message: 'Unauthorized' })
    }

    const accessToken = auth.slice('Bearer '.length)
    const payload = await verifyToken(accessToken, c.env.JWT_SECRET)
    if (!payload) {
        throw new HTTPException(401, { message: 'Unauthorized' })
    }

    const user = await UserModel.findById(payload.userId)
    if (!user) {
        throw new HTTPException(401, { message: 'Unauthorized' })
    }

    const permissions = getPermissionsForRoles(user.roles)

    // 将用户信息存入 context
    c.set('user', {
        id: user._id.toString(),
        email: user.email,
        roles: [...user.roles],
        permissions
    })

    await next()
}