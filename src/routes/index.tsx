import { createBrowserRouter, Navigate, RouterProvider } from "react-router-dom"
import Home from "./pages/home.tsx"
import Login from "./pages/login.tsx"
import Shuttle from "./pages/shuttle"
import Period from "./pages/shuttle/period"
import Holiday from "./pages/shuttle/holiday"
import ShuttleRoute from "./pages/shuttle/route"
import ShuttleStop from "./pages/shuttle/stop"
import ShuttleRouteStop from "./pages/shuttle/routeStop"
import ShuttleTimetable from "./pages/shuttle/timetable"
import Bus from "./pages/bus"
import BusRoute from "./pages/bus/route"
import BusStop from "./pages/bus/stop"
import BusRealtime from "./pages/bus/realtime"
import BusRouteStop from "./pages/bus/routeStop"
import BusTimetable from "./pages/bus/timetable"
import Subway from "./pages/subway"
import SubwayRealtimePage from "./pages/subway/realtime"
import SubwayStationNamePage from "./pages/subway/stationName"
import SubwayRoutePage from "./pages/subway/route"
import SubwayStationPage from "./pages/subway/station"
import SubwayTimetablePage from "./pages/subway/timetable"
import Cafeteria from "./pages/cafeteria"
import CafeteriaPage from "./pages/cafeteria/cafeteria"
import CafeteriaMenuPage from "./pages/cafeteria/menu"
import ReadingRoom from "./pages/readingRoom"
import ReadingRoomPage from "./pages/readingRoom/room"
import Contact from "./pages/contact"
import ContactCategoryPage from "./pages/contact/category"

const appRouter = createBrowserRouter([
    { path: '*', element: <Navigate replace to={'/'} /> },
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
                { path: '*', element: <Navigate replace to={'/shuttle/period'} /> },
            ]},
            { path: 'bus', element: <Bus />, children: [
                { path: 'route', element: <BusRoute /> },
                { path: 'stop', element: <BusStop /> },
                { path: 'routeStop', element: <BusRouteStop /> },
                { path: 'timetable', element: <BusTimetable /> },
                { path: 'realtime', element: <BusRealtime /> },
                { path: '*', element: <Navigate replace to={'/bus/route'} /> },
            ]},
            { path: 'subway', element: <Subway />, children: [
                { path: 'station-name', element: <SubwayStationNamePage /> },
                { path: 'station', element: <SubwayStationPage /> },
                { path: 'route', element: <SubwayRoutePage /> },
                { path: 'timetable', element: <SubwayTimetablePage /> },
                { path: 'realtime', element: <SubwayRealtimePage /> },
            ]},
            { path: 'cafeteria', element: <Cafeteria />, children: [
                { path: 'cafeteria', element: <CafeteriaPage />  },
                { path: 'menu', element: <CafeteriaMenuPage />  },
            ]},
            { path: 'readingRoom', element: <ReadingRoom />, children: [
                { path: 'room', element: <ReadingRoomPage /> },
            ]},
            { path: 'contact', element: <Contact />, children: [
                { path: 'category', element: <ContactCategoryPage /> },
                { path: 'seoul', element: <div>Seoul</div> },
                { path: 'erica', element: <div>ERICA</div> },
            ]},
            { path: 'calendar', element: <div>Calendar</div> },
            { path: '/', element: <Navigate replace to={'/shuttle/period'} /> },
            { path: '*', element: <Navigate replace to={'/shuttle/period'} /> },
        ]
    },
    { path: '/login', element: <Login /> },
])

export default function AppRouter() {
    return <RouterProvider router={appRouter} />
}
