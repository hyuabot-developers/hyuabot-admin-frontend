import axios from 'axios'

// Get base url from .env file
const BASE_URL = import.meta.env.VITE_APP_API_URL

const client = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
    },
    withCredentials: true,
})

export default client
