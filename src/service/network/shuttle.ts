import client from "./client.ts"

export type ShuttlePeriodResponse = {
    type: string,
    start: string,
    end: string,
}

export type ShuttleHolidayResponse = {
    type: string,
    calendar: string,
    date: string,
}

export type ShuttleRouteResponse = {
    name: string,
    tag: string,
    korean: string,
    english: string,
    start: string,
    end: string,
}

export type UpdateShuttleRouteRequest = {
    tag: string,
    korean: string,
    english: string,
    start: string,
    end: string,
}

export type ShuttleStopResponse = {
    name: string,
    latitude: number,
    longitude: number,
}

export type UpdateShuttleStopRequest = {
    latitude: number,
    longitude: number,
}

export type ShuttleRouteStopResponse = {
    stop: string,
    sequence: number,
    cumulativeTime: number,
}

export type UpdateShuttleRouteStopRequest = {
    sequence: number,
    cumulativeTime: number,
}

export type ShuttleTimetableResponse = {
    sequence: number,
    period: string,
    weekdays: boolean,
    route: string,
    time: string,
}

export type UpdateShuttleTimetableRequest = {
    period: string,
    weekdays: boolean,
    route: string,
    time: string,
}

export const getShuttlePeriod = async () => {
    return await client.get('/api/shuttle/period')
}

export const createShuttlePeriod = async (data: ShuttlePeriodResponse) => {
    return await client.post('/api/shuttle/period', data)
}

export const deleteShuttlePeriod = async (data: ShuttlePeriodResponse) => {
    return await client.delete(`/api/shuttle/period/${data.type}/${data.start}/${data.end}`)
}

export const getShuttleHoliday = async () => {
    return await client.get('/api/shuttle/holiday')
}

export const createShuttleHoliday = async (data: ShuttleHolidayResponse) => {
    return await client.post('/api/shuttle/holiday', data)
}

export const deleteShuttleHoliday = async (data: ShuttleHolidayResponse) => {
    return await client.delete(`/api/shuttle/holiday/${data.calendar}/${data.date}`)
}

export const getShuttleRoute = async () => {
    return await client.get('/api/shuttle/route')
}

export const createShuttleRoute = async (data: ShuttleRouteResponse) => {
    return await client.post('/api/shuttle/route', data)
}

export const updateShuttleRoute = async (name: string, data: UpdateShuttleRouteRequest) => {
    return await client.patch(`/api/shuttle/route/${name}`, data)
}

export const deleteShuttleRoute = async (name: string) => {
    return await client.delete(`/api/shuttle/route/${name}`)
}

export const getShuttleStop = async () => {
    return await client.get('/api/shuttle/stop')
}

export const createShuttleStop = async (data: ShuttleStopResponse) => {
    return await client.post('/api/shuttle/stop', data)
}

export const updateShuttleStop = async (name: string, data: UpdateShuttleStopRequest) => {
    return await client.patch(`/api/shuttle/stop/${name}`, data)
}

export const deleteShuttleStop = async (name: string) => {
    return await client.delete(`/api/shuttle/stop/${name}`)
}

export const getShuttleRouteStop = async (routeName: string) => {
    return await client.get(`/api/shuttle/route/${routeName}/stop`)
}

export const createShuttleRouteStop = async (routeName: string, data: ShuttleRouteStopResponse) => {
    return await client.post(`/api/shuttle/route/${routeName}/stop`, data)
}

export const updateShuttleRouteStop = async (routeName: string, stopName: string, data: UpdateShuttleRouteStopRequest) => {
    return await client.patch(`/api/shuttle/route/${routeName}/stop/${stopName}`, data)
}

export const deleteShuttleRouteStop = async (routeName: string, stopName: string) => {
    return await client.delete(`/api/shuttle/route/${routeName}/stop/${stopName}`)
}

export const getShuttleTimetable = async () => {
    return await client.get('/api/shuttle/timetable')
}

export const createShuttleTimetable = async (data: ShuttleTimetableResponse) => {
    return await client.post('/api/shuttle/timetable', data)
}

export const updateShuttleTimetable = async (sequence: number, data: UpdateShuttleTimetableRequest) => {
    return await client.patch(`/api/shuttle/timetable/${sequence}`, data)
}

export const deleteShuttleTimetable = async (sequence: number) => {
    return await client.delete(`/api/shuttle/timetable/${sequence}`)
}
