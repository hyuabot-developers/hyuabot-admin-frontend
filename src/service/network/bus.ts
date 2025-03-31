import client from "./client.ts"

export type BusCompany = {
    id: string,
    name: string,
    telephone: string,
}

export type BusFirstLastTime = {
    first: string,
    last: string,
}

export type BusRouteResponse = {
    id: number,
    name: string,
    type: string,
    start: number,
    end: number,
    company: BusCompany,
    up: BusFirstLastTime,
    down: BusFirstLastTime,
}

export type CreateBusRouteRequest = {
    id: number,
    name: string,
    typeCode: string,
    typeName: string,
    start: number,
    end: number,
    upFirstTime: string,
    upLastTime: string,
    downFirstTime: string,
    downLastTime: string,
    companyID: number,
    companyName: string,
    companyTelephone: string,
    district: number,
}

export type UpdateBusRouteRequest = {
    name: string,
    typeCode: string,
    typeName: string,
    start: number,
    end: number,
    upFirstTime: string,
    upLastTime: string,
    downFirstTime: string,
    downLastTime: string,
    companyID: number,
    companyName: string,
    companyTelephone: string,
    district: number,
}

export type BusStopResponse = {
    id: number,
    name: string,
    latitude: number,
    longitude: number,
    district: number,
    mobileNumber: string,
    regionName: string,
}

export type CreateBusStopRequest = {
    id: number,
    name: string,
    latitude: number,
    longitude: number,
    district: number,
    mobileNumber: string,
    regionName: string,
}

export type UpdateBusStopRequest = {
    name: string,
    latitude: number,
    longitude: number,
    district: number,
    mobileNumber: string,
    regionName: string,
}

export type BusRouteStopResponse = {
    routeID: number,
    stopID: number,
    sequence: number,
    startStopID: number,
    minuteFromStart: number,
}

export type CreateBusRouteStopRequest = {
    routeID: number,
    stopID: number,
    sequence: number,
    start: number,
    minuteFromStart: number,
}

export type UpdateBusRouteStopRequest = {
    sequence: number,
    start: number,
    minuteFromStart: number,
}

export type BusTimetableResponse = {
    routeID: number,
    start: number,
    weekdays: string,
    departureTime: string,
}

export type CreateBusTimetableRequest = {
    routeID: number,
    start: number,
    weekdays: string,
    departureTime: string,
}

export type BusRealtimeResponse = {
    routeID: number,
    stopID: number,
    sequence: number,
    stop: number,
    seat: number,
    time: number,
    lowFloor: boolean,
    updatedAt: string,
}

export const getBusRoutes = async () => {
    return await client.get('/api/bus/route')
}

export const createBusRoute = async (data: CreateBusRouteRequest) => {
    return await client.post('/api/bus/route', data)
}

export const updateBusRoute = async (routeID: number, data: UpdateBusRouteRequest) => {
    return await client.put(`/api/bus/route/${routeID}`, data)
}

export const deleteBusRoute = async (routeID: number) => {
    return await client.delete(`/api/bus/route/${routeID}`)
}

export const getBusStops = async () => {
    return await client.get('/api/bus/stop')
}

export const createBusStop = async (data: CreateBusStopRequest) => {
    return await client.post('/api/bus/stop', data)
}

export const updateBusStop = async (stopID: number, data: UpdateBusStopRequest) => {
    return await client.put(`/api/bus/stop/${stopID}`, data)
}

export const deleteBusStop = async (stopID: number) => {
    return await client.delete(`/api/bus/stop/${stopID}`)
}

export const getBusRouteStops = async () => {
    return await client.get('/api/bus/route-stop')
}

export const createBusRouteStop = async (routeID: number, data: CreateBusRouteStopRequest) => {
    return await client.post(`/api/bus/route/${routeID}/stop`, data)
}

export const updateBusRouteStop = async (routeID: number, stopID: number, data: UpdateBusRouteStopRequest) => {
    return await client.put(`/api/bus/route/${routeID}/stop/${stopID}`, data)
}

export const deleteBusRouteStop = async (routeID: number, stopID: number) => {
    return await client.delete(`/api/bus/route/${routeID}/stop/${stopID}`)
}

export const getBusTimetables = async () => {
    return await client.get('/api/bus/timetable')
}

export const createBusTimetable = async (data: CreateBusTimetableRequest) => {
    return await client.post('/api/bus/timetable', data)
}

export const deleteBusTimetable = async (routeID: number, start: number, weekdays: string, departureTime: string) => {
    return await client.delete(`/api/bus/timetable/${routeID}/${start}/${weekdays}/${departureTime}`)
}

export const getBusRealtime = async () => {
    return await client.get('/api/bus/realtime')
}
