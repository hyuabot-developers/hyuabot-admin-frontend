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

export const login = async (data: { username: string, password: string }) => {
    const formData = new FormData();
    formData.append('username', data.username);
    formData.append('password', data.password);
    return await client.post('/api/auth/users/token', formData, {
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    });
}