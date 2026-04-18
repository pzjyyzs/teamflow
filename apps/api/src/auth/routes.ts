import { Context, Hono } from 'hono'
import { email, z } from 'zod'
import { UserModel } from './user.model'
import bcrypt from 'bcrypt'
import { HTTPException } from 'hono/http-exception'
import { ROLES, getPermissionsForRoles } from '../../../../packages/shared/src/rbac'
import { use } from 'hono/jsx'
import { generateAccessToken, generateRefreshToken, verifyToken } from './jwt'

export const authRoutes = new Hono()

const LoginSchema = z.object({
    email: z.email(),
    password: z.string().min(6),
})

const RegisterSchema = z.object({
    email: z.email(),
    password: z.string().min(6),
})

const RefreshSchema = z.object({
    refreshToken: z.string()
})

authRoutes.post('/login', async (c: Context) => {
    const body = LoginSchema.parse(await c.req.json())
    const user = await UserModel.findOne({ email: body.email })
    if (!user) {
        return c.json({ message: 'Invalid email or password' }, 401)
    }

    const isPasswordValid = await bcrypt.compare(body.password, user.passwordHash)
    if (!isPasswordValid) {
        return c.json({ message: 'Invalid email or password' }, 401)
    }

    const payload = {
        userId: user._id.toString(),
        email: user.email,
        roles: [...user.roles]
    }

    const accessToken = await generateAccessToken(payload, c.env.JWT_SECRET)
    const refreshToken = await generateRefreshToken(user._id.toString(), c.env.JWT_SECRET)

    user.refreshToken = refreshToken

    await user.save()

    const permissions = getPermissionsForRoles(user.roles)

    return c.json({
        accessToken,
        refreshToken,
        email: user.email,
        roles: [...user.roles],
        permissions,
        id: user._id.toString()
    }, 200)
})

authRoutes.post('/register', async (c: Context) => {
    const body = RegisterSchema.parse(await c.req.json())
    const existingUser = await UserModel.findOne({ email: body.email })
    if (existingUser) {
        return c.json({ message: 'Email already registered' }, 409)
    }

    const passwordHash = await bcrypt.hash(body.password, 10)
    const newUser = new UserModel({
        email: body.email,
        passwordHash,
        roles: [ROLES.Member],
    })

    await newUser.save().catch((error) => {
        if (error.code === 11000) {
            throw new HTTPException(409, {
                message: 'Email already registered',
            })
        }

        throw error
    })

    const id = newUser._id.toString()
    const email = newUser.email
    const roles = [...newUser.roles]
    const permissions = getPermissionsForRoles(roles)

    return c.json({ message: 'User registered successfully', email, id, roles, permissions }, 201)
})

authRoutes.get('/me', async (c: Context) => {
    const auth = c.req.header('authorization') ?? ''
    if (!auth.startsWith('Bearer ')) {
        return c.json({ message: 'Unauthorized' }, 401)
    }

    const accessToken = auth.slice('Bearer '.length)
    const payload = await verifyToken(accessToken, c.env.JWT_SECRET)
    if (!payload) {
        return c.json({ message: 'Unauthorized' }, 401)
    }

    const user = await UserModel.findById(payload.userId)
    if (!user) {
        return c.json({ message: 'Unauthorized' }, 401)
    }

    const permissions = getPermissionsForRoles(user.roles)

    return c.json({
        id: user._id.toString(),
        email: user.email,
        roles: [...user.roles],
        permissions,
    }, 200)
})

authRoutes.post('/refresh', async (c: Context) => {
    const body = RefreshSchema.parse(await c.req.json())

    const payload = await verifyToken(body.refreshToken, c.env.JWT_SECRET)
    if (!payload || !payload.userId) {
        return c.json({ message: 'Invalid refresh token' }, 401)
    }

    const user = await UserModel.findById(payload.userId)
    if (!user || user.refreshToken !== body.refreshToken) {
        return c.json({ message: 'Invalid refresh token' }, 401)
    }

    const newPayload = {
        userId: user._id.toString(),
        email: user.email,
        roles: [...user.roles]
    }

    const accessToken = await generateAccessToken(newPayload, c.env.JWT_SECRET)
    const newRefreshToken = await generateRefreshToken(user._id.toString(), c.env.JWT_SECRET)

    user.refreshToken = newRefreshToken

    await user.save()

    const permissions = getPermissionsForRoles(user.roles)

    return c.json({
        accessToken,
        refreshToken: newRefreshToken,
        email: user.email,
        roles: [...user.roles],
        permissions,
        id: user._id.toString()
    }, 200)
})