import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom'

import { managementSections, standaloneRoutes } from './navigation.tsx'
import AccessDenied from './pages/accessDenied.tsx'
import Home from './pages/home.tsx'
import Login from './pages/login.tsx'
import { PermissionLanding, PermissionRoute } from './permissionRoute.tsx'

const appRouter = createBrowserRouter([
    { path: '*', element: <Navigate replace to="/" /> },
    {
        path: '/',
        element: <Home />,
        children: [
            ...managementSections.map(({ path, defaultPath, permission, Layout, children }) => ({
                path: path.slice(1),
                element: <PermissionRoute permission={permission}><Layout /></PermissionRoute>,
                children: [
                    ...children.map(({ path: childPath, Component }) => ({
                        path: childPath,
                        element: <Component />,
                    })),
                    { path: '*', element: <Navigate replace to={defaultPath} /> },
                ],
            })),
            ...standaloneRoutes.map(({ path, permission, Component }) => ({
                path: path.slice(1),
                element: <PermissionRoute permission={permission}><Component /></PermissionRoute>,
            })),
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
