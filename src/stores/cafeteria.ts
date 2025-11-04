import { GridRowModesModel } from '@mui/x-data-grid'
import { create } from 'zustand'

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
    campusID: number,
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

export const useCafeteriaTabStore = create<CafeteriaTabStore>((set) => ({
    route: 'cafeteria',
    setRoute: (route) => set({ route }),
}))

export const useCafeteriaItemGridModelStore = create<GridModelStore>((set) => ({
    rowModesModel: {},
    setRowModesModel: (rowModesModel: GridRowModesModel) => set({ rowModesModel }),
}))

export const useCafeteriaItemStore = create<CafeteriaItemStore>((set) => ({
    rows: [],
    campuses: [],
    setRows: (cafeteriaList) => set({ rows: cafeteriaList }),
    setCampuses: (campusList) => set({ campuses: campusList }),
}))

export const useCafeteriaMenuGridModelStore = create<GridModelStore>((set) => ({
    rowModesModel: {},
    setRowModesModel: (rowModesModel: GridRowModesModel) => set({ rowModesModel }),
}))

export const useCafeteriaMenuStore = create<CafeteriaMenuStore>((set) => ({
    rows: [],
    cafeterias: [],
    setRows: (menuList) => set({ rows: menuList }),
    setCafeterias: (cafeteriaList) => set({ cafeterias: cafeteriaList }),
}))
