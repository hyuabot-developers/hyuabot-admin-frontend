import client from "./client.ts";
import { AxiosError } from "axios";

export const getUserInfo = async () => {
    try {
        return await client.get('/api/auth/users/me');
    } catch (error) {
        const err = error as AxiosError;
        if (err.response?.status === 401) {
            window.location.href = '/login';
        }
    }
}
