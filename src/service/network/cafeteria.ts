import client from "./client.ts"

export type CafeteriaRunningTimeResponse = {
    breakfast: string,
    lunch: string,
    dinner: string,
}

export type CafeteriaResponse = {
    id: string,
    name: string,
    campusID: number,
    latitude: number,
    longitude: number,
    runningTime: CafeteriaRunningTimeResponse,
}

export type CafeteriaMenuResponse = {
    cafeteriaID: number,
    date: string,
    time: string,
    menu: string,
    price: number,
}

export type CreateCafeteriaRequest = {
    id: number,
    name: string,
    campusID: number,
    latitude: number,
    longitude: number,
    breakfast: string,
    lunch: string,
    dinner: string,
}

export type UpdateCafeteriaRequest = {
    name: string,
    latitude: number,
    longitude: number,
    breakfast: string,
    lunch: string,
    dinner: string,
}

export type CreateCafeteriaMenuRequest = {
    date: string,
    time: string,
    menu: string,
    price: string,
}

export type UpdateCafeteriaMenuResponse = {
    price: string,
}

export const getCafeteriaList = async ()=> {
    return await client.get('/api/cafeteria/cafeteria')
}

export const createCafeteria = async (data: CreateCafeteriaRequest) => {
    return await client.post('/api/cafeteria/cafeteria', data)
}

export const updateCafeteria = async (id: number, data: UpdateCafeteriaRequest) => {
    return await client.put(`/api/cafeteria/cafeteria/${id}`, data)
}

export const deleteCafeteria = async (id: number) => {
    return await client.delete(`/api/cafeteria/cafeteria/${id}`)
}

export const getCafeteriaMenuList = async ()=> {
    return await client.get(`/api/cafeteria/menu`)
}

export const createCafeteriaMenu = async (id: number, data: CreateCafeteriaMenuRequest) => {
    return await client.post(`/api/cafeteria/cafeteria/${id}/menu`, data)
}

export const updateCafeteriaMenu = async (id: number, date: string, time: string, menu: string, data: UpdateCafeteriaRequest) => {
    return await client.put(`/api/cafeteria/cafeteria/${id}/${date}/${time}/${menu}`, data)
}

export const deleteCafeteriaMenu = async (id: number, date: string, time: string, menu: string) => {
    return await client.delete(`/api/cafeteria/cafeteria/${id}/${date}/${time}/${menu}`)
}
