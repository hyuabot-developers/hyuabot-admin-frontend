import { create } from "zustand"

type AuthenticatedStore = {
    isAuthenticated: boolean | null,
    setIsAuthenticated: (isAuthenticated: boolean) => void,
}

type UserInfoStore = {
    username: string | null,
    nickname: string | null,
    email: string | null,
    phone: string | null,
    setUserInfo: (username: string, nickname: string, email: string, phone: string) => void,
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
    setUserInfo: (username: string, nickname: string, email: string, phone: string) => set({ username, nickname, email, phone }),
}))
