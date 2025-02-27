import { createBrowserRouter, Navigate, RouterProvider } from "react-router-dom"
import Home from "./pages/home.tsx"
import Login from "./pages/login.tsx"
import Shuttle from "./pages/shuttle"
import Period from "./pages/shuttle/period"
import Holiday from "./pages/shuttle/holiday"
import ShuttleRoute from "./pages/shuttle/route"

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
                { path: 'stop', element: <div>Stop</div> },
                { path: 'routeStop', element: <div>RouteStop</div> },
                { path: 'timetable', element: <div>Timetable</div> },
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
