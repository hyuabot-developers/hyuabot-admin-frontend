import { PropsWithChildren } from 'react'
import { Navigate } from 'react-router-dom'

import { AdminPermission, firstAllowedPath, hasPermission } from '../security/permissions.ts'
import { useUserInfoStore } from '../stores/auth.ts'

export function PermissionRoute({
    permission,
    children,
}: PropsWithChildren<{ permission: AdminPermission }>) {
    const permissions = useUserInfoStore((state) => state.permissions)
    return hasPermission(permissions, permission)
        ? children
        : <Navigate replace to={firstAllowedPath(permissions)} />
}

export function PermissionLanding() {
    const permissions = useUserInfoStore((state) => state.permissions)
    return <Navigate replace to={firstAllowedPath(permissions)} />
}
