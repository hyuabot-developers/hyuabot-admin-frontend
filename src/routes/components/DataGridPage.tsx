import { Box } from '@mui/material'
import type { ReactNode } from 'react'

type DataGridPageProps = {
    children: ReactNode,
}

export function DataGridPage({ children }: DataGridPageProps) {
    return (
        <Box
            sx={{
                height: {
                    xs: 'calc(100dvh - 120px)',
                    sm: 'calc(100dvh - 128px)',
                },
                minHeight: 420,
                width: '100%',
                minWidth: 0,
                bgcolor: 'background.paper',
            }}>
            {children}
        </Box>
    )
}
