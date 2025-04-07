import client from "./client.ts"

export type ReadingRoomResponse = {
    id: number,
    name: string,
    total: number,
    active: number,
    available: number,
    occupied: number,
    updatedAt: string,
}


export const getReadingRoomList = async ()=> {
    return await client.get('/api/library')
}
