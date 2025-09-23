import { create } from "zustand"
import { devtools } from "zustand/middleware"
import { GridRowModesModel } from "@mui/x-data-grid"
import { GridModelStore } from "./index.ts"

type ShuttleTabStore = {
    route: string,
    setRoute: (route: string) => void,
}

export type ShuttlePeriod = {
    id: string,
    seq: number | null,
    type: string | null,
    start: Date | null,
    end: Date | null,
    isNew: boolean,
}

type ShuttlePeriodStore = {
    rows: Array<ShuttlePeriod>,
    setRows: (periods: Array<ShuttlePeriod>) => void,
}

export type ShuttleHoliday = {
    id: string,
    seq: number | null,
    type: string | null,
    calendarType: string | null,
    date: Date | null,
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
    seq: number | null,
    stop: string,
    order: number,
    cumulativeTime: string,
    isNew: boolean,
}

type ShuttleRouteStopStore = {
    rows: Array<ShuttleRouteStop>,
    setRows: (routeStops: Array<ShuttleRouteStop>) => void,
}

export type ShuttleTimetable = {
    id: string,
    sequence: number | null,
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

// Tab Store
export const useShuttleTabStore = create(
    devtools<ShuttleTabStore>(
        (set) => ({
            route: "period",
            setRoute: (route: string) => set({ route }),
        }),
        { name: "ShuttleTabStore" }
    )
)

// Period Store
export const useShuttlePeriodStore = create(
    devtools<ShuttlePeriodStore>(
        (set) => ({
            rows: [],
            setRows: (rows: Array<ShuttlePeriod>) => {
                rows.sort((a, b) => (a.start! < b.start! ? -1 : a.start! > b.start! ? 1 : 0))
                set({ rows })
            },
        }),
        { name: "ShuttlePeriodStore" }
    )
)

export const useShuttlePeriodGridModelStore = create(
    devtools<GridModelStore>(
        (set) => ({
            rowModesModel: {},
            setRowModesModel: (rowModesModel: GridRowModesModel) => set({ rowModesModel }),
        }),
        { name: "ShuttlePeriodGridModelStore" }
    )
)

// Holiday Store
export const useShuttleHolidayStore = create(
    devtools<ShuttleHolidayStore>(
        (set) => ({
            rows: [],
            setRows: (rows: Array<ShuttleHoliday>) => {
                rows.sort((a, b) => (a.date! < b.date! ? -1 : a.date! > b.date! ? 1 : 0))
                set({ rows })
            },
        }),
        { name: "ShuttleHolidayStore" }
    )
)

export const useShuttleHolidayGridModelStore = create(
    devtools<GridModelStore>(
        (set) => ({
            rowModesModel: {},
            setRowModesModel: (rowModesModel: GridRowModesModel) => set({ rowModesModel }),
        }),
        { name: "ShuttleHolidayGridModelStore" }
    )
)

// Route Store
export const useShuttleRouteStore = create(
    devtools<ShuttleRouteStore>(
        (set) => ({
            rows: [],
            setRows: (rows: Array<ShuttleRoute>) => {
                rows.sort((a, b) => (a.tag < b.tag ? -1 : a.tag > b.tag ? 1 : 0))
                set({ rows })
            },
        }),
        { name: "ShuttleRouteStore" }
    )
)

export const useShuttleRouteGridModelStore = create(
    devtools<GridModelStore>(
        (set) => ({
            rowModesModel: {},
            setRowModesModel: (rowModesModel: GridRowModesModel) => set({ rowModesModel }),
        }),
        { name: "ShuttleRouteGridModelStore" }
    )
)

// Stop Store
export const useShuttleStopStore = create(
    devtools<ShuttleStopStore>(
        (set) => ({
            rows: [],
            setRows: (rows: Array<ShuttleStop>) => {
                rows.sort((a, b) => (a.name < b.name ? -1 : a.name > b.name ? 1 : 0))
                set({ rows })
            },
        }),
        { name: "ShuttleStopStore" }
    )
)

export const useShuttleStopGridModelStore = create(
    devtools<GridModelStore>(
        (set) => ({
            rowModesModel: {},
            setRowModesModel: (rowModesModel: GridRowModesModel) => set({ rowModesModel }),
        }),
        { name: "ShuttleStopGridModelStore" }
    )
)

// Route Stop Store
export const useShuttleRouteStopStore = create(
    devtools<ShuttleRouteStopStore>(
        (set) => ({
            rows: [],
            setRows: (rows: Array<ShuttleRouteStop>) => {
                rows.sort((a, b) => (a.order < b.order ? -1 : a.order > b.order ? 1 : 0))
                set({ rows })
            },
        }),
        { name: "ShuttleRouteStopStore" }
    )
)

export const useShuttleRouteStopGridModelStore = create(
    devtools<GridModelStore>(
        (set) => ({
            rowModesModel: {},
            setRowModesModel: (rowModesModel: GridRowModesModel) => set({ rowModesModel }),
        }),
        { name: "ShuttleRouteStopGridModelStore" }
    )
)

// Selected Route
export const useSelectedShuttleRouteStore = create(
    devtools<{ selectedRoute: string | null; setSelectedRoute: (route: string) => void }>(
        (set) => ({
            selectedRoute: null,
            setSelectedRoute: (route: string) => set({ selectedRoute: route }),
        }), { name: "SelectedShuttleRouteStore" }
    )
)

// Timetable Store
export const useShuttleTimetableStore = create(
    devtools<ShuttleTimetableStore>(
        (set) => ({
            rows: [],
            setRows: (rows: Array<ShuttleTimetable>) => {
                rows.sort((a, b) => (a.time < b.time ? -1 : a.time > b.time ? 1 : 0))
                set({ rows })
            },
        }),
        { name: "ShuttleTimetableStore" }
    )
)

export const useShuttleTimetableGridModelStore = create(
    devtools<GridModelStore>(
        (set) => ({
            rowModesModel: {},
            setRowModesModel: (rowModesModel: GridRowModesModel) => set({ rowModesModel }),
        }),
        { name: "ShuttleTimetableGridModelStore" }
    )
)