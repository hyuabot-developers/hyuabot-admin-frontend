import { Box, CircularProgress, Typography } from '@mui/material'
import type { ReactNode } from 'react'

type PageStateProps = {
    loading?: boolean,
    label: string,
    icon?: ReactNode,
}

export function PageState({ loading = false, label, icon }: PageStateProps) {
    return (
        <Box
            role='status'
            aria-live='polite'
            sx={{
                display: 'flex',
                minHeight: 240,
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 1,
                color: 'text.secondary',
            }}>
            {loading ? <CircularProgress aria-label={label} /> : icon}
            {!loading && <Typography>{label}</Typography>}
        </Box>
    )
}
