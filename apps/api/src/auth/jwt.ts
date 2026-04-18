import { sign, verify } from "hono/jwt"
import { JWTPayload } from "hono/utils/jwt/types"

export interface TokenPayload {
    userId: string
    email: string
    roles: string[]
}

export async function generateAccessToken(payload: TokenPayload, secret: string): Promise<string> {
    const now = Math.floor(Date.now() / 1000)
    const exp = now + 15 * 60
    return await sign({ ...payload, exp }, secret)
}

export async function generateRefreshToken(userId: string, secret: string): Promise<string> {
    const now = Math.floor(Date.now() / 1000)
    const exp = now + 7 * 24 * 60 * 60
    return await sign({ userId, exp }, secret)
}

export async function verifyToken(token: string, secret: string): Promise<JWTPayload | null> {
    const decoded = await verify(token, secret, 'HS256').catch(() => {
        return null
    })
    return decoded
}