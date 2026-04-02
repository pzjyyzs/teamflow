import axios from "axios"

const baseURL = import.meta.env.VITE_API_BASE_URL as string | undefined
if (!baseURL) throw new Error('Missing VITE_API_BASE_URL')
const http = axios.create({
    baseURL,
    headers: { 'Content-Type': 'application/json' }
})

http.interceptors.response.use(
    (response) => response,
    (error) => {
        const message = error.response?.data?.message || error.message || 'Request failed'
        return Promise.reject(new Error(message))
    }
)

export { http }