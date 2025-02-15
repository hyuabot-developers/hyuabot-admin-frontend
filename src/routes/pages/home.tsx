import { getUserInfo } from "../../service/network/auth.ts"
import { useAuthenticatedStore } from "../../stores/auth.ts"
import { AxiosError } from "axios";

export default function Home() {
    const isAuthenticatedStore = useAuthenticatedStore()
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
        return <h1>Authenticated</h1>
    }
}