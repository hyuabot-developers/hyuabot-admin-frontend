import { createBrowserRouter, Navigate, RouterProvider } from "react-router-dom"
import Home from "./pages/home.tsx"
import Login from "./pages/login.tsx"

const appRouter = createBrowserRouter([
    { path: '*', element: <Navigate replace to={'/'} /> },
    {
        path: '/',
        element: <Home />,
        children: [
            { path: 'shuttle', element: <div>Shuttle</div> },
            { path: 'bus', element: <div>Bus</div> },
            { path: 'subway', element: <div>Subway</div> },
            { path: 'cafeteria', element: <div>Cafeteria</div> },
            { path: 'readingRoom', element: <div>Reading Room</div> },
            { path: 'contact', element: <div>Contact</div> },
            { path: 'calendar', element: <div>Calendar</div> },
            { path: 'user', element: <div>User</div> },
            { path: '/', element: <Navigate replace to={'/shuttle'} /> },
            { path: '*', element: <Navigate replace to={'/shuttle'} /> },
        ]
    },
    { path: '/login', element: <Login /> },
])

export default function AppRouter() {
    return <RouterProvider router={appRouter} />
}
