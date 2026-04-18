import axios, { AxiosError, type AxiosInstance, type AxiosRequestConfig } from "axios"
import type { JSONValue } from "../type/type"
import { getAccessToken, getRefreshToken, setTokens, clearTokens } from "../auth/token"

const baseURL = import.meta.env.VITE_API_BASE_URL as string | undefined
if (!baseURL) throw new Error('Missing VITE_API_BASE_URL')

class Http {
    instance: AxiosInstance
    constructor(baseURL: string) {
        this.instance = axios.create({
            baseURL,
            headers: { 'Content-Type': 'application/json' }
        })
    }

    get<R = unknown>(url: string, query?: Record<string, string>, config?: Omit<AxiosRequestConfig, 'params' | 'url' | 'method'>) {
        return this.instance.request<R>({
            ...config,
            url: url,
            params: query,
            method: 'get'
        })
    }

    post<R = unknown>(url: string, data?: Record<string, JSONValue>, config?: Omit<AxiosRequestConfig, 'url' | 'data' | 'method'>) {
        return this.instance.request<R>({
            ...config,
            url: url,
            data: data,
            method: 'post'
        })
    }

    patch<R = unknown>(url: string, data?: Record<string, JSONValue>, config?: Omit<AxiosRequestConfig, 'url' | 'data' | 'method'>) {
        return this.instance.request<R>({
            ...config,
            url: url,
            data: data,
            method: 'patch'
        })
    }

    delete<R = unknown>(url: string, query?: Record<string, string>, config?: Omit<AxiosRequestConfig, 'url' | 'params' | 'method'>) {
        return this.instance.request<R>({
            ...config,
            url: url,
            params: query,
            method: 'delete'
        })
    }
}

// ========== 1. http 实例（不带认证）==========

const http = new Http(baseURL)

// 只做基础错误处理
http.instance.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response) {
            const axiosError = error as AxiosError
            if (axiosError.response?.status === 429) {
                console.log('Rate limit exceeded')
            }
        }
        const message = error.response?.data?.message || error.message || 'Request failed'
        return Promise.reject(new Error(message))
    }
)

// ========== 2. authHttp 实例（带认证 + 自动刷新）==========

const authHttp = new Http(baseURL)

// 请求拦截器：自动添加 Authorization header
authHttp.instance.interceptors.request.use((config) => {
    const token = getAccessToken()
    if (token && !config.headers.Authorization) {
        config.headers.Authorization = `Bearer ${token}`
    }
    return config
})

// 响应拦截器：处理 401 + 自动刷新 token
let isRefreshing = false
let refreshSubscribers: Array<(token: string) => void> = []

function subscribeTokenRefresh(cb: (token: string) => void) {
    refreshSubscribers.push(cb)
}

function onRefreshed(token: string) {
    refreshSubscribers.forEach(cb => cb(token))
    refreshSubscribers = []
}

authHttp.instance.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config

        // 处理 401：自动刷新 token
        if (error.response?.status === 401 &&
            originalRequest.url !== '/auth/refresh' &&
            !originalRequest._retry) {

            // 如果正在刷新，等待刷新完成
            if (isRefreshing) {
                return new Promise((resolve) => {
                    subscribeTokenRefresh((token: string) => {
                        originalRequest.headers.Authorization = `Bearer ${token}`
                        resolve(authHttp.instance.request(originalRequest))
                    })
                })
            }

            originalRequest._retry = true
            isRefreshing = true

            const refreshToken = getRefreshToken()

            // 没有 refreshToken，跳转登录页
            if (!refreshToken) {
                clearTokens()
                window.location.href = '/login'
                return Promise.reject(error)
            }

            // 调用 refresh 接口
            return axios.post(`${baseURL}/auth/refresh`, { refreshToken })
                .then(({ data }) => {
                    const { accessToken, refreshToken: newRefreshToken } = data

                    // 更新 tokens
                    setTokens(accessToken, newRefreshToken)

                    // 通知所有等待的请求
                    onRefreshed(accessToken)
                    isRefreshing = false

                    // 重新发起原请求
                    originalRequest.headers.Authorization = `Bearer ${accessToken}`
                    return authHttp.instance.request(originalRequest)
                })
                .catch((refreshError) => {
                    // refresh 失败，跳转登录页
                    isRefreshing = false
                    clearTokens()
                    window.location.href = '/login'
                    return Promise.reject(refreshError)
                })
        }

        // 其他错误处理
        if (error.response) {
            const axiosError = error as AxiosError
            if (axiosError.response?.status === 429) {
                console.log('Rate limit exceeded')
            }
        }

        const message = error.response?.data?.message || error.message || 'Request failed'
        return Promise.reject(new Error(message))
    }
)

export { http, authHttp }