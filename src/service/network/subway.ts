import client from './client.ts'

export type SubwayRoute = {
    id: number,
    name: string,
}

export type CreateSubwayRouteRequest = {
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
    order: number,
    cumulativeTime: string,
}

export type UpdateSubwayStationRequest = {
    name: string,
    order: number,
    cumulativeTime: string,
}

export type SubwayTimetable = {
    seq: number,
    stationID: string,
    startStationID: string,
    terminalStationID: string,
    departureTime: string,
    weekday: string,
    direction: string,
}

export type SubwayTimetableRequest = {
    startStationID: string,
    terminalStationID: string,
    departureTime: string,
    weekdays: string,
    direction: string,
}

export type SubwayRealtime = {
    stationID: string,
    direction: string,
    order: number,
    location: string,
    stop: number,
    time: string,
    terminalStationID: string,
    trainNumber: string,
    updateTime: string,
    isExpress: boolean,
    isLast: boolean,
    status: number,
}

export const getSubwayRoutes = async () => {
    return await client.get('/api/v1/subway/route')
}

export const createSubwayRoute = async (data: CreateSubwayRouteRequest) => {
    return await client.post('/api/v1/subway/route', data)
}

export const updateSubwayRoute = async (routeID: number, data: UpdateSubwayRouteRequest) => {
    return await client.put(`/api/v1/subway/route/${routeID}`, data)
}

export const deleteSubwayRoute = async (routeID: number) => {
    return await client.delete(`/api/v1/subway/route/${routeID}`)
}

export const getSubwayStations = async () => {
    return await client.get('/api/v1/subway/station')
}

export const createSubwayStation = async (data: SubwayStation) => {
    return await client.post('/api/v1/subway/station', data)
}

export const updateSubwayStation = async (stationID: string, data: UpdateSubwayStationRequest) => {
    return await client.put(`/api/v1/subway/station/${stationID}`, data)
}

export const deleteSubwayStation = async (stationID: string) => {
    return await client.delete(`/api/v1/subway/station/${stationID}`)
}

export const getSubwayTimetableByStation = async (stationID: string) => {
    return await client.get(`/api/v1/subway/station/${stationID}/timetable`)
}

export const createSubwayTimetable = async (stationID: string, data: SubwayTimetableRequest) => {
    return await client.post(`/api/v1/subway/station/${stationID}/timetable`, data)
}

export const updateSubwayTimetable = async (stationID: string, seq: number, data: SubwayTimetableRequest) => {
    return await client.put(`/api/v1/subway/station/${stationID}/timetable/${seq}`, data)
}

export const deleteSubwayTimetable = async (stationID: string, seq: number) => {
    return await client.delete(`/api/v1/subway/station/${stationID}/timetable/${seq}`)
}

export const getSubwayTimetable = async () => {
    return await client.get('/api/v1/subway/timetable')
}

export const getSubwayRealtime = async () => {
    return await client.get('/api/v1/subway/realtime')
}
