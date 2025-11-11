import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom'

import Bus from './pages/bus'
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
import ReadingRoom from './pages/readingRoom'
import ReadingRoomPage from './pages/readingRoom/room'
import Shuttle from './pages/shuttle'
import Holiday from './pages/shuttle/holiday'
import Period from './pages/shuttle/period'
import ShuttleRoute from './pages/shuttle/route'
import ShuttleRouteStop from './pages/shuttle/routeStop'
import ShuttleStop from './pages/shuttle/stop'
import ShuttleTimetable from './pages/shuttle/timetable'
import ShuttleTimetableView from './pages/shuttle/timetableView'
import Subway from './pages/subway'
import SubwayRealtimePage from './pages/subway/realtime'
import SubwayRoutePage from './pages/subway/route'
import SubwayStationPage from './pages/subway/station'
import SubwayTimetablePage from './pages/subway/timetable'

const appRouter = createBrowserRouter([
    { path: '*', element: <Navigate replace to="/" /> },
    {
        path: '/',
        element: <Home />,
        children: [
            { path: 'shuttle', element: <Shuttle />, children: [
                { path: 'period', element: <Period /> },
                { path: 'holiday', element: <Holiday /> },
                { path: 'route', element: <ShuttleRoute /> },
                { path: 'stop', element: <ShuttleStop /> },
                { path: 'routeStop', element: <ShuttleRouteStop /> },
                { path: 'timetable', element: <ShuttleTimetable /> },
                { path: 'timetableView', element: <ShuttleTimetableView /> },
                { path: '*', element: <Navigate replace to="/shuttle/period" /> },
            ] },
            { path: 'bus', element: <Bus />, children: [
                { path: 'route', element: <BusRoute /> },
                { path: 'stop', element: <BusStop /> },
                { path: 'routeStop', element: <BusRouteStop /> },
                { path: 'timetable', element: <BusTimetable /> },
                { path: 'realtime', element: <BusRealtime /> },
                { path: 'log', element: <BusDepartureLog /> },
                { path: '*', element: <Navigate replace to="/bus/route" /> },
            ] },
            { path: 'subway', element: <Subway />, children: [
                { path: 'station', element: <SubwayStationPage /> },
                { path: 'route', element: <SubwayRoutePage /> },
                { path: 'timetable', element: <SubwayTimetablePage /> },
                { path: 'realtime', element: <SubwayRealtimePage /> },
            ] },
            { path: 'cafeteria', element: <Cafeteria />, children: [
                { path: 'cafeteria', element: <CafeteriaPage />  },
                { path: 'menu', element: <CafeteriaMenuPage />  },
            ] },
            { path: 'readingRoom', element: <ReadingRoom />, children: [
                { path: 'room', element: <ReadingRoomPage /> },
            ] },
            { path: 'contact', element: <Contact />, children: [
                { path: 'category', element: <ContactCategoryPage /> },
                { path: 'seoul', element: <SeoulContactPage /> },
                { path: 'erica', element: <ERICAContactPage /> },
            ] },
            { path: 'calendar', element: <Calendar />, children: [
                { path: 'category', element: <CalendarCategoryPage /> },
                { path: 'event', element: <CalendarEventPage /> }
            ] },
            { path: '/', element: <Navigate replace to="/shuttle/period" /> },
            { path: '*', element: <Navigate replace to="/shuttle/period" /> },
        ]
    },
    { path: '/login', element: <Login /> },
])

export default function AppRouter() {
    return <RouterProvider router={appRouter} />
}
