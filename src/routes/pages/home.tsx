import LogOutIcon from '@mui/icons-material/Logout'
import MenuIcon from '@mui/icons-material/Menu'
import {
    AppBar,
    Box,
    Drawer,
    IconButton,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Toolbar,
    Tooltip,
    Typography
} from '@mui/material'
import { useTheme } from '@mui/material/styles'
import useMediaQuery from '@mui/material/useMediaQuery'
import { createElement, useEffect, useState } from 'react'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'

import { hasPermission } from '../../security/permissions.ts'
import { getUserInfo, isUserProfile, logout } from '../../service/network/auth.ts'
import { useAuthenticatedStore, useUserInfoStore } from '../../stores/auth.ts'
import { PageState } from '../components/PageState.tsx'
import { navigationItems } from '../navigation.tsx'

const drawerWidth = 264

export default function Home() {
    // Get the store
    const isAuthenticatedStore = useAuthenticatedStore()
    const userInfoStore = useUserInfoStore()
    const theme = useTheme()
    const isDesktop = useMediaQuery(theme.breakpoints.up('md'))
    const [isMobileDrawerOpen, setMobileDrawerOpen] = useState(false)
    const location = useLocation()
    const navigate = useNavigate()
    // Logout
    const logOutButtonClicked = async () => {
        const response = await logout()
        if (response.status === 200) {
            window.location.assign('/login')
        }
    }
    useEffect(() => {
        let active = true

        const initializeSession = async () => {
            try {
                const response = await getUserInfo()
                if (!active) {
                    return
                }
                if (response.status !== 200 || !isUserProfile(response.data)) {
                    isAuthenticatedStore.setStatus('unauthenticated')
                    window.location.assign('/login')
                    return
                }
                const responseData = response.data
                userInfoStore.setUserInfo(
                    responseData.username,
                    responseData.nickname,
                    responseData.email,
                    responseData.phone,
                    responseData.permissions,
                )
                isAuthenticatedStore.setStatus('authenticated')
            } catch {
                if (active) {
                    isAuthenticatedStore.setStatus('unauthenticated')
                    window.location.assign('/login')
                }
            }
        }

        void initializeSession()
        return () => {
            active = false
        }
    }, [])
    const menuItems = navigationItems.filter((item) =>
        !item.permission || hasPermission(userInfoStore.permissions, item.permission))
    const menuItemClicked = (path: string) => {
        void navigate(path)
        setMobileDrawerOpen(false)
    }
    const navigationList = (
        <Box component='nav' aria-label='관리 메뉴' sx={{ overflow: 'auto', px: 1, py: 1.5 }}>
            <List>
                {menuItems.map((item) => {
                    const selected = location.pathname === item.path ||
                        location.pathname.startsWith(`${item.path}/`)
                    return (
                        <ListItem key={item.path} disablePadding sx={{ mb: 0.5 }}>
                            <ListItemButton
                                selected={selected}
                                aria-current={selected ? 'page' : undefined}
                                onClick={() => menuItemClicked(item.path)}>
                                <ListItemIcon>
                                    {createElement(item.icon)}
                                </ListItemIcon>
                                <ListItemText primary={item.label} />
                            </ListItemButton>
                        </ListItem>
                    )
                })}
            </List>
        </Box>
    )
    if (isAuthenticatedStore.status === 'checking') {
        return <PageState loading label='관리자 정보 확인 중' />
    } else if (isAuthenticatedStore.status === 'authenticated') {
        return (
            <Box sx={{ display: 'flex', minHeight: '100dvh' }}>
                <AppBar
                    component='header'
                    position='fixed'
                    sx={{
                        zIndex: (currentTheme) => currentTheme.zIndex.drawer + 1,
                        width: { md: `calc(100% - ${drawerWidth}px)` },
                        ml: { md: `${drawerWidth}px` },
                    }}>
                    <Toolbar>
                        {!isDesktop && (
                            <IconButton
                                size='large'
                                edge='start'
                                color='inherit'
                                aria-label='관리 메뉴 열기'
                                sx={{ mr: 2 }}
                                onClick={() => setMobileDrawerOpen(true)}>
                                <MenuIcon />
                            </IconButton>
                        )}
                        <Typography
                            variant='h6'
                            component='div'
                            noWrap
                            sx={{ flexGrow: 1 }}>
                            휴아봇 관리자
                        </Typography>
                        <Typography sx={{ display: { xs: 'none', sm: 'block' }, mr: 1.5 }}>
                            {userInfoStore.nickname}
                        </Typography>
                        <Tooltip title='로그아웃'>
                            <IconButton
                                size='large'
                                color='inherit'
                                aria-label='로그아웃'
                                onClick={logOutButtonClicked}>
                                <LogOutIcon />
                            </IconButton>
                        </Tooltip>
                    </Toolbar>
                </AppBar>
                <Drawer
                    variant={isDesktop ? 'permanent' : 'temporary'}
                    open={isDesktop || isMobileDrawerOpen}
                    onClose={() => setMobileDrawerOpen(false)}
                    ModalProps={{ keepMounted: true }}
                    sx={{
                        width: drawerWidth,
                        flexShrink: { md: 0 },
                        '& .MuiDrawer-paper': {
                            width: drawerWidth,
                            boxSizing: 'border-box',
                        },
                    }}
                    anchor='left'>
                    <Toolbar />
                    {navigationList}
                </Drawer>
                <Box
                    component='main'
                    sx={{ flexGrow: 1, minWidth: 0, width: { md: `calc(100% - ${drawerWidth}px)` } }}>
                    <Toolbar />
                    <Outlet />
                </Box>
            </Box>
        )
    }
}
