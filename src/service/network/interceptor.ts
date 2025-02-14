import client from "./client.ts"
import {AxiosError} from "axios"

client.interceptors.response.use(
    (response) => {
        return response.data
    },
    async (error) => {
        const err = error as AxiosError
        console.log(err.response?.status)
        if (err.response?.status === 401) {
            console.log('401 error')
        }
        return Promise.reject(error)
    }
)