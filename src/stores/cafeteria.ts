import { create } from "zustand"
import { GridModelStore } from "./index.ts"
import { GridRowModesModel } from "@mui/x-data-grid"

type CafeteriaTabStore = {
    route: string,
    setRoute: (route: string) => void,
}

export type GridCafeteriaItem = {
    id: string
    cafeteriaID: number
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
    date: string
    time: string
    cafeteria: string
    name: string
    price: number
    isNew: boolean
}


type CafeteriaItemStore = {
    rows: Array<GridCafeteriaItem>,
    setRows: (cafeteriaList: Array<GridCafeteriaItem>) => void,
}

type CafeteriaMenuStore = {
    rows: Array<GridCafeteriaMenu>,
    setRows: (menuList: Array<GridCafeteriaMenu>) => void,
}

export const useCafeteriaTabStore = create<CafeteriaTabStore>((set) => ({
    route: "cafeteria",
    setRoute: (route) => set({ route }),
}))

export const useCafeteriaItemGridModelStore = create<GridModelStore>((set) => ({
    rowModesModel: {},
    setRowModesModel: (rowModesModel: GridRowModesModel) => set({ rowModesModel }),
}))

export const useCafeteriaItemStore = create<CafeteriaItemStore>((set) => ({
    rows: [],
    setRows: (cafeteriaList) => set({ rows: cafeteriaList }),
}))

export const useCafeteriaMenuGridModelStore = create<GridModelStore>((set) => ({
    rowModesModel: {},
    setRowModesModel: (rowModesModel: GridRowModesModel) => set({ rowModesModel }),
}))

export const useCafeteriaMenuStore = create<CafeteriaMenuStore>((set) => ({
    rows: [],
    setRows: (menuList) => set({ rows: menuList }),
}))
