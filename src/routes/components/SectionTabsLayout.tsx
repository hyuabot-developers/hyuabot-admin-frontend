import { Box, Tab, Tabs } from '@mui/material'
import type { SyntheticEvent } from 'react'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'

type SectionTab = {
    label: string,
    path: string,
}

type SectionTabsLayoutProps = {
    basePath: string,
    tabs: SectionTab[],
}

export function SectionTabsLayout({ basePath, tabs }: SectionTabsLayoutProps) {
    const location = useLocation()
    const navigate = useNavigate()
    const currentPath = location.pathname.slice(basePath.length + 1).split('/')[0]
    const selectedTab = tabs.some(({ path }) => path === currentPath) ? currentPath : false

    const handleTabChange = (_: SyntheticEvent, path: string) => {
        void navigate(`${basePath}/${path}`)
    }

    return (
        <Box
            sx={{
                bgcolor: 'background.default',
                display: 'flex',
                flexDirection: 'column',
                height: {
                    xs: 'calc(100dvh - 56px)',
                    sm: 'calc(100dvh - 64px)',
                },
                minHeight: 484,
                pt: 2,
            }}>
            <Box sx={{ bgcolor: 'background.paper', borderBottom: 1, borderColor: 'divider', flexShrink: 0 }}>
                <Tabs value={selectedTab} onChange={handleTabChange} variant='scrollable'>
                    {tabs.map(({ label, path }) => (
                        <Tab key={path} label={label} value={path} />
                    ))}
                </Tabs>
            </Box>
            <Outlet />
        </Box>
    )
}
