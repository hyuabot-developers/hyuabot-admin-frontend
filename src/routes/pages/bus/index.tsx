import { Box, Tab, Tabs } from "@mui/material"
import { Outlet, useNavigate } from "react-router-dom"
import { SyntheticEvent, useEffect } from "react"
import { useBusTabStore } from "../../../stores/bus.ts"

export default function Bus() {
    // Get the store
    const busTabStore = useBusTabStore()
    const navigate = useNavigate()
    const tabClicked = (_: SyntheticEvent, newValue: string) => {
        busTabStore.setRoute(newValue)
    }
    useEffect(() => {
        navigate(`/bus/${busTabStore.route}`)
    }, [busTabStore.route])

    return (
        <div style={{ backgroundColor: 'white', height: '100%', paddingTop: '1rem' }}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tabs value={busTabStore.route} onChange={tabClicked} variant="scrollable">
                    <Tab label="노선 관리" value="route" />
                    <Tab label="정류장 관리" value="stop" />
                    <Tab label="노선별 정류장 관리" value="routeStop" />
                    <Tab label="시간표 관리" value="timetable" />
                    <Tab label="실시간 도착 정보" value="realtime" />
                </Tabs>
            </Box>
            <Outlet />
        </div>
    )
}