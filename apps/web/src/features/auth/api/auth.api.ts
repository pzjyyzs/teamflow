import { http, authHttp } from "../../../shared/api/http";

export type LoginReq = {
    email: string
    password: string
}
export type LoginRes = {
    accessToken: string
    refreshToken: string
    id: string
    email: string
    roles: string[]
    permissions: string[]
}
export type MeRes = {
    id: string
    email: string
    roles: string[]
    permissions: string[]
}
export type RegisterRes = {
    id: string
    email: string
    roles: string[]
    permissions: string[]
    message: string
}
export type RefreshReq = {
    refreshToken: string
}
export type RefreshRes = {
    accessToken: string
    refreshToken: string
    email: string
    roles: string[]
    permissions: string[]
    id: string
}

export async function login(req: LoginReq) {
    const { data } = await http.post<LoginRes>('/auth/login', req)
    return data
}

// 获取用户信息（需要认证）- authHttp 自动添加 Authorization
export async function me() {
    const { data } = await authHttp.get<MeRes>('/auth/me')
    return data
}

export async function register(req: LoginReq) {
    const { data } = await http.post<RegisterRes>('/auth/register', req)
    return data
}

export async function refresh(req: RefreshReq) {
    const { data } = await http.post<RefreshRes>('/auth/refresh', req)
    return data
}