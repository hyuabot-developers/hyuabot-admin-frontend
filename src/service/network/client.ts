import axios from 'axios'
import { refreshToken } from "./auth.ts"

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
        const accessToken = localStorage.getItem('accessToken')
        if (accessToken) { config.headers.Authorization = `Bearer ${accessToken}` }
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
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true
            // Refresh token
            try {
                const response = await refreshToken()
                if (response.status === 200) {
                    const data = response.data
                    localStorage.setItem('accessToken', data.access_token)
                    localStorage.setItem('refreshToken', data.refresh_token)
                    axios.defaults.headers.common['Authorization'] = `Bearer ${data.access_token}`
                    originalRequest.headers['Authorization'] = `Bearer ${data.access_token}`
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
