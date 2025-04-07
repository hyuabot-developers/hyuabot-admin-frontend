import { create } from "zustand"
import { GridModelStore } from "./index.ts"
import { GridRowModesModel } from "@mui/x-data-grid"

type CalendarTabStore = {
    route: string,
    setRoute: (route: string) => void,
}

export type GridCalendarCategoryItem = {
    id: string
    categoryID: number
    name: string
    isNew: boolean
}

export type GridCalendarEventItem = {
    id: string
    eventID: number
    name: string
    phone: string
    category: string
    campus: string
    isNew: boolean
}


type CalendarCategoryStore = {
    rows: Array<GridCalendarCategoryItem>,
    setRows: (categoryList: Array<GridCalendarCategoryItem>) => void,
}

type CalendarStore = {
    rows: Array<GridCalendarEventItem>,
    setRows: (menuList: Array<GridCalendarEventItem>) => void,
}

export const useCalendarTabStore = create<CalendarTabStore>((set) => ({
    route: "category",
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
    setRows: (events) => set({ rows: events }),
}))
