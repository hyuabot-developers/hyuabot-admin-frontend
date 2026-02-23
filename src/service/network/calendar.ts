import client from './client.ts'

export type CalendarCategoryResponse = {
    seq: number,
    name: string,
}

export type CalendarResponse = {
    seq: number,
    categoryID: number,
    title: string,
    description: string,
    start: string,
    end: string,
}

export type CalendarRequest = {
    categoryID: number,
    title: string,
    description: string,
    start: string,
    end: string,
}

export const getCalendarCategoryList = async () => {
    return await client.get('/api/v1/calendar/category')
}

export const createCalendarCategory = async (name: string) => {
    return await client.post('/api/v1/calendar/category', {
        name,
    })
}

export const updateCalendarCategory = async (seq: number, name: string) => {
    return await client.put(`/api/v1/calendar/category/${seq}`, {
        name,
    })
}

export const deleteCalendarCategory = async (seq: number) => {
    return await client.delete(`/api/v1/calendar/category/${seq}`)
}

export const getCalendarList = async () => {
    return await client.get('/api/v1/calendar/events')
}

export const createCalendar = async (calendar: CalendarRequest) => {
    return await client.post('/api/v1/calendar/events', calendar)
}

export const updateCalendar = async (seq: number, calendar: CalendarRequest) => {
    return await client.put(`/api/v1/calendar/events/${seq}`, calendar)
}

export const deleteCalendar = async (seq: number) => {
    return await client.delete(`/api/v1/calendar/events/${seq}`)
}
