import client from './client.ts'

export type CafeteriaResponse = {
    seq: number,
    campusID: number,
    name: string,
    latitude: number,
    longitude: number,
    breakfastTime: string | null,
    lunchTime: string | null,
    dinnerTime: string | null,
}

export type CreateCafeteriaRequest = {
    id: number,
    campusID: number,
    name: string,
    latitude: number,
    longitude: number,
    breakfastTime: string | null,
    lunchTime: string | null,
    dinnerTime: string | null,
}

export type UpdateCafeteriaRequest = {
    campusID: number,
    name: string,
    latitude: number,
    longitude: number,
    breakfastTime: string | null,
    lunchTime: string | null,
    dinnerTime: string | null,
}

export type MenuResponse = {
    seq: number,
    cafeteriaID: number,
    date: string,
    type: string,
    food: string,
    price: string,
}

export type CafeteriaMenuRequest = {
    date: string,
    type: string,
    food: string,
    price: string,
}

export const getCafeteriaList = async ()=> {
    return await client.get('/api/v1/cafeteria')
}

export const createCafeteria = async (data: CreateCafeteriaRequest) => {
    return await client.post('/api/v1/cafeteria', data)
}

export const updateCafeteria = async (id: number, data: UpdateCafeteriaRequest) => {
    return await client.put(`/api/v1/cafeteria/${id}`, data)
}

export const deleteCafeteria = async (id: number) => {
    return await client.delete(`/api/v1/cafeteria/${id}`)
}

export const getCafeteriaMenuList = async (id: number)=> {
    return await client.get(`/api/v1/cafeteria/${id}/menu`)
}

export const createCafeteriaMenu = async (cafeteriaID: number, data: CafeteriaMenuRequest) => {
    return await client.post(`/api/v1/cafeteria/${cafeteriaID}/menu`, data)
}

export const updateCafeteriaMenu = async (cafeteriaID: number, seq: number, data: CafeteriaMenuRequest) => {
    return await client.put(`/api/v1/cafeteria/${cafeteriaID}/menu/${seq}`, data)
}

export const deleteCafeteriaMenu = async (cafeteriaID: number, seq: number) => {
    return await client.delete(`/api/v1/cafeteria/${cafeteriaID}/menu/${seq}`)
}
