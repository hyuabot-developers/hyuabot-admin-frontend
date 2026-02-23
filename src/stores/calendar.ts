import { GridRowModesModel } from '@mui/x-data-grid'
import { create } from 'zustand'

import { GridModelStore } from './index.ts'
import { CalendarCategoryResponse } from '../service/network/calendar.ts'

type CalendarTabStore = {
    route: string,
    setRoute: (route: string) => void,
}

export type GridCalendarCategoryItem = {
    id: string
    seq: number | null
    name: string
    isNew: boolean
}

export type GridCalendarEventItem = {
    id: string
    seq: number | null
    category: string
    title: string
    description: string
    start: string | Date
    end: string | Date
    isNew: boolean
}


type CalendarCategoryStore = {
    rows: Array<GridCalendarCategoryItem>,
    setRows: (categoryList: Array<GridCalendarCategoryItem>) => void,
}

type CalendarStore = {
    rows: Array<GridCalendarEventItem>,
    categories: Array<CalendarCategoryResponse>,
    setRows: (menuList: Array<GridCalendarEventItem>) => void,
    setCategories: (categories: Array<CalendarCategoryResponse>) => void,
}

export const useCalendarTabStore = create<CalendarTabStore>((set) => ({
    route: 'category',
    setRoute: (route) => set({ route }),
}))

export const useCalendarCategoryGridModelStore = create<GridModelStore>((set) => ({
    rowModesModel: {},
    setRowModesModel: (rowModesModel: GridRowModesModel) => set({ rowModesModel }),
}))

export const useCalendarCategoryStore = create<CalendarCategoryStore>((set) => ({
    rows: [],
    setRows: (categoryList) => set({ rows: categoryList }),
}))

export const useCalendarGridModelStore = create<GridModelStore>((set) => ({
    rowModesModel: {},
    setRowModesModel: (rowModesModel: GridRowModesModel) => set({ rowModesModel }),
}))

export const useCalendarStore = create<CalendarStore>((set) => ({
    rows: [],
    categories: [],
    setRows: (events) => set({ rows: events }),
    setCategories: (categories) => set({ categories }),
}))
