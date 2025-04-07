import { createElement, useEffect } from "react"
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
} from "@mui/material"
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth'
import ContactsIcon from '@mui/icons-material/Contacts'
import DepartureBoardIcon from '@mui/icons-material/DepartureBoard'
import DiningIcon from '@mui/icons-material/Dining'
import DirectionsBusIcon from '@mui/icons-material/DirectionsBus'
import DirectionsSubwayIcon from '@mui/icons-material/DirectionsSubway'
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks'
import LogOutIcon from '@mui/icons-material/Logout'
import MenuIcon from '@mui/icons-material/Menu'
import { useDrawerOpenedStore } from "../../stores/home.ts"
import { getUserInfo } from "../../service/network/auth.ts"
import { useAuthenticatedStore, useUserInfoStore } from "../../stores/auth.ts"
import { Outlet, useNavigate } from "react-router-dom"


export default function Home() {
    // Get the store
    const isAuthenticatedStore = useAuthenticatedStore()
    const userInfoStore = useUserInfoStore()
    const drawerOpenedStore = useDrawerOpenedStore()
    // Fetch user info
    const fetchUserInfo = async () => {
        const response = await getUserInfo()
        isAuthenticatedStore.setIsAuthenticated(response.status === 200)
        if (response.status === 200) {
            const responseData = response.data
            userInfoStore.setUserInfo(
                responseData.username,
                responseData.nickname,
                responseData.email,
                responseData.phone,
            )
        }
    }
    // Log out button clicked
    const logOutButtonClicked = () => {
        localStorage.removeItem('accessToken')
        localStorage.removeItem('refreshToken')
        window.location.href = '/login'
    }
    // Menu button clicked
    const menuButtonClicked = () => {
        drawerOpenedStore.setDrawerOpened(true)
    }
    // Fetch user info when the component is mounted
    useEffect(() => {
        fetchUserInfo().then()
    }, [])
    useEffect(() => {
        if (isAuthenticatedStore.isAuthenticated === null) {
            fetchUserInfo().then()
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
                    style={{ textAlign: "end" }}
                    sx={{ flexGrow: 1}}>
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
    const menuTexts = ['셔틀버스', '노선버스', '전철', '학식', '열람실', '연락처', '학사일정']
    const menuIcons = [
        DepartureBoardIcon,
        DirectionsBusIcon,
        DirectionsSubwayIcon,
        DiningIcon,
        LibraryBooksIcon,
        ContactsIcon,
        CalendarMonthIcon,
    ]
    const menuItemClicked = (text: string) => {
        switch (text) {
        case '셔틀버스': navigate('/shuttle'); break
        case '노선버스': navigate('/bus'); break
        case '전철': navigate('/subway'); break
        case '학식': navigate('/cafeteria'); break
        case '열람실': navigate('/readingRoom'); break
        case '연락처': navigate('/contact'); break
        case '학사일정': navigate('/calendar'); break
        }
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
                            {menuTexts.map((text, index) => (
                                <ListItem key={text} disablePadding>
                                    <ListItemButton onClick={() => menuItemClicked(text)}>
                                        <ListItemIcon>
                                            {createElement(menuIcons[index])}
                                        </ListItemIcon>
                                        <ListItemText primary={text} />
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