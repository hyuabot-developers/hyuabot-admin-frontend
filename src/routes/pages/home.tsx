import { getUserInfo } from "../../service/network/auth.ts"
import { useAuthenticatedStore } from "../../stores/auth.ts"
import { AxiosError } from "axios";
import { AppBar, IconButton, Toolbar, Typography } from "@mui/material"
import MenuIcon from '@mui/icons-material/Menu'
import LogOutIcon from '@mui/icons-material/Logout'

const logOutButtonClicked = () => {
    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')
    window.location.href = '/login'
}

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
            <IconButton size="large" color="inherit" onClick={logOutButtonClicked}>
                <LogOutIcon />
            </IconButton>
        </Toolbar>
    </AppBar>
)

export default function Home() {
    // Get the store
    const isAuthenticatedStore = useAuthenticatedStore()
    // Fetch user info
    const fetchUserInfo = async () => {
        try {
            const response = await getUserInfo()
            isAuthenticatedStore.setIsAuthenticated(response.status === 200)
        } catch (error) {
            const err = error as AxiosError
            if (err.response?.status === 401) {
                window.location.href = '/login'
            }
        }
    }
    // Fetch user info when the component is mounted
    fetchUserInfo().then()

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