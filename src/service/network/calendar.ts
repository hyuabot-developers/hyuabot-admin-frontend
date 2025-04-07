import client from "./client.ts"

export type CalendarCategoryResponse = {
    id: number,
    name: string,
}

export type CalendarResponse = {
    id: number,
    categoryID: number,
    title: string,
    description: string,
    start: string,
    end: string,
}

export type CreateUpdateCategoryRequest = {
    name: string,
}

export type CreateCalendarRequest = {
    title: string,
    description: string,
    start: string,
    end: string,
}

export type UpdateCalendarRequest = {
    title: string,
    description: string,
    start: string,
    end: string,
}

export const getCalendarCategoryList = async () => {
    return await client.get('/api/calendar/category')
}

export const createCalendarCategory = async (name: string) => {
    return await client.post('/api/calendar/category', {
        name,
    })
}

export const updateCalendarCategory = async (id: number, name: string) => {
    return await client.put(`/api/calendar/category/${id}`, {
        name,
    })
}

export const deleteCalendarCategory = async (id: number) => {
    return await client.delete(`/api/calendar/category/${id}`)
}

export const getCalendarList = async () => {
    return await client.get('/api/calendar/event')
}

export const createCalendar = async (categoryID: number, calendar: CreateCalendarRequest) => {
    return await client.post(`/api/calendar/category/${categoryID}/event`, calendar)
}

export const updateCalendar = async (categoryID: number, calendarID: number, calendar: UpdateCalendarRequest) => {
    return await client.put(`/api/calendar/category/${categoryID}/event/${calendarID}`, calendar)
}

export const deleteCalendar = async (categoryID: number, calendarID: number) => {
    return await client.delete(`/api/calendar/category/${categoryID}/event/${calendarID}`)
}
