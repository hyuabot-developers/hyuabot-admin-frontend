import { Box, Tab, Tabs } from "@mui/material"
import { Outlet, useNavigate } from "react-router-dom"
import { SyntheticEvent, useEffect } from "react"
import { useCafeteriaTabStore } from "../../../stores/cafeteria.ts"

export default function Cafeteria() {
    // Get the store
    const cafeteriaTabStore = useCafeteriaTabStore()
    const navigate = useNavigate()
    const tabClicked = (_: SyntheticEvent, newValue: string) => {
        cafeteriaTabStore.setRoute(newValue)
    }
    useEffect(() => {
        navigate(`/cafeteria/${cafeteriaTabStore.route}`)
    }, [cafeteriaTabStore.route])

    return (
        <div style={{ backgroundColor: 'white', height: '100%', paddingTop: '1rem' }}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tabs value={cafeteriaTabStore.route} onChange={tabClicked} variant="scrollable">
                    <Tab label="식당 관리" value="cafeteria" />
                    <Tab label="메뉴 관리" value="menu" />
                </Tabs>
            </Box>
            <Outlet />
        </div>
    )
}