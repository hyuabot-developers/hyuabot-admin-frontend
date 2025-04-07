import { Box, Tab, Tabs } from "@mui/material"
import { Outlet, useNavigate } from "react-router-dom"
import { SyntheticEvent, useEffect } from "react"
import { useCalendarTabStore } from "../../../stores/calendar.ts"

export default function Calendar() {
    // Get the store
    const calendarTabStore = useCalendarTabStore()
    const navigate = useNavigate()
    const tabClicked = (_: SyntheticEvent, newValue: string) => {
        calendarTabStore.setRoute(newValue)
    }
    useEffect(() => {
        navigate(`/calendar/${calendarTabStore.route}`)
    }, [calendarTabStore.route])

    return (
        <div style={{ backgroundColor: 'white', height: '100%', paddingTop: '1rem' }}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tabs value={calendarTabStore.route} onChange={tabClicked} variant="scrollable">
                    <Tab label="분류 관리" value="category" />
                    <Tab label="학사 일정 관리" value="event" />
                </Tabs>
            </Box>
            <Outlet />
        </div>
    )
}