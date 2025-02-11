import axios from 'axios'
import dotenv from 'dotenv'

// Get base url from .env file
dotenv.config()
const BASE_URL = process.env.REACT_APP_API_URL

const client = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true,
})

export default client;
