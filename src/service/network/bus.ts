import client from './client.ts'

export type BusRouteResponse = {
    id: number,
    name: string,
    typeCode: string,
    typeName: string,
    startStopID: number,
    endStopID: number,
    upFirstTime: string,
    upLastTime: string,
    downFirstTime: string,
    downLastTime: string,
    districtCode: number,
    companyID: number,
    companyName: string,
    companyPhone: string,
}

export type CreateBusRouteRequest = {
    id: number,
    name: string,
    typeCode: string,
    typeName: string,
    startStopID: number,
    endStopID: number,
    upFirstTime: string,
    upLastTime: string,
    downFirstTime: string,
    downLastTime: string,
    districtCode: number,
    companyID: number,
    companyName: string,
    companyPhone: string,
}

export type UpdateBusRouteRequest = {
    name: string,
    typeCode: string,
    typeName: string,
    startStopID: number,
    endStopID: number,
    upFirstTime: string,
    upLastTime: string,
    downFirstTime: string,
    downLastTime: string,
    districtCode: number,
    companyID: number,
    companyName: string,
    companyPhone: string,
}

export type BusStopResponse = {
    id: number,
    name: string,
    districtCode: number,
    regionName: string,
    mobileNumber: string,
    latitude: number,
    longitude: number,
}

export type CreateBusStopRequest = {
    id: number,
    name: string,
    districtCode: number,
    regionName: string,
    mobileNumber: string,
    latitude: number,
    longitude: number,
}

export type UpdateBusStopRequest = {
    name: string,
    districtCode: number,
    regionName: string,
    mobileNumber: string,
    latitude: number,
    longitude: number,
}

export type BusRouteStopResponse = {
    seq: number,
    stopID: number,
    routeID: number,
    order: number,
    startStopID: number,
    travelTime: number,
}

export type BusRouteStopRequest = {
    stopID: number,
    order: number,
    startStopID: number,
    travelTime: number,
}

export type BusTimetableResponse = {
    seq: number,
    routeID: number,
    startStopID: number,
    dayType: string,
    departureTime: string,
}

export type BusTimetableRequest = {
    routeID: number,
    startStopID: number,
    dayType: string,
    departureTime: string,
}

export type BusRealtimeResponse = {
    routeID: number,
    stopID: number,
    order: number,
    stop: number,
    time: string,
    seat: number,
    isLowFloor: boolean,
    updatedAt: string,
}

export type BusDepartureLogResponse = {
    routeID: number,
    stopID: number,
    date: string,
    time: string,
    vehicleID: string,
}


export const getBusRoutes = async () => {
    return await client.get('/api/v1/bus/route')
}

export const createBusRoute = async (data: CreateBusRouteRequest) => {
    return await client.post('/api/v1/bus/route', data)
}

export const updateBusRoute = async (routeID: number, data: UpdateBusRouteRequest) => {
    return await client.put(`/api/v1/bus/route/${routeID}`, data)
}

export const deleteBusRoute = async (routeID: number) => {
    return await client.delete(`/api/v1/bus/route/${routeID}`)
}

export const getBusStops = async () => {
    return await client.get('/api/v1/bus/stop')
}

export const createBusStop = async (data: CreateBusStopRequest) => {
    return await client.post('/api/v1/bus/stop', data)
}

export const updateBusStop = async (stopID: number, data: UpdateBusStopRequest) => {
    return await client.put(`/api/v1/bus/stop/${stopID}`, data)
}

export const deleteBusStop = async (stopID: number) => {
    return await client.delete(`/api/v1/bus/stop/${stopID}`)
}

export const getBusRouteStops = async (routeID: number) => {
    return await client.get(`/api/v1/bus/route/${routeID}/stop`)
}

export const createBusRouteStop = async (routeID: number, data: BusRouteStopRequest) => {
    return await client.post(`/api/v1/bus/route/${routeID}/stop`, data)
}

export const updateBusRouteStop = async (routeID: number, seq: number, data: BusRouteStopRequest) => {
    return await client.put(`/api/v1/bus/route/${routeID}/stop/${seq}`, data)
}

export const deleteBusRouteStop = async (routeID: number, seq: number) => {
    return await client.delete(`/api/v1/bus/route/${routeID}/stop/${seq}`)
}

export const getBusTimetables = async (routeID: number | null, startStopID: number | null) => {
    return client.get('/api/v1/bus/timetable', {
        params: {
            ...(routeID != null && { routeID }),
            ...(startStopID != null && { startStopID }),
        },
    })
}

export const createBusTimetable = async (data: BusTimetableRequest) => {
    return await client.post('/api/v1/bus/timetable', data)
}

export const updateBusTimetable = async (seq: number, data: BusTimetableRequest) => {
    return await client.put(`/api/v1/bus/timetable/${seq}`, data)
}

export const deleteBusTimetable = async (seq: number) => {
    return await client.delete(`/api/v1/bus/timetable/${seq}`)
}

export const getBusRealtime = async () => {
    return await client.get('/api/v1/bus/realtime')
}

export const getBusDepartureLogs = async (routeID: number, seq: number) => {
    return await client.get(`/api/v1/bus/route/${routeID}/stop/${seq}/log`)
}
