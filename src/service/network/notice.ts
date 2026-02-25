import client from './client.ts'

export type NoticeCategoryResponse = {
    seq: number,
    name: string,
}

export type NoticeResponse = {
    seq: number,
    categoryID: number,
    title: string,
    url: string | null,
    expiredAt: string | null,
    userID: string,
    language: string,
}

export type NoticeRequest = {
    categoryID: number,
    title: string,
    url: string,
    expiredAt: string | null,
    language: string,
}

export const getNoticeCategoryList = async () => {
    return await client.get('/api/v1/notice/category')
}

export const createNoticeCategory = async (name: string) => {
    return await client.post('/api/v1/notice/category', {
        name,
    })
}

export const updateNoticeCategory = async (seq: number, name: string) => {
    return await client.put(`/api/v1/notice/category/${seq}`, {
        name,
    })
}

export const deleteNoticeCategory = async (seq: number) => {
    return await client.delete(`/api/v1/notice/category/${seq}`)
}

export const getNoticeList = async () => {
    return await client.get('/api/v1/notice/notices')
}

export const createNotice = async (notice: NoticeRequest) => {
    return await client.post('/api/v1/notice/notices', notice)
}

export const updateNotice = async (seq: number, notice: NoticeRequest) => {
    return await client.put(`/api/v1/notice/notices/${seq}`, notice)
}

export const deleteNotice = async (seq: number) => {
    return await client.delete(`/api/v1/notice/notices/${seq}`)
}
