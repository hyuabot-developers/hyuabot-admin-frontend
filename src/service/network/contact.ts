import client from './client.ts'

export type ContactCategoryResponse = {
    seq: number,
    name: string,
}

export type ContactResponse = {
    seq: number,
    name: string,
    phone: string,
    campusID: number,
    categoryID: number,
}

export type ContactRequest = {
    name: string,
    phone: string,
    categoryID: number,
    campusID: number,
}


export const getContactCategoryList = async () => {
    return await client.get('/api/v1/contact/category')
}

export const createContactCategory = async (name: string) => {
    return await client.post('/api/v1/contact/category', {
        name,
    })
}

export const deleteContactCategory = async (seq: number) => {
    return await client.delete(`/api/v1/contact/category/${seq}`)
}

export const getContactList = async (campusID: number) => {
    return await client.get(`/api/v1/contact/contact?campusID=${campusID}`)
}

export const createContact = async (contact: ContactRequest) => {
    return await client.post('/api/v1/contact/contact', contact)
}

export const updateContact = async (seq: number, contact: ContactRequest) => {
    return await client.put(`/api/v1/contact/contact/${seq}`, contact)
}

export const deleteContact = async (seq: number) => {
    return await client.delete(`/api/v1/contact/contact/${seq}`)
}
