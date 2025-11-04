import client from './client.ts'

export type CampusResponse = {
    seq: number,
    name: string,
}

export const getCampusList = async ()=> {
    return await client.get('/api/v1/campus')
}
