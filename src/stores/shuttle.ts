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

export type ShuttleRoute = {
    id: string,
    name: string,
    tag: string,
    korean: string,
    english: string,
    start: string,
    end: string,
    isNew: boolean,
}

type ShuttleRouteStore = {
    rows: Array<ShuttleRoute>,
    setRows: (routes: Array<ShuttleRoute>) => void,
}

export type ShuttleStop = {
    id: string,
    name: string,
    latitude: number,
    longitude: number,
    isNew: boolean,
}

type ShuttleStopStore = {
    rows: Array<ShuttleStop>,
    setRows: (stops: Array<ShuttleStop>) => void,
}

export type ShuttleRouteStop = {
    id: string,
    route: string,
    stop: string,
    sequence: number,
    cumulativeTime: number,
    isNew: boolean,
}

type ShuttleRouteStopStore = {
    rows: Array<ShuttleRouteStop>,
    setRows: (routeStops: Array<ShuttleRouteStop>) => void,
}

export type ShuttleTimetable = {
    id: string,
    sequence: number,
    period: string,
    weekdays: boolean,
    route: string,
    time: string,
    isNew: boolean,
}

type ShuttleTimetableStore = {
    rows: Array<ShuttleTimetable>,
    setRows: (timetables: Array<ShuttleTimetable>) => void,
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

export const useShuttleRouteStore = create<ShuttleRouteStore>((set) => ({
    rows: [],
    setRows: (rows: Array<ShuttleRoute>) => {
        rows.sort(function (a: ShuttleRoute, b: ShuttleRoute) {
            return a.tag < b.tag ? -1 : a.tag > b.tag ? 1 : 0
        })
        set({ rows })
    },
}))

export const useShuttleRouteGridModelStore = create<GridModelStore>((set) => ({
    rowModesModel: {},
    setRowModesModel: (rowModesModel: GridRowModesModel) => set({ rowModesModel }),
}))

export const useShuttleStopStore = create<ShuttleStopStore>((set) => ({
    rows: [],
    setRows: (rows: Array<ShuttleStop>) => {
        rows.sort(function (a: ShuttleStop, b: ShuttleStop) {
            return a.name < b.name ? -1 : a.name > b.name ? 1 : 0
        })
        set({ rows })
    },
}))

export const useShuttleStopGridModelStore = create<GridModelStore>((set) => ({
    rowModesModel: {},
    setRowModesModel: (rowModesModel: GridRowModesModel) => set({ rowModesModel }),
}))

export const useShuttleRouteStopStore = create<ShuttleRouteStopStore>((set) => ({
    rows: [],
    setRows: (rows: Array<ShuttleRouteStop>) => {
        rows.sort(function (a: ShuttleRouteStop, b: ShuttleRouteStop) {
            return a.route < b.route ? -1 : a.route > b.route ? 1 : (a.sequence < b.sequence ? -1 : a.sequence > b.sequence ? 1 : 0)
        })
        set({ rows })
    },
}))

export const useShuttleRouteStopGridModelStore = create<GridModelStore>((set) => ({
    rowModesModel: {},
    setRowModesModel: (rowModesModel: GridRowModesModel) => set({ rowModesModel }),
}))

export const useShuttleTimetableStore = create<ShuttleTimetableStore>((set) => ({
    rows: [],
    setRows: (rows: Array<ShuttleTimetable>) => {
        rows.sort(function (a: ShuttleTimetable, b: ShuttleTimetable) {
            return a.time < b.time ? -1 : a.time > b.time ? 1 : 0
        })
        set({ rows })
    },
}))

export const useShuttleTimetableGridModelStore = create<GridModelStore>((set) => ({
    rowModesModel: {},
    setRowModesModel: (rowModesModel: GridRowModesModel) => set({ rowModesModel }),
}))
