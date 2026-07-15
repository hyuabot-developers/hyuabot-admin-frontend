import { Avatar, Box, Typography } from '@mui/material'
import type { ReactNode } from 'react'

type PageLayoutProps = {
    title: string,
    description?: string,
    icon?: ReactNode,
    maxWidth?: number,
    children: ReactNode,
}

export function PageLayout({
    title,
    description,
    icon,
    maxWidth = 1180,
    children,
}: PageLayoutProps) {
    return (
        <Box
            component='section'
            sx={{
                p: { xs: 2, md: 3 },
                width: '100%',
                maxWidth,
                mx: 'auto',
                boxSizing: 'border-box',
                minWidth: 0,
            }}>
            <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2, mb: 3 }}>
                {icon && (
                    <Avatar sx={{ bgcolor: 'primary.main', width: 48, height: 48 }}>
                        {icon}
                    </Avatar>
                )}
                <Box>
                    <Typography variant='h4' component='h1' fontWeight={750}>
                        {title}
                    </Typography>
                    {description && (
                        <Typography color='text.secondary' sx={{ mt: 0.5 }}>
                            {description}
                        </Typography>
                    )}
                </Box>
            </Box>
            {children}
        </Box>
    )
}
