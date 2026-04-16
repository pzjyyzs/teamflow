import axios, { AxiosError, type AxiosInstance, type AxiosRequestConfig } from "axios"
import type { JSONValue } from "../type/type"

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

const http = new Http(baseURL)
/* const http = axios.create({
    baseURL,
    headers: { 'Content-Type': 'application/json' }
}) */

http.instance.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response) {
            const axiosError = error as AxiosError
            if (axiosError.response?.status === 429) {
                console.log('123')
            }
        }
        const message = error.response?.data?.message || error.message || 'Request failed'
        return Promise.reject(new Error(message))
    }
)

export { http }