import client from "./client.ts"

export const getUserInfo = async () => {
    return await client.get('/api/auth/users/me')
}

export const login = async (data: { username: string, password: string }) => {
    const formData = new FormData()
    formData.append('username', data.username)
    formData.append('password', data.password)
    return await client.post('/api/auth/users/token', formData, {
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    })
}