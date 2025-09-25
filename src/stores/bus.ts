import { GridRowModesModel } from '@mui/x-data-grid'
import { create } from 'zustand'

import { GridModelStore } from './index.ts'

export type BusTabStore = {
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
    districtCode: number,
    mobileNumber: string,
    isNew: boolean,
}

export type BusRouteStop = {
    id: string,
    seq: number | null,
    route: string,
    stop: string,
    order: number,
    startStop: string,
    travelTime: number,
    isNew: boolean,
}

export type BusTimetable = {
    id: string,
    seq: number | null,
    route: string,
    startStop: string,
    dayType: string,
    departureTime: string,
    isNew: boolean,
}

export type BusRealtime = {
    id: string,
    route: string,
    stop: string,
    order: number,
    remainingStop: number,
    remainingTime: number,
    remainingSeat: number,
    lowFloor: boolean,
    updatedAt: string,
    isNew: boolean,
}

type BusRouteStore = {
    stops: Array<BusStop>,
    rows: Array<BusRoute>,
    setStops: (stopList: Array<BusStop>) => void,
    setRows: (routeList: Array<BusRoute>) => void,
}

type BusStopStore = {
    rows: Array<BusStop>,
    setRows: (stopList: Array<BusStop>) => void,
}

type BusRouteStopStore = {
    routes: Array<BusRoute>,
    stops: Array<BusStop>,
    rows: Array<BusRouteStop>,
    setRoutes: (routeList: Array<BusRoute>) => void,
    setStops: (stopList: Array<BusStop>) => void,
    setRows: (routeStopList: Array<BusRouteStop>) => void,
}

type BusTimetableStore = {
    routes: Array<BusRoute>,
    stops: Array<BusStop>,
    rows: Array<BusTimetable>,
    setRoutes: (routeList: Array<BusRoute>) => void,
    setStops: (stopList: Array<BusStop>) => void,
    setRows: (timetableList: Array<BusTimetable>) => void,
}

type BusRealtimeStore = {
    routes: Array<BusRoute>,
    stops: Array<BusStop>,
    rows: Array<BusRealtime>,
    setRoutes: (routeList: Array<BusRoute>) => void,
    setStops: (stopList: Array<BusStop>) => void,
    setRows: (realtimeList: Array<BusRealtime>) => void,
}

export const useBusTabStore = create<BusTabStore>((set) => ({
    route: 'route',
    setRoute: (route: string) => set({ route }),
}))

export const useBusRouteStore = create<BusRouteStore>((set) => ({
    stops: [],
    rows: [],
    setStops: (stopList: Array<BusStop>) => set({ stops: stopList }),
    setRows: (routeList: Array<BusRoute>) => set({ rows: routeList }),
}))

export const useBusStopStore = create<BusStopStore>((set) => ({
    rows: [],
    setRows: (stopList: Array<BusStop>) => set({ rows: stopList }),
}))

export const useBusRouteStopStore = create<BusRouteStopStore>((set) => ({
    routes: [],
    stops: [],
    rows: [],
    setRoutes: (routeList: Array<BusRoute>) => set({ routes: routeList }),
    setStops: (stopList: Array<BusStop>) => set({ stops: stopList }),
    setRows: (routeStopList: Array<BusRouteStop>) => set({ rows: routeStopList }),
}))

export const useBusTimetableStore = create<BusTimetableStore>((set) => ({
    routes: [],
    stops: [],
    rows: [],
    setRoutes: (routeList: Array<BusRoute>) => set({ routes: routeList }),
    setStops: (stopList: Array<BusStop>) => set({ stops: stopList }),
    setRows: (timetableList: Array<BusTimetable>) => set({ rows: timetableList }),
}))

export const useBusRealtimeStore = create<BusRealtimeStore>((set) => ({
    routes: [],
    stops: [],
    rows: [],
    setRoutes: (routeList: Array<BusRoute>) => set({ routes: routeList }),
    setStops: (stopList: Array<BusStop>) => set({ stops: stopList }),
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
