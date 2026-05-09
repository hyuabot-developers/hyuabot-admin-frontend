import client from './client.ts'

export const getUserInfo = async () => {
    return await client.get('/api/v1/user/profile')
}

export const login = async (data: { username: string, password: string }) => {
    const params = new URLSearchParams()
    params.append('username', data.username)
    params.append('password', data.password)
    return await client.post('/api/v1/user/token', params, {
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    })
}

export const refreshToken = async () => {
    return await client.put('/api/v1/user/token')
}

export const logout = async () => {
    return await client.delete('/api/v1/user/token')
}