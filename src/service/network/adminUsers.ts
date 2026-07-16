import client from './client.ts'
import type { AdminPermission } from '../../security/permissions.ts'

export type AdminUser = {
    username: string,
    nickname: string,
    email: string,
    phone: string,
    active: boolean,
    status: 'DELETED' | 'PENDING_SETUP' | 'INVITATION_EXPIRED' | 'ACTIVE' | 'INACTIVE',
    invitationExpiresAt: string | null,
    permissions: AdminPermission[],
}

export type UpdateAdminUser = Pick<AdminUser, 'active' | 'permissions'>

export type CreateAdminUser = {
    userID: string,
    nickname: string,
    email: string,
    phone: string,
    permissions: AdminPermission[],
}

export type AdminUserInvitation = {
    user: AdminUser,
    token: string,
    expiresAt: string,
}

export const getAdminUsers = async () => client.get<{ result: AdminUser[] }>('/api/v1/admin/users')

export const updateAdminUser = async (username: string, data: UpdateAdminUser) =>
    client.put<AdminUser>(`/api/v1/admin/users/${encodeURIComponent(username)}`, data)

export const createAdminUser = async (data: CreateAdminUser) =>
    client.post<AdminUserInvitation>('/api/v1/admin/users', data)

export const reissueAdminUserInvitation = async (username: string) =>
    client.post<AdminUserInvitation>(`/api/v1/admin/users/${encodeURIComponent(username)}/invitation`)

export const deleteAdminUser = async (username: string) =>
    client.delete(`/api/v1/admin/users/${encodeURIComponent(username)}`)
