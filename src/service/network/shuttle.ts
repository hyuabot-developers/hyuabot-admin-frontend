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