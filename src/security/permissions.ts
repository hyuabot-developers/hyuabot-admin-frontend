export const ADMIN_PERMISSIONS = [
    'SUPER_ADMIN',
    'SHUTTLE',
    'BUS',
    'SUBWAY',
    'CAFETERIA',
    'READING_ROOM',
    'CONTACT',
    'CALENDAR',
    'NOTICE',
] as const

export type AdminPermission = typeof ADMIN_PERMISSIONS[number]

export const MANAGEMENT_PERMISSIONS: ReadonlyArray<{
    value: Exclude<AdminPermission, 'SUPER_ADMIN'>,
    label: string,
}> = [
    { value: 'SHUTTLE', label: '셔틀버스' },
    { value: 'BUS', label: '노선버스' },
    { value: 'SUBWAY', label: '전철' },
    { value: 'CAFETERIA', label: '학식' },
    { value: 'READING_ROOM', label: '열람실' },
    { value: 'CONTACT', label: '연락처' },
    { value: 'CALENDAR', label: '학사일정' },
    { value: 'NOTICE', label: '공지사항' },
]

export const hasPermission = (
    permissions: ReadonlyArray<AdminPermission>,
    permission: AdminPermission,
) => permissions.includes('SUPER_ADMIN') || permissions.includes(permission)
