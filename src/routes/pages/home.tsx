import { useEffect, useState } from "react"
import { getUserInfo } from "../../service/network/auth.ts"

export default function Home() {
    const [isAuthenticated, setIsAuthenticated] = useState(false)
    const fetchUserInfo = async () => {
        const response = await getUserInfo()
        setIsAuthenticated(response?.status === 200)
    }

    useEffect(() => {
        fetchUserInfo().then()
    }, [])

    if (!isAuthenticated) {
        return <h1>Loading</h1>
    }
    return <h1>Home</h1>
}