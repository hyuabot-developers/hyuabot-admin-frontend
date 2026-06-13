import client from './index.ts'

export type PublicHolidayResponse = {
    seq: number,
    name: string,
    calendarType: string,
    date: string,
}

export type PublicHolidayRequest = {
    name: string,
    calendarType: string,
    date: string,
}

export const getPublicHoliday = async () => {
    return await client.get('/api/v1/holiday')
}

export const createPublicHoliday = async (data: PublicHolidayRequest) => {
    return await client.post('/api/v1/holiday', data)
}

export const updatePublicHoliday = async (seq: number, data: PublicHolidayRequest) => {
    return await client.put(`/api/v1/holiday/${seq}`, data)
}

export const deletePublicHoliday = async (seq: number) => {
    return await client.delete(`/api/v1/holiday/${seq}`)
}
