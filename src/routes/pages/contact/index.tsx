import { Box, Tab, Tabs } from "@mui/material"
import { Outlet, useNavigate } from "react-router-dom"
import { SyntheticEvent, useEffect } from "react"
import { useContactTabStore } from "../../../stores/contact.ts"

export default function Contact() {
    // Get the store
    const contactTabStore = useContactTabStore()
    const navigate = useNavigate()
    const tabClicked = (_: SyntheticEvent, newValue: string) => {
        contactTabStore.setRoute(newValue)
    }
    useEffect(() => {
        navigate(`/contact/${contactTabStore.route}`)
    }, [contactTabStore.route])

    return (
        <div style={{ backgroundColor: 'white', height: '100%', paddingTop: '1rem' }}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tabs value={contactTabStore.route} onChange={tabClicked} variant="scrollable">
                    <Tab label="분류 관리" value="category" />
                    <Tab label="서울캠퍼스" value="seoul" />
                    <Tab label="ERICA 캠퍼스" value="erica" />
                </Tabs>
            </Box>
            <Outlet />
        </div>
    )
}