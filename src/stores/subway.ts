import { GridRowModesModel } from '@mui/x-data-grid'
import { create } from 'zustand'
import { devtools } from 'zustand/middleware'

import { GridModelStore } from './index.ts'
import { SubwayRoute, SubwayStation } from '../service/network/subway.ts'

type SubwayTabStore = {
    route: string,
    setRoute: (route: string) => void,
}

export type GridSubwayRoute = {
    id: string,
    routeID: number,
    name: string,
    isNew: boolean,
}

export type GridSubwayStation = {
    id: string,
    stationID: string,
    routeID: number,
    name: string,
    order: number,
    cumulativeTime: string,
    isNew: boolean,
}

export type GridSubwayTimetable = {
    id: string,
    seq: number | null,
    startStation: string,
    terminalStation: string,
    departureTime: string,
    isNew: boolean,
}

export type GridSubwayRealtime = {
    sortableId: string,
    id: string,
    station: string,
    direction: string,
    order: number,
    location: string,
    stop: number,
    time: string,
    terminalStation: string,
    trainNumber: string,
    updateTime: string,
    isExpress: boolean,
    isLast: boolean,
    status: string,
    isNew: boolean,
}

type SubwayRouteStore = {
    rows: Array<GridSubwayRoute>,
    setRows: (routeList: Array<GridSubwayRoute>) => void,
}

type SubwayStationStore = {
    rows: Array<GridSubwayStation>,
    routes: Array<SubwayRoute>,
    setRows: (stationList: Array<GridSubwayStation>) => void,
    setRoutes: (routeList: Array<SubwayRoute>) => void,
}

type SubwayTimetableStore = {
    rows: Array<GridSubwayTimetable>,
    stations: Array<SubwayStation>,
    selectedStationID: string | null,
    selectedDirection: string | null,
    selectedWeekday: string | null,
    setRows: (timetableList: Array<GridSubwayTimetable>) => void,
    setStations: (stationList: Array<SubwayStation>) => void,
    setSelectedStationID: (station: string | null) => void,
    setSelectedDirection: (direction: string | null) => void,
    setSelectedWeekday: (weekday: string | null) => void,
}

type SubwayRealtimeStore = {
    rows: Array<GridSubwayRealtime>,
    stations: Array<SubwayStation>,
    routes: Array<SubwayRoute>,
    setRows: (realtimeList: Array<GridSubwayRealtime>) => void,
    setStations: (stationList: Array<SubwayStation>) => void,
    setRoutes: (routeList: Array<SubwayRoute>) => void,
}

export const useSubwayTabStore = create(
    devtools<SubwayTabStore>((set) => ({
        route: 'route',
        setRoute: (route) => set({ route }),
    }),
    { name: 'SubwayTabStore' })
)

export const useSubwayRouteStore = create(
    devtools<SubwayRouteStore>((set) => ({
        rows: [],
        setRows: (routeList) => set({ rows: routeList }),
    }),
    { name: 'SubwayRouteStore' })
)

export const useSubwayStationStore = create(
    devtools<SubwayStationStore>((set) => ({
        rows: [],
        routes: [],
        setRows: (stationList) => set({ rows: stationList }),
        setRoutes: (routeList) => set({ routes: routeList }),
    }),
    { name: 'SubwayStationStore' })
)

export const useSubwayTimetableStore = create(
    devtools<SubwayTimetableStore>((set) => ({
        rows: [],
        stations: [],
        selectedStationID: null,
        selectedDirection: null,
        selectedWeekday: null,
        setRows: (timetableList) => set({ rows: timetableList }),
        setStations: (stationList) => set({ stations: stationList }),
        setSelectedStationID: (stationID) => set({ selectedStationID: stationID }),
        setSelectedDirection: (direction) => set({ selectedDirection: direction }),
        setSelectedWeekday: (weekday) => set({ selectedWeekday: weekday }),
    }),
    { name: 'SubwayTimetableStore' })
)

export const useSubwayRealtimeStore = create(
    devtools<SubwayRealtimeStore>((set) => ({
        rows: [],
        stations: [],
        routes: [],
        setRows: (realtimeList) => set({ rows: realtimeList }),
        setStations: (stationList) => set({ stations: stationList }),
        setRoutes: (routeList) => set({ routes: routeList }),
    }),
    { name: 'SubwayRealtimeStore' })
)

export const useSubwayRouteGridModelStore = create<GridModelStore>((set) => ({
    rowModesModel: {},
    setRowModesModel: (rowModesModel: GridRowModesModel) => set({ rowModesModel }),
}))

export const useSubwayStationGridModelStore = create<GridModelStore>((set) => ({
    rowModesModel: {},
    setRowModesModel: (rowModesModel: GridRowModesModel) => set({ rowModesModel }),
}))

export const useSubwayTimetableGridModelStore = create<GridModelStore>((set) => ({
    rowModesModel: {},
    setRowModesModel: (rowModesModel: GridRowModesModel) => set({ rowModesModel }),
}))

export const useSubwayRealtimeGridModelStore = create<GridModelStore>((set) => ({
    rowModesModel: {},
    setRowModesModel: (rowModesModel: GridRowModesModel) => set({ rowModesModel }),
}))
