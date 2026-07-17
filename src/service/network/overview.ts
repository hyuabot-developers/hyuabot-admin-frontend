import client from './client.ts'

export type AdminServiceStatus = {
    id: string
    title: string
    status: 'NORMAL' | 'WARNING' | 'ERROR' | 'UNKNOWN'
    message: string
    lastSuccessAt: string | null
    lastFailureAt: string | null
    managementPath: string
}

export type AdminOverview = {
    checkedAt: string
    services: AdminServiceStatus[]
    expiringInvitationCount: number | null
    grafanaURL: string
}

export const getAdminOverview = async () =>
    client.get<AdminOverview>('/api/v1/user/overview')

export type HolidayAuditIssue = {
    code: string
    service: 'holiday' | 'shuttle' | 'bus' | 'subway'
    date: string | null
    message: string
    severity: 'WARNING' | 'ERROR'
    managementPath: string
}

export type HolidayAudit = {
    checkedAt: string
    lastSuccessAt: string | null
    issues: HolidayAuditIssue[]
}

export const getHolidayAudit = async () =>
    client.get<HolidayAudit>('/api/v1/user/overview/holiday-audit')
