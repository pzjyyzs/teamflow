import { http } from "../../../shared/api/http";

export type LoginReq = { email: string; password: string }
export type LoginRes = { accessToken: string; id: string; email: string; roles: string[] }
export type MeRes = { id: string; email: string; roles: string[] }

export async function login(req: LoginReq) {
    const { data } = await http.post<LoginRes>('/auth/login', req)
    return data
}

export async function me(token: string) {
    const { data } = await http.get<MeRes>('/auth/me', {}, {
        headers: { Authorization: `Bearer ${token}` },
    })
    return data
}
