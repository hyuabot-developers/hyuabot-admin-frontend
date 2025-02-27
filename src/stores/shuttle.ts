import { create } from "zustand/index"
import { GridRowModesModel } from "@mui/x-data-grid"
import { GridModelStore } from "./index.ts"

type ShuttleTabStore = {
    route: string,
    setRoute: (route: string) => void,
}

export type ShuttlePeriod = {
    id: string,
    type: string,
    start: string,
    end: string,
    isNew: boolean,
}

type ShuttlePeriodStore = {
    rows: Array<ShuttlePeriod>,
    setRows: (periods: Array<ShuttlePeriod>) => void,
}

export type ShuttleHoliday = {
    id: string,
    type: string,
    calendar: string,
    date: string,
    isNew: boolean,
}

type ShuttleHolidayStore = {
    rows: Array<ShuttleHoliday>,
    setRows: (holidays: Array<ShuttleHoliday>) => void,
}

export const useShuttleTabStore = create<ShuttleTabStore>((set) => ({
    route: "period",
    setRoute: (route: string) => set({ route }),
}))

export const useShuttlePeriodStore = create<ShuttlePeriodStore>((set) => ({
    rows: [],
    setRows: (rows: Array<ShuttlePeriod>) => {
        rows.sort(function (a: ShuttlePeriod, b: ShuttlePeriod) {
            return a.start < b.start ? -1 : a.start > b.start ? 1 : 0
        })
        set({ rows })
    },
}))

export const useShuttlePeriodGridModelStore = create<GridModelStore>((set) => ({
    rowModesModel: {},
    setRowModesModel: (rowModesModel: GridRowModesModel) => set({ rowModesModel }),
}))

export const useShuttleHolidayStore = create<ShuttleHolidayStore>((set) => ({
    rows: [],
    setRows: (rows: Array<ShuttleHoliday>) => {
        rows.sort(function (a: ShuttleHoliday, b: ShuttleHoliday) {
            return a.date < b.date ? -1 : a.date > b.date ? 1 : 0
        })
        set({ rows })
    },
}))

export const useShuttleHolidayGridModelStore = create<GridModelStore>((set) => ({
    rowModesModel: {},
    setRowModesModel: (rowModesModel: GridRowModesModel) => set({ rowModesModel }),
}))
