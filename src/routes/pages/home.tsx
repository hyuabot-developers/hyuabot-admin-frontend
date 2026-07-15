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
    ListItemIcon, ListItemText,
    Toolbar,
    Typography
} from '@mui/material'
import { createElement, useEffect } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'

import { hasPermission } from '../../security/permissions.ts'
import { getUserInfo, logout } from '../../service/network/auth.ts'
import { useAuthenticatedStore, useUserInfoStore } from '../../stores/auth.ts'
import { useDrawerOpenedStore } from '../../stores/home.ts'
import { navigationItems } from '../navigation.tsx'


export default function Home() {
    // Get the store
    const isAuthenticatedStore = useAuthenticatedStore()
    const userInfoStore = useUserInfoStore()
    const drawerOpenedStore = useDrawerOpenedStore()
    // Fetch user info
    const fetchUserInfo = async () => {
        const response = await getUserInfo()
        if (response.status === 200) {
            const responseData = response.data
            userInfoStore.setUserInfo(
                responseData.username,
                responseData.nickname,
                responseData.email,
                responseData.phone,
                responseData.permissions,
            )
        }
        isAuthenticatedStore.setIsAuthenticated(response.status === 200)
    }
    // Logout
    const logOutButtonClicked = async () => {
        const response = await logout()
        if (response.status === 200) {
            window.location.href = '/login'
        }
    }
    // Menu button clicked
    const menuButtonClicked = () => {
        drawerOpenedStore.setDrawerOpened(true)
    }
    // Fetch user info when the component is mounted
    useEffect(() => {
        fetchUserInfo().catch(console.error)
    }, [])
    useEffect(() => {
        if (isAuthenticatedStore.isAuthenticated === null) {
            fetchUserInfo().catch(console.error)
        }
        else if (!isAuthenticatedStore.isAuthenticated) {
            window.location.href = '/login'
        }
    }, [isAuthenticatedStore.isAuthenticated])
    // Component
    // App bar
    const appBar = (
        <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
            <Toolbar>
                <IconButton
                    size="large"
                    edge="start"
                    color="inherit"
                    aria-label="menu"
                    sx={{ mr: 2 }}
                    onClick={() => drawerOpenedStore.setDrawerOpened(!drawerOpenedStore.isDrawerOpened)}>
                    <MenuIcon />
                </IconButton>
                <Typography
                    variant="h6"
                    component="div"
                    sx={{ flexGrow: 1, display: { xs: 'none', sm: 'block' } }}>
                    휴아봇 서비스 관리자 페이지
                </Typography>
                <Typography
                    variant="h6"
                    component="div"
                    style={{ textAlign: 'end' }}
                    sx={{ flexGrow: 1 }}>
                    {window.innerWidth > 600 ? userInfoStore.nickname : ''}
                </Typography>
                <IconButton size="large" color="inherit" onClick={logOutButtonClicked}>
                    <LogOutIcon />
                </IconButton>
            </Toolbar>
        </AppBar>
    )
    // Drawer
    const navigate = useNavigate()
    const menuItems = navigationItems.filter((item) =>
        hasPermission(userInfoStore.permissions, item.permission))
    const menuItemClicked = (path: string) => {
        navigate(path)
        drawerOpenedStore.setDrawerOpened(false)
    }
    if (isAuthenticatedStore.isAuthenticated === null) {
        return
    } else if (isAuthenticatedStore.isAuthenticated) {
        return (
            <div>
                {appBar}
                <Drawer
                    open={drawerOpenedStore.isDrawerOpened}
                    onClose={menuButtonClicked}
                    sx={{
                        width: 240,
                        flexShrink: 0,
                        '& .MuiDrawer-paper': {
                            width: 240,
                            boxSizing: 'border-box',
                        },
                    }}
                    anchor="left">
                    <Toolbar />
                    <Box sx={{ overflow: 'auto' }}>
                        <List>
                            {menuItems.map((item) => (
                                <ListItem key={item.path} disablePadding>
                                    <ListItemButton onClick={() => menuItemClicked(item.path)}>
                                        <ListItemIcon>
                                            {createElement(item.icon)}
                                        </ListItemIcon>
                                        <ListItemText primary={item.label} />
                                    </ListItemButton>
                                </ListItem>
                            ))}
                        </List>
                    </Box>
                </Drawer>
                <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                    <Toolbar />
                    <Outlet />
                </Box>
            </div>
        )
    }
}
