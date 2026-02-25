import { Box, Tab, Tabs } from '@mui/material'
import { SyntheticEvent, useEffect } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'

import { useNoticeTabStore } from '../../../stores/notice.ts'

export default function Notice() {
    // Get the store
    const noticeTabStore = useNoticeTabStore()
    const navigate = useNavigate()
    const tabClicked = (_: SyntheticEvent, newValue: string) => {
        noticeTabStore.setRoute(newValue)
    }
    useEffect(() => {
        navigate(`/notice/${noticeTabStore.route}`)
    }, [noticeTabStore.route])

    return (
        <div style={{ backgroundColor: 'white', height: '100%', paddingTop: '1rem' }}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tabs value={noticeTabStore.route} onChange={tabClicked} variant="scrollable">
                    <Tab label="분류 관리" value="category" />
                    <Tab label="공지사항 관리" value="notice" />
                </Tabs>
            </Box>
            <Outlet />
        </div>
    )
}