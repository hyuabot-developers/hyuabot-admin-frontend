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

import AdminUsers from './pages/admin/users.tsx'
import Bus from './pages/bus'
import type { AdminPermission } from '../security/permissions.ts'
import BusHolidayPage from './pages/bus/holiday'
import BusDepartureLog from './pages/bus/log'
import BusRealtime from './pages/bus/realtime'
import BusRoute from './pages/bus/route'
import BusRouteStop from './pages/bus/routeStop'
import BusStop from './pages/bus/stop'
import BusTimetable from './pages/bus/timetable'
import Cafeteria from './pages/cafeteria'
import CafeteriaPage from './pages/cafeteria/cafeteria'
import CafeteriaMenuPage from './pages/cafeteria/menu'
import Calendar from './pages/calendar'
import CalendarCategoryPage from './pages/calendar/category'
import CalendarEventPage from './pages/calendar/event'
import Contact from './pages/contact'
import ContactCategoryPage from './pages/contact/category'
import ERICAContactPage from './pages/contact/erica'
import SeoulContactPage from './pages/contact/seoul'
import Notice from './pages/notice'
import NoticeCategoryPage from './pages/notice/category'
import NoticePage from './pages/notice/notice'
import ReadingRoom from './pages/readingRoom'
import { hasPermission } from '../security/permissions.ts'
import ReadingRoomPage from './pages/readingRoom/room'
import Settings from './pages/settings/index.tsx'
import Shuttle from './pages/shuttle'
import Holiday from './pages/shuttle/holiday'
import Period from './pages/shuttle/period'
import ShuttleRoute from './pages/shuttle/route'
import ShuttleRouteStop from './pages/shuttle/routeStop'
import ShuttleStop from './pages/shuttle/stop'
import ShuttleTimetable from './pages/shuttle/timetable'
import ShuttleTimetableView from './pages/shuttle/timetableView'
import Subway from './pages/subway'
import SubwayHolidayPage from './pages/subway/holiday'
import SubwayRealtimePage from './pages/subway/realtime'
import SubwayRoutePage from './pages/subway/route'
import SubwayStationPage from './pages/subway/station'
import SubwayTimetablePage from './pages/subway/timetable'

export type NavigationItem = {
    label: string,
    path: string,
    permission: AdminPermission,
    icon: SvgIconComponent,
}

export type ChildRoute = {
    path: string,
    Component: ComponentType,
}

export type ManagementSection = NavigationItem & {
    defaultPath: string,
    Layout: ComponentType,
    children: ChildRoute[],
}

export type StandaloneRoute = NavigationItem & {
    Component: ComponentType,
}

export const managementSections: ManagementSection[] = [
    {
        label: '셔틀버스',
        path: '/shuttle',
        defaultPath: '/shuttle/period',
        permission: 'SHUTTLE',
        icon: DepartureBoardIcon,
        Layout: Shuttle,
        children: [
            { path: 'period', Component: Period },
            { path: 'holiday', Component: Holiday },
            { path: 'route', Component: ShuttleRoute },
            { path: 'stop', Component: ShuttleStop },
            { path: 'routeStop', Component: ShuttleRouteStop },
            { path: 'timetable', Component: ShuttleTimetable },
            { path: 'timetableView', Component: ShuttleTimetableView },
        ],
    },
    {
        label: '노선버스',
        path: '/bus',
        defaultPath: '/bus/route',
        permission: 'BUS',
        icon: DirectionsBusIcon,
        Layout: Bus,
        children: [
            { path: 'route', Component: BusRoute },
            { path: 'stop', Component: BusStop },
            { path: 'routeStop', Component: BusRouteStop },
            { path: 'timetable', Component: BusTimetable },
            { path: 'realtime', Component: BusRealtime },
            { path: 'log', Component: BusDepartureLog },
            { path: 'holiday', Component: BusHolidayPage },
        ],
    },
    {
        label: '전철',
        path: '/subway',
        defaultPath: '/subway/station',
        permission: 'SUBWAY',
        icon: DirectionsSubwayIcon,
        Layout: Subway,
        children: [
            { path: 'station', Component: SubwayStationPage },
            { path: 'route', Component: SubwayRoutePage },
            { path: 'timetable', Component: SubwayTimetablePage },
            { path: 'realtime', Component: SubwayRealtimePage },
            { path: 'holiday', Component: SubwayHolidayPage },
        ],
    },
    {
        label: '학식',
        path: '/cafeteria',
        defaultPath: '/cafeteria/cafeteria',
        permission: 'CAFETERIA',
        icon: DiningIcon,
        Layout: Cafeteria,
        children: [
            { path: 'cafeteria', Component: CafeteriaPage },
            { path: 'menu', Component: CafeteriaMenuPage },
        ],
    },
    {
        label: '열람실',
        path: '/readingRoom',
        defaultPath: '/readingRoom/room',
        permission: 'READING_ROOM',
        icon: LibraryBooksIcon,
        Layout: ReadingRoom,
        children: [
            { path: 'room', Component: ReadingRoomPage },
        ],
    },
    {
        label: '연락처',
        path: '/contact',
        defaultPath: '/contact/category',
        permission: 'CONTACT',
        icon: ContactsIcon,
        Layout: Contact,
        children: [
            { path: 'category', Component: ContactCategoryPage },
            { path: 'seoul', Component: SeoulContactPage },
            { path: 'erica', Component: ERICAContactPage },
        ],
    },
    {
        label: '학사일정',
        path: '/calendar',
        defaultPath: '/calendar/category',
        permission: 'CALENDAR',
        icon: CalendarMonthIcon,
        Layout: Calendar,
        children: [
            { path: 'category', Component: CalendarCategoryPage },
            { path: 'event', Component: CalendarEventPage },
        ],
    },
    {
        label: '공지사항',
        path: '/notice',
        defaultPath: '/notice/category',
        permission: 'NOTICE',
        icon: CampaignIcon,
        Layout: Notice,
        children: [
            { path: 'category', Component: NoticeCategoryPage },
            { path: 'notice', Component: NoticePage },
        ],
    },
]

export const standaloneRoutes: StandaloneRoute[] = [
    {
        label: '설정',
        path: '/settings',
        permission: 'BUS',
        icon: SettingsIcon,
        Component: Settings,
    },
    {
        label: '사용자 및 권한',
        path: '/admin/users',
        permission: 'SUPER_ADMIN',
        icon: AdminPanelSettingsIcon,
        Component: AdminUsers,
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
