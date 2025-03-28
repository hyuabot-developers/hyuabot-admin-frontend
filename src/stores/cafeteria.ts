import { create } from "zustand"

type CafeteriaTabStore = {
    route: string,
    setRoute: (route: string) => void,
}

export type GridCafeteriaItem = {
    id: string
    cafeteriaID: string
    name: string
    campus: string
    latitude: number
    longitude: number
    breakfastTime: string
    lunchTime: string
    dinnerTime: string
    isNew: boolean
}

export type GridCafeteriaMenu = {
    id: string
    cafeteria: string
    name: string
    price: number
    isNew: boolean
}


type CafeteriaItemStore = {
    rows: Array<GridCafeteriaItem>,
    setRows: (nameList: Array<GridCafeteriaItem>) => void,
}

type CafeteriaMenuStore = {
    rows: Array<GridCafeteriaMenu>,
    setRows: (menuList: Array<GridCafeteriaMenu>) => void,
}

export const useCafeteriaTabStore = create<CafeteriaTabStore>((set) => ({
    route: "cafeteria",
    setRoute: (route) => set({ route }),
}))

export const useCafeteriaItemStore = create<CafeteriaItemStore>((set) => ({
    rows: [],
    setRows: (nameList) => set({ rows: nameList }),
}))

export const useCafeteriaMenuStore = create<CafeteriaMenuStore>((set) => ({
    rows: [],
    setRows: (menuList) => set({ rows: menuList }),
}))
