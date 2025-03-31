import { Box, Tab, Tabs } from "@mui/material"
import { Outlet, useNavigate } from "react-router-dom"
import { SyntheticEvent, useEffect } from "react"
import { useReadingRoomTabStore } from "../../../stores/readingRoom.ts"

export default function ReadingRoom() {
    // Get the store
    const readingRoomTabStore = useReadingRoomTabStore()
    const navigate = useNavigate()
    const tabClicked = (_: SyntheticEvent, newValue: string) => {
        readingRoomTabStore.setRoute(newValue)
    }
    useEffect(() => {
        navigate(`/readingRoom/${readingRoomTabStore.route}`)
    }, [readingRoomTabStore.route])

    return (
        <div style={{ backgroundColor: 'white', height: '100%', paddingTop: '1rem' }}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tabs value={readingRoomTabStore.route} onChange={tabClicked} variant="scrollable">
                    <Tab label="열람실 관리" value="room" />
                </Tabs>
            </Box>
            <Outlet />
        </div>
    )
}