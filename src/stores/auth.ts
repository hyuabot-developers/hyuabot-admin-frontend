import { create } from 'zustand'

import { AdminPermission } from '../security/permissions.ts'

type AuthenticatedStore = {
    isAuthenticated: boolean | null,
    setIsAuthenticated: (isAuthenticated: boolean) => void,
}

type UserInfoStore = {
    username: string | null,
    nickname: string | null,
    email: string | null,
    phone: string | null,
    permissions: AdminPermission[],
    setUserInfo: (
        username: string,
        nickname: string,
        email: string,
        phone: string,
        permissions: AdminPermission[],
    ) => void,
}

export const useAuthenticatedStore = create<AuthenticatedStore>((set) => ({
    isAuthenticated: null,
    setIsAuthenticated: (isAuthenticated: boolean) => set({ isAuthenticated }),
}))

export const useUserInfoStore = create<UserInfoStore>((set) => ({
    username: null,
    nickname: null,
    email: null,
    phone: null,
    permissions: [],
    setUserInfo: (username, nickname, email, phone, permissions) =>
        set({ username, nickname, email, phone, permissions }),
}))
