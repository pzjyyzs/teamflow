import { Hono } from 'hono'
import { z } from 'zod'
import { UserModel } from './user.model'
import bcrypt from 'bcrypt'
import { HTTPException } from 'hono/http-exception'

export const authRoutes = new Hono()

const LoginSchema = z.object({
    email: z.email(),
    password: z.string().min(6),
})

const RegisterSchema = z.object({
    email: z.email(),
    password: z.string().min(6),
})

authRoutes.post('/login', async (c) => {
    const body = LoginSchema.parse(await c.req.json())
    const user = await UserModel.findOne({ email: body.email })
    if (!user) {
        return c.json({ message: 'Invalid email or password' }, 401)
    }

    const isPasswordValid = await bcrypt.compare(body.password, user.passwordHash)
    if (!isPasswordValid) {
        return c.json({ message: 'Invalid email or password' }, 401)
    }

    const id = user._id.toString()
    const email = user.email
    const roles = [...user.roles]
    return c.json({ accessToken: `demo-token:${id}`, email, roles, id }, 200)
})

authRoutes.post('/register', async (c) => {
    const body = RegisterSchema.parse(await c.req.json())
    const existingUser = await UserModel.findOne({ email: body.email })
    if (existingUser) {
        return c.json({ message: 'Email already registered' }, 409)
    }

    const passwordHash = await bcrypt.hash(body.password, 10)
    const newUser = new UserModel({
        email: body.email,
        passwordHash
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

    return c.json({ message: 'User registered successfully', email, id, roles }, 201)
})

authRoutes.get('/me', async (c) => {
    const auth = c.req.header('authorization') ?? ''
    if (!auth.startsWith('Bearer ')) {
        return c.json({ message: 'Unauthorized' }, 401)
    }

    const accessToken = auth.slice('Bearer '.length)
    if (!accessToken.startsWith('demo-token:')) {
        return c.json({ message: 'Unauthorized' }, 401)
    }

    const userId = accessToken.slice('demo-token:'.length)
    if (!userId) {
        return c.json({ message: 'Unauthorized' }, 401)
    }

    const user = await UserModel.findById(userId)
    if (!user) {
        return c.json({ message: 'Unauthorized' }, 401)
    }

    const id = user._id.toString()
    const email = user.email
    const roles = [...user.roles]

    return c.json({
        id,
        email,
        roles,
    }, 200)
})
