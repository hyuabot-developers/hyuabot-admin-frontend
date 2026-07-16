import { Divider, Paper, Stack, Typography } from '@mui/material'
import type { ReactNode } from 'react'

export function SettingsCard({ icon, title, children }: { icon?: ReactNode, title: string, children: ReactNode }) {
    return (
        <Paper variant='outlined' sx={{ p: { xs: 2.5, sm: 3 }, mb: 2.5, borderRadius: 3 }}>
            <Stack direction='row' alignItems='center' spacing={1} sx={{ mb: 1.5 }}>
                {icon}
                <Typography variant='subtitle1' fontWeight={750}>{title}</Typography>
            </Stack>
            <Divider sx={{ mb: 2.5 }} />
            {children}
        </Paper>
    )
}
