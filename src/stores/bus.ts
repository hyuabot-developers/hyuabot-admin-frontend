import { create } from "zustand/index"
import { GridRowModesModel } from "@mui/x-data-grid"
import { GridModelStore } from "./index.ts"

type BusTabStore = {
    route: string,
    setRoute: (route: string) => void,
}

export type BusRoute = {
    id: string,
    routeID: number,
    name: string,
    type: string,
    startStop: string,
    endStop: string,
    companyID: number,
    companyName: string,
    companyTelephone: string,
    upFirstTime: string,
    upLastTime: string,
    downFirstTime: string,
    downLastTime: string,
    isNew: boolean,
}

export type BusStop = {
    id: string,
    stopID: number,
    name: string,
    latitude: number,
    longitude: number,
    district: number,
    mobileNumber: string,
    isNew: boolean,
}

export type BusRouteStop = {
    id: string,
    route: string,
    stop: string,
    sequence: number,
    startStop: string,
    minuteFromStart: number,
    isNew: boolean,
}

export type BusTimetable = {
    id: string,
    route: string,
    startStop: string,
    weekdays: string,
    departureTime: string,
    isNew: boolean,
}

export type BusRealtime = {
    id: string,
    routeName: string,
    stopName: string,
    sequence: number,
    remainingStop: number,
    remainingTime: number,
    remainingSeat: number,
    lowFloor: boolean,
    updatedAt: string,
    isNew: boolean,
}

type BusRouteStore = {
    rows: Array<BusRoute>,
    setRows: (routeList: Array<BusRoute>) => void,
}

type BusStopStore = {
    rows: Array<BusStop>,
    setRows: (stopList: Array<BusStop>) => void,
}

type BusRouteStopStore = {
    rows: Array<BusRouteStop>,
    setRows: (routeStopList: Array<BusRouteStop>) => void,
}

type BusTimetableStore = {
    rows: Array<BusTimetable>,
    setRows: (timetableList: Array<BusTimetable>) => void,
}

type BusRealtimeStore = {
    rows: Array<BusRealtime>,
    setRows: (realtimeList: Array<BusRealtime>) => void,
}

export const useBusTabStore = create<BusTabStore>((set) => ({
    route: "route",
    setRoute: (route: string) => set({ route }),
}))

export const useBusRouteStore = create<BusRouteStore>((set) => ({
    rows: [],
    setRows: (routeList: Array<BusRoute>) => set({ rows: routeList }),
}))

export const useBusStopStore = create<BusStopStore>((set) => ({
    rows: [],
    setRows: (stopList: Array<BusStop>) => set({ rows: stopList }),
}))

export const useBusRouteStopStore = create<BusRouteStopStore>((set) => ({
    rows: [],
    setRows: (routeStopList: Array<BusRouteStop>) => set({ rows: routeStopList }),
}))

export const useBusTimetableStore = create<BusTimetableStore>((set) => ({
    rows: [],
    setRows: (timetableList: Array<BusTimetable>) => set({ rows: timetableList }),
}))

export const useBusRealtimeStore = create<BusRealtimeStore>((set) => ({
    rows: [],
    setRows: (realtimeList: Array<BusRealtime>) => set({ rows: realtimeList }),
}))

export const useBusRouteGridModelStore = create<GridModelStore>((set) => ({
    rowModesModel: {},
    setRowModesModel: (rowModesModel: GridRowModesModel) => set({ rowModesModel }),
}))

export const useBusStopGridModelStore = create<GridModelStore>((set) => ({
    rowModesModel: {},
    setRowModesModel: (rowModesModel: GridRowModesModel) => set({ rowModesModel }),
}))

export const useBusRouteStopGridModelStore = create<GridModelStore>((set) => ({
    rowModesModel: {},
    setRowModesModel: (rowModesModel: GridRowModesModel) => set({ rowModesModel }),
}))

export const useBusTimetableGridModelStore = create<GridModelStore>((set) => ({
    rowModesModel: {},
    setRowModesModel: (rowModesModel: GridRowModesModel) => set({ rowModesModel }),
}))

export const useBusRealtimeGridModelStore = create<GridModelStore>((set) => ({
    rowModesModel: {},
    setRowModesModel: (rowModesModel: GridRowModesModel) => set({ rowModesModel }),
}))
