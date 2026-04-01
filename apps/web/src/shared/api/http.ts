import axios from "axios"

const baseURL = import.meta.env.VITE_API_BASE_URL as string | undefined
if (!baseURL) throw new Error('Missing VITE_API_BASE_URL')
export const http = axios.create({
    baseURL,
    headers: { 'Content-Type': 'application/json' }
})