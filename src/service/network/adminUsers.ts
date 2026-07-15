import client from './client.ts'
import type { AdminPermission } from '../../security/permissions.ts'

export type AdminUser = {
    username: string,
    nickname: string,
    email: string,
    phone: string,
    active: boolean,
    permissions: AdminPermission[],
}

export type UpdateAdminUser = Pick<AdminUser, 'active' | 'permissions'>

export const getAdminUsers = async () => client.get<{ result: AdminUser[] }>('/api/v1/admin/users')

export const updateAdminUser = async (username: string, data: UpdateAdminUser) =>
    client.put<AdminUser>(`/api/v1/admin/users/${encodeURIComponent(username)}`, data)
