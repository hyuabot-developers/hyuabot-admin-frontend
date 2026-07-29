import client from './client.ts'

export type InquirySenderType = 'USER' | 'ADMIN' | 'SYSTEM'
export type InquiryThreadStatus = 'OPEN' | 'PENDING'

export type AdminInquiryThread = {
    id: string,
    installationId: string,
    platform: string,
    status: InquiryThreadStatus,
    subject: string | null,
    contactEmail: string | null,
    entryScreen: string | null,
    entryScreenName: string | null,
    assignedAdminUserId: string | null,
    lastMessageAt: string | null,
    createdAt: string,
}

export type InquiryMessage = {
    id: number,
    senderType: InquirySenderType,
    body: string,
    readAt: string | null,
    createdAt: string,
}

export const getInquiryThreads = async (assigned: boolean) =>
    client.get<{ result: AdminInquiryThread[] }>('/api/v1/inquiry/admin/threads', {
        params: { assigned },
    })

export const getInquiryThread = async (id: string) =>
    client.get<AdminInquiryThread>(`/api/v1/inquiry/admin/threads/${id}`)

export const getInquiryMessages = async (id: string) =>
    client.get<{ result: InquiryMessage[] }>(`/api/v1/inquiry/admin/threads/${id}/messages`)

export const replyInquiry = async (id: string, body: string) =>
    client.post<InquiryMessage>(`/api/v1/inquiry/admin/threads/${id}/messages`, { body })

export const markInquiryRead = async (id: string) =>
    client.post(`/api/v1/inquiry/admin/threads/${id}/read`)

export const updateInquiryThread = async (
    id: string,
    data: { status?: InquiryThreadStatus, assignedAdminUserId?: string },
) =>
    client.patch<AdminInquiryThread>(`/api/v1/inquiry/admin/threads/${id}`, data)

export const closeInquiryThread = async (id: string) =>
    client.delete(`/api/v1/inquiry/admin/threads/${id}`)
