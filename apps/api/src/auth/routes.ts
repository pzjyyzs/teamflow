import { Hono } from 'hono'
import { z } from 'zod'

export const authRoutes = new Hono()

const LoginSchema = z.object({
    username: z.string().min(1),
    password: z.string().min(1),
})

authRoutes.post('/login', async (c) => {
    const body = LoginSchema.parse(await c.req.json())
    // TODO: 这里先做 demo：不查库，直接返回 token
    return c.json({ accessToken: 'demo-token', email: body.username })
})

authRoutes.get('/me', (c) => {
    const auth = c.req.header('authorization') ?? ''
    if (auth !== 'Bearer demo-token') return c.json({ message: 'Unauthorized' }, 401)

    return c.json({
        id: 'demo-user',
        username: 'demo@example.com',
        permissions: ['requests:read', 'requests:write'],
    })
})