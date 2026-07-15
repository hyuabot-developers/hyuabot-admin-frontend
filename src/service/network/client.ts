import axios from 'axios'

import { refreshToken } from './auth.ts'

// Get base url from .env file
const BASE_URL = import.meta.env.VITE_APP_API_URL

const client = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true,
})

let refreshRequest: ReturnType<typeof refreshToken> | null = null

const refreshAccessToken = () => {
    if (refreshRequest === null) {
        refreshRequest = refreshToken().finally(() => {
            refreshRequest = null
        })
    }
    return refreshRequest
}

client.interceptors.response.use(
    (response) => {
        return response
    },
    async (error) => {
        const originalRequest = error.config
        if (
            error.response?.status === 401 &&
            originalRequest &&
            !originalRequest._retry &&
            !originalRequest.url?.endsWith('/api/v1/user/token')
        ) {
            originalRequest._retry = true
            try {
                await refreshAccessToken()
                return client(originalRequest)
            } catch (refreshError) {
                window.location.assign('/login')
                throw refreshError
            }
        }
        throw error
    }
)


export default client
