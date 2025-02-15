import { create } from "zustand"

type AuthenticatedStore = {
    isAuthenticated: boolean | null,
    setIsAuthenticated: (isAuthenticated: boolean) => void,
}

export const useAuthenticatedStore = create<AuthenticatedStore>((set) => ({
    isAuthenticated: null,
    setIsAuthenticated: (isAuthenticated: boolean) => set({ isAuthenticated }),
}))
