import type { SvgIconComponent } from '@mui/icons-material'
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings'
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth'
import CampaignIcon from '@mui/icons-material/Campaign'
import ContactsIcon from '@mui/icons-material/Contacts'
import DepartureBoardIcon from '@mui/icons-material/DepartureBoard'
import DiningIcon from '@mui/icons-material/Dining'
import DirectionsBusIcon from '@mui/icons-material/DirectionsBus'
import DirectionsSubwayIcon from '@mui/icons-material/DirectionsSubway'
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks'
import SettingsIcon from '@mui/icons-material/Settings'
import type { ComponentType } from 'react'

import type { AdminPermission } from '../security/permissions.ts'
import { hasPermission } from '../security/permissions.ts'

export type PageLoader = () => Promise<{ default: ComponentType }>

export type NavigationItem = {
    label: string,
    path: string,
    permission: AdminPermission,
    icon: SvgIconComponent,
}

export type ChildRoute = {
    label: string,
    path: string,
    load: PageLoader,
}

export type ManagementSection = NavigationItem & {
    defaultPath: string,
    children: ChildRoute[],
}

export type StandaloneRoute = NavigationItem & {
    load: PageLoader,
}

export const managementSections: ManagementSection[] = [
    {
        label: '셔틀버스',
        path: '/shuttle',
        defaultPath: '/shuttle/period',
        permission: 'SHUTTLE',
        icon: DepartureBoardIcon,
        children: [
            { label: '운행 기간 관리', path: 'period', load: () => import('./pages/shuttle/period') },
            { label: '휴일 관리', path: 'holiday', load: () => import('./pages/shuttle/holiday') },
            { label: '노선 관리', path: 'route', load: () => import('./pages/shuttle/route') },
            { label: '정류장 관리', path: 'stop', load: () => import('./pages/shuttle/stop') },
            { label: '노선별 정류장 관리', path: 'routeStop', load: () => import('./pages/shuttle/routeStop') },
            { label: '시간표 관리', path: 'timetable', load: () => import('./pages/shuttle/timetable') },
            { label: '시간표 (뷰)', path: 'timetableView', load: () => import('./pages/shuttle/timetableView') },
        ],
    },
    {
        label: '노선버스',
        path: '/bus',
        defaultPath: '/bus/route',
        permission: 'BUS',
        icon: DirectionsBusIcon,
        children: [
            { label: '노선 관리', path: 'route', load: () => import('./pages/bus/route') },
            { label: '정류장 관리', path: 'stop', load: () => import('./pages/bus/stop') },
            { label: '노선별 정류장 관리', path: 'routeStop', load: () => import('./pages/bus/routeStop') },
            { label: '시간표 관리', path: 'timetable', load: () => import('./pages/bus/timetable') },
            { label: '실시간 도착 정보', path: 'realtime', load: () => import('./pages/bus/realtime') },
            { label: '도착 기록', path: 'log', load: () => import('./pages/bus/log') },
            { label: '공휴일 관리', path: 'holiday', load: () => import('./pages/bus/holiday') },
        ],
    },
    {
        label: '전철',
        path: '/subway',
        defaultPath: '/subway/station',
        permission: 'SUBWAY',
        icon: DirectionsSubwayIcon,
        children: [
            { label: '노선 관리', path: 'route', load: () => import('./pages/subway/route') },
            { label: '전철역 관리', path: 'station', load: () => import('./pages/subway/station') },
            { label: '시간표 관리', path: 'timetable', load: () => import('./pages/subway/timetable') },
            { label: '실시간 도착 정보', path: 'realtime', load: () => import('./pages/subway/realtime') },
            { label: '공휴일 관리', path: 'holiday', load: () => import('./pages/subway/holiday') },
        ],
    },
    {
        label: '학식',
        path: '/cafeteria',
        defaultPath: '/cafeteria/cafeteria',
        permission: 'CAFETERIA',
        icon: DiningIcon,
        children: [
            { label: '식당 관리', path: 'cafeteria', load: () => import('./pages/cafeteria/cafeteria') },
            { label: '메뉴 관리', path: 'menu', load: () => import('./pages/cafeteria/menu') },
        ],
    },
    {
        label: '열람실',
        path: '/readingRoom',
        defaultPath: '/readingRoom/room',
        permission: 'READING_ROOM',
        icon: LibraryBooksIcon,
        children: [
            { label: '열람실 관리', path: 'room', load: () => import('./pages/readingRoom/room') },
        ],
    },
    {
        label: '연락처',
        path: '/contact',
        defaultPath: '/contact/category',
        permission: 'CONTACT',
        icon: ContactsIcon,
        children: [
            { label: '분류 관리', path: 'category', load: () => import('./pages/contact/category') },
            { label: '서울캠퍼스', path: 'seoul', load: () => import('./pages/contact/seoul') },
            { label: 'ERICA 캠퍼스', path: 'erica', load: () => import('./pages/contact/erica') },
        ],
    },
    {
        label: '학사일정',
        path: '/calendar',
        defaultPath: '/calendar/category',
        permission: 'CALENDAR',
        icon: CalendarMonthIcon,
        children: [
            { label: '분류 관리', path: 'category', load: () => import('./pages/calendar/category') },
            { label: '학사 일정 관리', path: 'event', load: () => import('./pages/calendar/event') },
        ],
    },
    {
        label: '공지사항',
        path: '/notice',
        defaultPath: '/notice/category',
        permission: 'NOTICE',
        icon: CampaignIcon,
        children: [
            { label: '분류 관리', path: 'category', load: () => import('./pages/notice/category') },
            { label: '공지사항 관리', path: 'notice', load: () => import('./pages/notice/notice') },
        ],
    },
]

export const standaloneRoutes: StandaloneRoute[] = [
    {
        label: '설정',
        path: '/settings',
        permission: 'BUS',
        icon: SettingsIcon,
        load: () => import('./pages/settings'),
    },
    {
        label: '사용자 및 권한',
        path: '/admin/users',
        permission: 'SUPER_ADMIN',
        icon: AdminPanelSettingsIcon,
        load: () => import('./pages/admin/users.tsx'),
    },
]

export const navigationItems: NavigationItem[] = [
    ...managementSections,
    ...standaloneRoutes,
]

export const firstAllowedPath = (permissions: ReadonlyArray<AdminPermission>) => {
    const section = managementSections.find(({ permission }) => hasPermission(permissions, permission))
    if (section) return section.defaultPath

    const standaloneRoute = standaloneRoutes.find(({ permission }) => hasPermission(permissions, permission))
    return standaloneRoute?.path ?? '/access-denied'
}
