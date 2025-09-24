import client from './client.ts'

export type ShuttlePeriodResponse = {
    seq: number,
    type: string,
    start: string,
    end: string,
}

export type ShuttlePeriodRequest = {
    type: string,
    start: string,
    end: string,
}

export type ShuttleHolidayResponse = {
    seq: number,
    type: string,
    calendarType: string,
    date: string,
}

export type ShuttleHolidayRequest = {
    type: string,
    calendarType: string,
    date: string,
}

export type ShuttleRouteResponse = {
    name: string,
    tag: string,
    descriptionKorean: string,
    descriptionEnglish: string,
    startStopID: string,
    endStopID: string,
}

export type CreateShuttleRouteRequest = {
    name: string,
    tag: string,
    descriptionKorean: string,
    descriptionEnglish: string,
    startStopID: string,
    endStopID: string,
}

export type UpdateShuttleRouteRequest = {
    tag: string,
    descriptionKorean: string,
    descriptionEnglish: string,
    startStopID: string,
    endStopID: string,
}

export type ShuttleStopResponse = {
    name: string,
    latitude: number,
    longitude: number,
}

export type CreateShuttleStopRequest = {
    name: string,
    latitude: number,
    longitude: number,
}

export type UpdateShuttleStopRequest = {
    latitude: number,
    longitude: number,
}

export type ShuttleRouteStopResponse = {
    seq: number,
    name: string,
    order: number,
    cumulativeTime: string,
}

export type CreateRouteStopRequest = {
    stopName: string,
    order: number,
    cumulativeTime: string,
}

export type UpdateShuttleRouteStopRequest = {
    order: number,
    cumulativeTime: string,
}

export type ShuttleTimetableResponse = {
    seq: number,
    period: string,
    weekdays: boolean,
    route: string,
    departureTime: string,
}

export type CreateTimetableRequest = {
    period: string,
    weekdays: boolean,
    departureTime: string,
}

export type UpdateShuttleTimetableRequest = {
    period: string,
    weekdays: boolean,
    departureTime: string,
}

export const getShuttlePeriod = async () => {
    return await client.get('/api/v1/shuttle/period')
}

export const createShuttlePeriod = async (data: ShuttlePeriodRequest) => {
    return await client.post('/api/v1/shuttle/period', data)
}

export const updateShuttlePeriod = async (seq: number, data: ShuttlePeriodRequest) => {
    return await client.put(`/api/v1/shuttle/period/${seq}`, data)
}

export const deleteShuttlePeriod = async (seq: number) => {
    return await client.delete(`/api/v1/shuttle/period/${seq}`)
}

export const getShuttleHoliday = async () => {
    return await client.get('/api/v1/shuttle/holiday')
}

export const createShuttleHoliday = async (data: ShuttleHolidayRequest) => {
    return await client.post('/api/v1/shuttle/holiday', data)
}

export const updateShuttleHoliday = async (seq: number, data: ShuttleHolidayRequest) => {
    return await client.put(`/api/v1/shuttle/holiday/${seq}`, data)
}

export const deleteShuttleHoliday = async (seq: number) => {
    return await client.delete(`/api/v1/shuttle/holiday/${seq}`)
}

export const getShuttleRoute = async () => {
    return await client.get('/api/v1/shuttle/route')
}

export const createShuttleRoute = async (data: CreateShuttleRouteRequest) => {
    return await client.post('/api/v1/shuttle/route', data)
}

export const updateShuttleRoute = async (name: string, data: UpdateShuttleRouteRequest) => {
    return await client.put(`/api/v1/shuttle/route/${name}`, data)
}

export const deleteShuttleRoute = async (name: string) => {
    return await client.delete(`/api/v1/shuttle/route/${name}`)
}

export const getShuttleStop = async () => {
    return await client.get('/api/v1/shuttle/stop')
}

export const createShuttleStop = async (data: CreateShuttleStopRequest) => {
    return await client.post('/api/v1/shuttle/stop', data)
}

export const updateShuttleStop = async (name: string, data: UpdateShuttleStopRequest) => {
    return await client.put(`/api/v1/shuttle/stop/${name}`, data)
}

export const deleteShuttleStop = async (name: string) => {
    return await client.delete(`/api/v1/shuttle/stop/${name}`)
}

export const getShuttleRouteStop = async (routeName: string) => {
    return await client.get(`/api/v1/shuttle/route/${routeName}/stop`)
}

export const createShuttleRouteStop = async (routeName: string, data: CreateRouteStopRequest) => {
    return await client.post(`/api/v1/shuttle/route/${routeName}/stop`, data)
}

export const updateShuttleRouteStop = async (routeName: string, stopName: string, data: UpdateShuttleRouteStopRequest) => {
    return await client.put(`/api/v1/shuttle/route/${routeName}/stop/${stopName}`, data)
}

export const deleteShuttleRouteStop = async (routeName: string, stopName: string) => {
    return await client.delete(`/api/v1/shuttle/route/${routeName}/stop/${stopName}`)
}

export const getShuttleAllTimetable = async () => {
    return await client.get('/api/v1/shuttle/timetable')
}

export const getShuttleTimetable = async (routeName: string) => {
    return await client.get(`/api/v1/shuttle/route/${routeName}/timetable`)
}

export const createShuttleTimetable = async (routeName: string, data: CreateTimetableRequest) => {
    return await client.post(`/api/v1/shuttle/route/${routeName}/timetable`, data)
}

export const updateShuttleTimetable = async (routeName: string, seq: number, data: UpdateShuttleTimetableRequest) => {
    return await client.put(`/api/v1/shuttle/route/${routeName}/timetable/${seq}`, data)
}

export const deleteShuttleTimetable = async (routeName: string, seq: number) => {
    return await client.delete(`/api/v1/shuttle/route/${routeName}/timetable/${seq}`)
}
