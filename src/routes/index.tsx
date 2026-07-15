import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom'

import AccessDenied from './pages/accessDenied.tsx'
import AdminUsers from './pages/admin/users.tsx'
import Bus from './pages/bus'
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
import Home from './pages/home.tsx'
import Login from './pages/login.tsx'
import Notice from './pages/notice'
import NoticeCategoryPage from './pages/notice/category'
import NoticePage from './pages/notice/notice'
import ReadingRoom from './pages/readingRoom'
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
import { PermissionLanding, PermissionRoute } from './permissionRoute.tsx'

const appRouter = createBrowserRouter([
    { path: '*', element: <Navigate replace to="/" /> },
    {
        path: '/',
        element: <Home />,
        children: [
            { path: 'shuttle', element: <PermissionRoute permission='SHUTTLE'><Shuttle /></PermissionRoute>, children: [
                { path: 'period', element: <Period /> },
                { path: 'holiday', element: <Holiday /> },
                { path: 'route', element: <ShuttleRoute /> },
                { path: 'stop', element: <ShuttleStop /> },
                { path: 'routeStop', element: <ShuttleRouteStop /> },
                { path: 'timetable', element: <ShuttleTimetable /> },
                { path: 'timetableView', element: <ShuttleTimetableView /> },
                { path: '*', element: <Navigate replace to="/shuttle/period" /> },
            ] },
            { path: 'bus', element: <PermissionRoute permission='BUS'><Bus /></PermissionRoute>, children: [
                { path: 'route', element: <BusRoute /> },
                { path: 'stop', element: <BusStop /> },
                { path: 'routeStop', element: <BusRouteStop /> },
                { path: 'timetable', element: <BusTimetable /> },
                { path: 'realtime', element: <BusRealtime /> },
                { path: 'log', element: <BusDepartureLog /> },
                { path: 'holiday', element: <BusHolidayPage /> },
                { path: '*', element: <Navigate replace to="/bus/route" /> },
            ] },
            { path: 'subway', element: <PermissionRoute permission='SUBWAY'><Subway /></PermissionRoute>, children: [
                { path: 'station', element: <SubwayStationPage /> },
                { path: 'route', element: <SubwayRoutePage /> },
                { path: 'timetable', element: <SubwayTimetablePage /> },
                { path: 'realtime', element: <SubwayRealtimePage /> },
                { path: 'holiday', element: <SubwayHolidayPage /> },
            ] },
            { path: 'cafeteria', element: <PermissionRoute permission='CAFETERIA'><Cafeteria /></PermissionRoute>, children: [
                { path: 'cafeteria', element: <CafeteriaPage />  },
                { path: 'menu', element: <CafeteriaMenuPage />  },
            ] },
            { path: 'readingRoom', element: <PermissionRoute permission='READING_ROOM'><ReadingRoom /></PermissionRoute>, children: [
                { path: 'room', element: <ReadingRoomPage /> },
            ] },
            { path: 'contact', element: <PermissionRoute permission='CONTACT'><Contact /></PermissionRoute>, children: [
                { path: 'category', element: <ContactCategoryPage /> },
                { path: 'seoul', element: <SeoulContactPage /> },
                { path: 'erica', element: <ERICAContactPage /> },
            ] },
            { path: 'calendar', element: <PermissionRoute permission='CALENDAR'><Calendar /></PermissionRoute>, children: [
                { path: 'category', element: <CalendarCategoryPage /> },
                { path: 'event', element: <CalendarEventPage /> }
            ] },
            { path: 'notice', element: <PermissionRoute permission='NOTICE'><Notice /></PermissionRoute>, children: [
                { path: 'category', element: <NoticeCategoryPage /> },
                { path: 'notice', element: <NoticePage /> },
            ] },
            { path: 'settings', element: <PermissionRoute permission='BUS'><Settings /></PermissionRoute> },
            { path: 'admin/users', element: <PermissionRoute permission='SUPER_ADMIN'><AdminUsers /></PermissionRoute> },
            { path: 'access-denied', element: <AccessDenied /> },
            { index: true, element: <PermissionLanding /> },
            { path: '*', element: <PermissionLanding /> },
        ]
    },
    { path: '/login', element: <Login /> },
])

export default function AppRouter() {
    return <RouterProvider router={appRouter} />
}
