import client from "./client.ts"

export type CampusResponse = {
    id: number,
    name: string,
}

export const getCampusList = async ()=> {
    return await client.get('/api/campus')
}
