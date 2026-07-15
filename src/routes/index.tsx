import { lazy, Suspense } from 'react'
import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom'

import { PageState } from './components/PageState.tsx'
import { SectionTabsLayout } from './components/SectionTabsLayout.tsx'
import type { PageLoader } from './navigation.tsx'
import { managementSections, standaloneRoutes } from './navigation.tsx'
import AccessDenied from './pages/accessDenied.tsx'
import Home from './pages/home.tsx'
import Login from './pages/login.tsx'
import { PermissionLanding, PermissionRoute } from './permissionRoute.tsx'

const lazyElement = (load: PageLoader) => {
    const Component = lazy(load)
    return (
        <Suspense fallback={<PageState loading label='화면 불러오는 중' />}>
            <Component />
        </Suspense>
    )
}

const appRouter = createBrowserRouter([
    { path: '*', element: <Navigate replace to="/" /> },
    {
        path: '/',
        element: <Home />,
        children: [
            ...managementSections.map(({ path, defaultPath, permission, children }) => ({
                path: path.slice(1),
                element: (
                    <PermissionRoute permission={permission}>
                        <SectionTabsLayout
                            basePath={path}
                            tabs={children.map(({ label, path: childPath }) => ({ label, path: childPath }))}
                        />
                    </PermissionRoute>
                ),
                children: [
                    ...children.map(({ path: childPath, load }) => ({
                        path: childPath,
                        element: lazyElement(load),
                    })),
                    { path: '*', element: <Navigate replace to={defaultPath} /> },
                ],
            })),
            ...standaloneRoutes.map(({ path, permission, load }) => ({
                path: path.slice(1),
                element: <PermissionRoute permission={permission}>{lazyElement(load)}</PermissionRoute>,
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
