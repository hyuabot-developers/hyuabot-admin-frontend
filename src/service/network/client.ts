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

client.interceptors.request.use(
    (config) => {
        return config
    },
    (error) => {
        throw error
    }
)

client.interceptors.response.use(
    (response) => {
        return response
    },
    async (error) => {
        const originalRequest = error.config
        if (
            error.response?.status === 401 &&
            !originalRequest._retry &&
            !originalRequest.url?.endsWith('/api/v1/user/token')
        ) {
            originalRequest._retry = true
            // Refresh token
            try {
                await refreshToken()
                return client(originalRequest)
            } catch (refreshError) {
                window.location.href = '/login'
                throw refreshError
            }
        }
        throw error
    }
)


export default client
