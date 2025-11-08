import { GridRowModesModel } from '@mui/x-data-grid'
import { create } from 'zustand'
import { devtools } from 'zustand/middleware'

import { GridModelStore } from './index.ts'
import { CafeteriaResponse } from '../service/network/cafeteria.ts'
import { CampusResponse } from '../service/network/campus.ts'

type CafeteriaTabStore = {
    route: string,
    setRoute: (route: string) => void,
}

export type GridCafeteriaItem = {
    id: string
    seq: number | null,
    campus: string,
    name: string,
    latitude: number,
    longitude: number,
    breakfastTime: string,
    lunchTime: string,
    dinnerTime: string,
    isNew: boolean,
}

export type GridCafeteriaMenu = {
    id: string
    seq: number | null,
    cafeteriaID: number,
    date: string,
    type: string,
    food: string,
    price: string,
    isNew: boolean,
}


type CafeteriaItemStore = {
    rows: Array<GridCafeteriaItem>,
    campuses: Array<CampusResponse>,
    setRows: (cafeteriaList: Array<GridCafeteriaItem>) => void,
    setCampuses: (campusList: Array<CampusResponse>) => void,
}

type CafeteriaMenuStore = {
    rows: Array<GridCafeteriaMenu>,
    cafeterias: Array<CafeteriaResponse>,
    setRows: (menuList: Array<GridCafeteriaMenu>) => void,
    setCafeterias: (cafeteriaList: Array<CafeteriaResponse>) => void,
}

export const useCafeteriaTabStore = create(
    devtools<CafeteriaTabStore>((set) => ({
        route: 'cafeteria',
        setRoute: (route: string) => set({ route }),
    }),
    { name: 'CafeteriaTabStore' })
)

export const useCafeteriaItemGridModelStore = create(
    devtools<GridModelStore>((set) => ({
        rowModesModel: {},
        setRowModesModel: (rowModesModel: GridRowModesModel) => set({ rowModesModel }),
    }),
    { name: 'CafeteriaItemGridModelStore' })
)

export const useCafeteriaItemStore = create(
    devtools<CafeteriaItemStore>((set) => ({
        rows: [],
        campuses: [],
        setRows: (cafeteriaList) => set({ rows: cafeteriaList }),
        setCampuses: (campusList) => set({ campuses: campusList }),
    }),
    { name: 'CafeteriaItemStore' })
)

export const useCafeteriaMenuGridModelStore = create(
    devtools<GridModelStore>((set) => ({
        rowModesModel: {},
        setRowModesModel: (rowModesModel: GridRowModesModel) => set({ rowModesModel }),
    }),
    { name: 'CafeteriaMenuGridModelStore' })
)

export const useCafeteriaMenuStore = create(
    devtools<CafeteriaMenuStore>((set) => ({
        rows: [],
        cafeterias: [],
        setRows: (menuList) => set({ rows: menuList }),
        setCafeterias: (cafeteriaList) => set({ cafeterias: cafeteriaList }),
    }),
    { name: 'CafeteriaMenuStore' })
)
