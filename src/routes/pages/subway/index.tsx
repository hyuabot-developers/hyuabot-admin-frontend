import { Box, Tab, Tabs } from "@mui/material"
import { Outlet, useNavigate } from "react-router-dom"
import { SyntheticEvent, useEffect } from "react"
import { useSubwayTabStore } from "../../../stores/subway.ts"

export default function Subway() {
    // Get the store
    const subwayTabStore = useSubwayTabStore()
    const navigate = useNavigate()
    const tabClicked = (_: SyntheticEvent, newValue: string) => {
        subwayTabStore.setRoute(newValue)
    }
    useEffect(() => {
        navigate(`/subway/${subwayTabStore.route}`)
    }, [subwayTabStore.route])

    return (
        <div style={{ backgroundColor: 'white', height: '100%' }}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tabs value={subwayTabStore.route} onChange={tabClicked}>
                    <Tab label="전철 역명 관리" value="station-name" />
                    <Tab label="전철역 관리" value="station" />
                    <Tab label="노선 관리" value="route" />
                    <Tab label="시간표 관리" value="timetable" />
                    <Tab label="실시간 도착 정보" value="realtime" />
                </Tabs>
            </Box>
            <Outlet />
        </div>
    )
}