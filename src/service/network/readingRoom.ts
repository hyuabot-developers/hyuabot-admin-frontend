import client from './client.ts'

export type ReadingRoomResponse = {
    seq: number,
    name: string,
    campusID: number,
    isActive: boolean,
    isReservable: boolean,
    total: number,
    active: number,
    occupied: number,
    available: number,
    updatedAt: string,
}

export type CreateReadingRoomRequest = {
    id: number,
    campusID: number,
    name: string,
    total: number,
}

export type UpdateReadingRoomRequest = {
    campusID: number,
    name: string,
    total: number,
    active: number,
    isActive: boolean,
    isReservable: boolean,
}


export const getReadingRoomList = async ()=> {
    return await client.get('/api/v1/reading-room')
}

export const createReadingRoom = async (data: CreateReadingRoomRequest) => {
    return await client.post('/api/v1/reading-room', data)
}

export const updateReadingRoom = async (seq: number, data: UpdateReadingRoomRequest) => {
    return await client.put(`/api/v1/reading-room/${seq}`, data)
}

export const deleteReadingRoom = async (seq: number) => {
    return await client.delete(`/api/v1/reading-room/${seq}`)
}
