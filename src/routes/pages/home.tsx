import { getUserInfo } from "../../service/network/auth.ts"
import { useAuthenticatedStore, useUserInfoStore } from "../../stores/auth.ts"
import { AppBar, IconButton, Toolbar, Typography } from "@mui/material"
import MenuIcon from '@mui/icons-material/Menu'
import LogOutIcon from '@mui/icons-material/Logout'
import { useEffect } from "react";


export default function Home() {
    // Get the store
    const isAuthenticatedStore = useAuthenticatedStore()
    const userInfoStore = useUserInfoStore()
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
    // Fetch user info when the component is mounted
    useEffect(() => {
        fetchUserInfo().then()
    }, [])

    // Component
    // App bar
    const appBar = (
        <AppBar position="static">
            <Toolbar>
                <IconButton size="large" edge="start" color="inherit" aria-label="menu" sx={{ mr: 2 }}>
                    <MenuIcon />
                </IconButton>
                <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                    휴아봇 서비스 관리자 페이지
                </Typography>
                <Typography variant="h6" component="div" style={{ textAlign: "end" }} sx={{ flexGrow: 1 }}>
                    {userInfoStore.nickname}
                </Typography>
                <IconButton size="large" color="inherit" onClick={logOutButtonClicked}>
                    <LogOutIcon />
                </IconButton>
            </Toolbar>
        </AppBar>
    )
    if (isAuthenticatedStore.isAuthenticated === null) {
        return <h1>Loading</h1>
    } else if (isAuthenticatedStore.isAuthenticated) {
        return (
            <div>
                {appBar}
                <h1>Home</h1>
            </div>
        )
    }
}