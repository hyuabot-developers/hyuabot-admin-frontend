import client from './client.ts'

export type AdminServiceStatus = {
    id: string,
    title: string,
    status: 'NORMAL' | 'WARNING' | 'ERROR' | 'UNKNOWN',
    message: string,
    lastSuccessAt: string | null,
    lastFailureAt: string | null,
    managementPath: string,
}

export type AdminOverview = {
    checkedAt: string,
    services: AdminServiceStatus[],
    expiringInvitationCount: number | null,
    grafanaURL: string,
}

export const getAdminOverview = async () => client.get<AdminOverview>('/api/v1/user/overview')
