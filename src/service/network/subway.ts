import client from "./client.ts"

export type SubwayStationName = {
    name: string
}


export type SubwayRoute = {
    id: number,
    name: string,
}

export type UpdateSubwayRouteRequest = {
    name: string,
}

export type SubwayStation = {
    id: string,
    name: string,
    routeID: number,
    sequence: number,
    cumulativeTime: string,
}

export type UpdateSubwayStationRequest = {
    name: string,
    sequence: number,
    cumulativeTime: string,
}

export type SubwayTimetable = {
    stationID: string,
    startStationID: string,
    terminalStationID: string,
    departureTime: string,
    weekday: string,
    heading: string,
}

export type CreateSubwayTimetableRequest = {
    startStationID: string,
    terminalStationID: string,
    departureTime: string,
    weekdays: string,
    heading: string,
}

export type SubwayRealtime = {
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
    status: string
}

export const getSubwayStationNames = async ()=> {
    return await client.get('/api/subway/stationName')
}

export const createSubwayStationName = async (data: SubwayStationName) => {
    return await client.post('/api/subway/stationName', data)
}

export const deleteSubwayStationName = async (name: string) => {
    return await client.delete(`/api/subway/stationName/${name}`)
}

export const getSubwayRoutes = async () => {
    return await client.get('/api/subway/route')
}

export const createSubwayRoute = async (data: SubwayRoute) => {
    return await client.post('/api/subway/route', data)
}

export const updateSubwayRoute = async (routeID: number, data: UpdateSubwayRouteRequest) => {
    return await client.patch(`/api/subway/route/${routeID}`, data)
}

export const deleteSubwayRoute = async (routeID: number) => {
    return await client.delete(`/api/subway/route/${routeID}`)
}

export const getSubwayStations = async () => {
    return await client.get('/api/subway/station')
}

export const createSubwayStation = async (data: SubwayStation) => {
    return await client.post('/api/subway/station', data)
}

export const updateSubwayStation = async (stationID: string, data: UpdateSubwayStationRequest) => {
    return await client.patch(`/api/subway/station/${stationID}`, data)
}

export const deleteSubwayStation = async (stationID: string) => {
    return await client.delete(`/api/subway/station/${stationID}`)
}

export const getSubwayTimetables = async () => {
    return await client.get('/api/subway/timetable')
}

export const createSubwayTimetable = async (stationID: string, data: CreateSubwayTimetableRequest) => {
    return await client.post(`/api/subway/station/${stationID}/timetable`, data)
}

export const deleteSubwayTimetable = async (stationID: string, heading: string, weekday: string, departureTime: string) => {
    return await client.delete(`/api/subway/station/${stationID}/timetable/${heading}/${weekday}/${departureTime}`)
}

export const getSubwayRealtime = async () => {
    return await client.get('/api/subway/realtime')
}
