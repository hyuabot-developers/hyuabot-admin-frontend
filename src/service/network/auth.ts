import client from './client.ts'
import { ADMIN_PERMISSIONS } from '../../security/permissions.ts'
import type { AdminPermission } from '../../security/permissions.ts'

export type UserProfile = {
    username: string,
    nickname: string,
    email: string,
    phone: string,
    active: boolean,
    permissions: AdminPermission[],
}

const adminPermissions = new Set<string>(ADMIN_PERMISSIONS)

export const isUserProfile = (value: unknown): value is UserProfile => {
    if (typeof value !== 'object' || value === null) {
        return false
    }

    const profile = value as Partial<UserProfile>
    return typeof profile.username === 'string' &&
        typeof profile.nickname === 'string' &&
        typeof profile.email === 'string' &&
        typeof profile.phone === 'string' &&
        typeof profile.active === 'boolean' &&
        Array.isArray(profile.permissions) &&
        profile.permissions.every((permission) => adminPermissions.has(permission))
}

export const getUserInfo = async () => {
    return await client.get<UserProfile>('/api/v1/user/profile')
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

export const validateInvitation = async (token: string) =>
    client.post<{ valid: boolean, expiresAt: string | null }>('/api/v1/user/account-setup/validate', { token })

export const completeInvitation = async (token: string, password: string) =>
    client.post('/api/v1/user/account-setup/complete', { token, password })

export const updateProfile = async (data: Pick<UserProfile, 'nickname' | 'email' | 'phone'>) =>
    client.patch<UserProfile>('/api/v1/user/profile', data)

export const changePassword = async (currentPassword: string, newPassword: string) =>
    client.put('/api/v1/user/password', { currentPassword, newPassword })
