import {createBrowserRouter, RouterProvider} from "react-router-dom";
import Home from "./pages/home.tsx";
import Login from "./pages/login.tsx";

const router = createBrowserRouter([
    { path: '/', element: <Home /> },
    { path: '/login', element: <Login /> },
])

export default function Router() {
    return <RouterProvider router={router} />
}
