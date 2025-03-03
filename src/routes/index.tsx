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
            { path: 'bus', element: <div>Bus</div> },
            { path: 'subway', element: <div>Subway</div> },
            { path: 'cafeteria', element: <div>Cafeteria</div> },
            { path: 'readingRoom', element: <div>Reading Room</div> },
            { path: 'contact', element: <div>Contact</div> },
            { path: 'calendar', element: <div>Calendar</div> },
            { path: 'user', element: <div>User</div> },
            { path: '/', element: <Navigate replace to={'/shuttle/period'} /> },
            { path: '*', element: <Navigate replace to={'/shuttle/period'} /> },
        ]
    },
    { path: '/login', element: <Login /> },
])

export default function AppRouter() {
    return <RouterProvider router={appRouter} />
}
