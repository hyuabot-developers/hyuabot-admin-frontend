import client from "./client.ts"

export type ShuttlePeriodResponse = {
    type: string,
    start: string,
    end: string,
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