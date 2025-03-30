import { Box, Tab, Tabs } from "@mui/material"
import { Outlet, useNavigate } from "react-router-dom"
import { SyntheticEvent, useEffect } from "react"
import { useShuttleTabStore } from "../../../stores/shuttle.ts"

export default function Shuttle() {
    // Get the store
    const shuttleTabStore = useShuttleTabStore()
    const navigate = useNavigate()
    const tabClicked = (_: SyntheticEvent, newValue: string) => {
        shuttleTabStore.setRoute(newValue)
    }
    useEffect(() => {
        navigate(`/shuttle/${shuttleTabStore.route}`)
    }, [shuttleTabStore.route])

    return (
        <div style={{ backgroundColor: 'white', height: '100%', paddingTop: '1rem' }}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tabs value={shuttleTabStore.route} onChange={tabClicked} variant="scrollable">
                    <Tab label="운행 기간 관리" value="period" />
                    <Tab label="휴일 관리" value="holiday" />
                    <Tab label="노선 관리" value="route" />
                    <Tab label="정류장 관리" value="stop" />
                    <Tab label="노선별 정류장 관리" value="routeStop" />
                    <Tab label="시간표 관리" value="timetable" />
                </Tabs>
            </Box>
            <Outlet />
        </div>
    )
}