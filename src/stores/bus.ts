import { GridRowModesModel } from '@mui/x-data-grid'
import { create } from 'zustand'
import { devtools } from 'zustand/middleware'

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

export type BusDepartureLog = {
    timestamp: string,
    vehicleID: string,
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
    selectedRouteID?: number,
    setRoutes: (routeList: Array<BusRoute>) => void,
    setStops: (stopList: Array<BusStop>) => void,
    setRows: (routeStopList: Array<BusRouteStop>) => void,
    setSelectedRouteID: (routeID: number) => void,
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

type BusDepartureLogStore = {
    selectedRouteID: number | null,
    selectedStopID: number | null,
    rows: Array<BusDepartureLog>,
    routes: Array<BusRoute>,
    stops: Array<BusStop>,
    routeStops: Array<BusRouteStop>,
    setRows: (logList: Array<BusDepartureLog>) => void,
    setSelectedRouteID: (routeID: number | null) => void,
    setSelectedStopID: (stopID: number | null) => void,
    setRoutes: (routeList: Array<BusRoute>) => void,
    setStops: (stopList: Array<BusStop>) => void,
    setRouteStops: (routeStopList: Array<BusRouteStop>) => void,
}

export const useBusTabStore = create(
    devtools<BusTabStore>((set) => ({
        route: 'route',
        setRoute: (route: string) => set({ route }),
    }),
    { name: 'BusTabStore' })
)

export const useBusRouteStore = create(
    devtools<BusRouteStore>((set) => ({
        stops: [],
        rows: [],
        setStops: (stopList: Array<BusStop>) => set({ stops: stopList }),
        setRows: (routeList: Array<BusRoute>) => set({ rows: routeList }),
    }),
    { name: 'BusRouteStore' })
)

export const useBusStopStore = create(
    devtools<BusStopStore>((set) => ({
        rows: [],
        setRows: (stopList: Array<BusStop>) => set({ rows: stopList }),
    }),
    { name: 'BusStopStore' })
)

export const useBusRouteStopStore = create(
    devtools<BusRouteStopStore>((set) => ({
        routes: [],
        stops: [],
        rows: [],
        selectedRouteID: undefined,
        setRoutes: (routeList: Array<BusRoute>) => set({ routes: routeList }),
        setStops: (stopList: Array<BusStop>) => set({ stops: stopList }),
        setRows: (routeStopList: Array<BusRouteStop>) => set({ rows: routeStopList }),
        setSelectedRouteID: (routeID: number) => set({ selectedRouteID: routeID }),
    }),
    { name: 'BusRouteStopStore' })
)

export const useBusTimetableStore = create(
    devtools<BusTimetableStore>((set) => ({
        routes: [],
        stops: [],
        rows: [],
        setRoutes: (routeList: Array<BusRoute>) => set({ routes: routeList }),
        setStops: (stopList: Array<BusStop>) => set({ stops: stopList }),
        setRows: (timetableList: Array<BusTimetable>) => set({ rows: timetableList }),
    }),
    { name: 'BusTimetableStore' })
)

export const useBusRealtimeStore = create(
    devtools<BusRealtimeStore>((set) => ({
        routes: [],
        stops: [],
        rows: [],
        setRoutes: (routeList: Array<BusRoute>) => set({ routes: routeList }),
        setStops: (stopList: Array<BusStop>) => set({ stops: stopList }),
        setRows: (realtimeList: Array<BusRealtime>) => set({ rows: realtimeList }),
    }),
    { name: 'BusRealtimeStore' })
)

export const useBusDepartureLogStore = create(
    devtools<BusDepartureLogStore>((set) => ({
        selectedRouteID: null,
        selectedStopID: null,
        routes: [],
        stops: [],
        routeStops: [],
        rows: [],
        setRows: (logList: Array<BusDepartureLog>) => set({ rows: logList }),
        setRoutes: (routeList: Array<BusRoute>) => set({ routes: routeList }),
        setStops: (stopList: Array<BusStop>) => set({ stops: stopList }),
        setRouteStops: (routeStopList: Array<BusRouteStop>) => set({ routeStops: routeStopList }),
        setSelectedRouteID: (routeID: number | null) => set({ selectedRouteID: routeID }),
        setSelectedStopID: (stopID: number | null) => set({ selectedStopID: stopID }),
    }),
    { name: 'BusDepartureLogStore' })
)

export const useBusRouteGridModelStore = create(
    devtools<GridModelStore>((set) => ({
        rowModesModel: {},
        setRowModesModel: (rowModesModel: GridRowModesModel) => set({ rowModesModel }),
    }),
    { name: 'BusRouteGridModelStore' })
)

export const useBusStopGridModelStore = create(
    devtools<GridModelStore>((set) => ({
        rowModesModel: {},
        setRowModesModel: (rowModesModel: GridRowModesModel) => set({ rowModesModel }),
    }),
    { name: 'BusStopGridModelStore' })
)

export const useBusRouteStopGridModelStore = create(
    devtools<GridModelStore>((set) => ({
        rowModesModel: {},
        setRowModesModel: (rowModesModel: GridRowModesModel) => set({ rowModesModel }),
    }),
    { name: 'BusRouteStopGridModelStore' })
)

export const useBusTimetableGridModelStore = create(
    devtools<GridModelStore>((set) => ({
        rowModesModel: {},
        setRowModesModel: (rowModesModel: GridRowModesModel) => set({ rowModesModel }),
    }),
    { name: 'BusTimetableGridModelStore' })
)

export const useBusRealtimeGridModelStore = create(
    devtools<GridModelStore>((set) => ({
        rowModesModel: {},
        setRowModesModel: (rowModesModel: GridRowModesModel) => set({ rowModesModel }),
    }),
    { name: 'BusRealtimeGridModelStore' })
)

export const useBusDepartureLogGridModelStore = create(
    devtools<GridModelStore>((set) => ({
        rowModesModel: {},
        setRowModesModel: (rowModesModel: GridRowModesModel) => set({ rowModesModel }),
    }),
    { name: 'BusDepartureLogGridModelStore' })
)
