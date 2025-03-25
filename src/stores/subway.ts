import { create } from "zustand/index"
import { GridRowModesModel } from "@mui/x-data-grid"
import { GridModelStore } from "./index.ts"

type SubwayTabStore = {
    route: string,
    setRoute: (route: string) => void,
}

export type GridSubwayStationName = {
    id: string,
    name: string,
    isNew: boolean,
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
    name: string,
    sequence: number,
    cumulativeTime: string,
    isNew: boolean,
}

export type GridSubwayTimetable = {
    id: string,
    stationID: string,
    startStationID: string,
    terminalStationID: string,
    departureTime: string,
    weekday: string,
    heading: string,
    isNew: boolean,
}

export type GridSubwayRealtime = {
    id: string
    stationID: string,
    sequence: number,
    current: string,
    heading: string,
    station: string,
    time: string,
    trainNumber: string,
    express: string,
    last: string,
    terminalStationID: string,
    status: string,
    isNew: boolean,
}

type SubwayStationNameStore = {
    rows: Array<GridSubwayStationName>,
    setRows: (nameList: Array<GridSubwayStationName>) => void,
}

type SubwayRouteStore = {
    rows: Array<GridSubwayRoute>,
    setRows: (routeList: Array<GridSubwayRoute>) => void,
}

type SubwayStationStore = {
    rows: Array<GridSubwayStation>,
    setRows: (stationList: Array<GridSubwayStation>) => void,
}

type SubwayTimetableStore = {
    rows: Array<GridSubwayTimetable>,
    setRows: (timetableList: Array<GridSubwayTimetable>) => void,
}

type SubwayRealtimeStore = {
    rows: Array<GridSubwayRealtime>,
    setRows: (realtimeList: Array<GridSubwayRealtime>) => void,
}

export const useSubwayTabStore = create<SubwayTabStore>((set) => ({
    route: "station-name",
    setRoute: (route) => set({ route }),
}))

export const useSubwayStationNameStore = create<SubwayStationNameStore>((set) => ({
    rows: [],
    setRows: (nameList) => set({ rows: nameList }),
}))

export const useSubwayRouteStore = create<SubwayRouteStore>((set) => ({
    rows: [],
    setRows: (routeList) => set({ rows: routeList }),
}))

export const useSubwayStationStore = create<SubwayStationStore>((set) => ({
    rows: [],
    setRows: (stationList) => set({ rows: stationList }),
}))

export const useSubwayTimetableStore = create<SubwayTimetableStore>((set) => ({
    rows: [],
    setRows: (timetableList) => set({ rows: timetableList }),
}))

export const useSubwayRealtimeStore = create<SubwayRealtimeStore>((set) => ({
    rows: [],
    setRows: (realtimeList) => set({ rows: realtimeList }),
}))

export const useSubwayStationNameGridModelStore = create<GridModelStore>((set) => ({
    rowModesModel: {},
    setRowModesModel: (rowModesModel: GridRowModesModel) => set({ rowModesModel }),
}))

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
