import { Avatar, Box, Typography } from '@mui/material'
import type { ReactNode } from 'react'

type PageLayoutProps = {
    title: string,
    description?: string,
    icon?: ReactNode,
    actions?: ReactNode,
    maxWidth?: number,
    children: ReactNode,
}

export function PageLayout({
    title,
    description,
    icon,
    actions,
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
            <Box sx={{ display: 'flex', alignItems: { xs: 'stretch', sm: 'flex-start' }, gap: 2, mb: 3, flexDirection: { xs: 'column', sm: 'row' } }}>
                <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2, flex: 1, minWidth: 0 }}>
                    {icon && (
                        <Avatar sx={{ bgcolor: 'primary.main', width: 48, height: 48 }}>
                            {icon}
                        </Avatar>
                    )}
                    <Box sx={{ minWidth: 0 }}>
                        <Typography variant='h4' component='h1' sx={{
                            fontWeight: 750
                        }}>
                            {title}
                        </Typography>
                        {description && (
                            <Typography
                                sx={{
                                    color: 'text.secondary',
                                    mt: 0.5
                                }}>
                                {description}
                            </Typography>
                        )}
                    </Box>
                </Box>
                {actions && <Box sx={{ flexShrink: 0, '& > *': { width: { xs: '100%', sm: 'auto' } } }}>{actions}</Box>}
            </Box>
            {children}
        </Box>
    )
}
