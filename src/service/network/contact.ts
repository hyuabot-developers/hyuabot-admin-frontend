import client from "./client.ts"

export type ContactCategoryResponse = {
    id: number,
    name: string,
}

export type ContactResponse = {
    id: number,
    name: string,
    phone: string,
    campusID: number,
    categoryID: number,
}

export type CreateContactRequest = {
    name: string,
    phone: string,
    campusID: number,
}

export type UpdateContactRequest = {
    name: string,
    phone: string,
    campusID: number,
}


export const getContactCategoryList = async () => {
    return await client.get('/api/contact/category')
}

export const createContactCategory = async (name: string) => {
    return await client.post('/api/contact/category', {
        name,
    })
}

export const deleteContactCategory = async (id: number) => {
    return await client.delete(`/api/contact/category/${id}`)
}

export const getContactList = async (campusID: number) => {
    return await client.get(`/api/contact/contacts?campusID=${campusID}`)
}

export const createContact = async (categoryID: number, contact: CreateContactRequest) => {
    return await client.post(`/api/contact/category/${categoryID}/contacts`, contact)
}

export const updateContact = async (categoryID: number, contactID: number, contact: UpdateContactRequest) => {
    return await client.put(`/contact/category/${categoryID}/contacts/${contactID}`, contact)
}

export const deleteContact = async (categoryID: number, contactID: number) => {
    return await client.delete(`/contact/category/${categoryID}/contacts/${contactID}`)
}
