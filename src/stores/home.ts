import { create } from "zustand"

type DrawerOpenedStore = {
    isDrawerOpened: boolean,
    setDrawerOpened: (isDrawerOpened: boolean) => void,
}

export const useDrawerOpenedStore = create<DrawerOpenedStore>((set) => ({
    isDrawerOpened: false,
    setDrawerOpened: (isDrawerOpened: boolean) => set({ isDrawerOpened }),
}))