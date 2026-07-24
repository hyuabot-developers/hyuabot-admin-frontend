import { Box } from '@mui/material'
import type { ReactNode } from 'react'

type DataGridPageProps = {
    children: ReactNode,
}

export function DataGridPage({ children }: DataGridPageProps) {
    return (
        <Box
            sx={{
                display: 'flex',
                flex: 1,
                flexDirection: 'column',
                minHeight: 420,
                width: '100%',
                minWidth: 0,
                bgcolor: 'background.default',
                '& > :last-child': {
                    flex: 1,
                    minHeight: 0,
                },
                '& .MuiDataGrid-root': {
                    borderRadius: 0,
                },
            }}>
            {children}
        </Box>
    )
}
