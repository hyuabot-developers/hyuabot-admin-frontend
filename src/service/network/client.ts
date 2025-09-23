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
        if (error.response?.status === 403 && !originalRequest._retry) {
            originalRequest._retry = true
            // Refresh token
            try {
                const response = await refreshToken()
                if (response.status === 200) {
                    const cookies = response.headers['Set-Cookie']
                    if (cookies) {
                        cookies.forEach((cookie: string) => {
                            if (cookie.startsWith('access_token=')) {
                                const accessToken = cookie.split(';')[0].split('=')[1]
                                localStorage.setItem('accessToken', accessToken)
                            } else if (cookie.startsWith('refresh_token=')) {
                                const refreshToken = cookie.split(';')[0].split('=')[1]
                                localStorage.setItem('refreshToken', refreshToken)
                            }
                        })
                    }
                    return client(originalRequest)
                }
            } catch (refreshError) {
                localStorage.removeItem('accessToken')
                localStorage.removeItem('refreshToken')
                window.location.href = '/login'
                throw refreshError
            }
        }
        throw error
    }
)


export default client
