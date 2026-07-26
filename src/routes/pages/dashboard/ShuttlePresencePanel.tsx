import DirectionsBusFilledRoundedIcon from '@mui/icons-material/DirectionsBusFilledRounded'
import { Alert, Box, Chip, Paper, Skeleton, Stack, Typography } from '@mui/material'
import { useEffect, useRef, useState } from 'react'

import { getShuttleStopPresence, ShuttlePresenceResponse } from '../../../service/network/shuttle.ts'

const POLL_INTERVAL_MS = 30_000

const STOP_LABELS: Record<string, string> = {
    dormitory_o: '기숙사',
    shuttlecock_o: '셔틀콕',
    station: '한대앞',
    terminal: '예술인',
    jungang_stn: '중앙역',
    shuttlecock_i: '셔틀콕 건너편',
}

const timeFormatter = new Intl.DateTimeFormat('ko-KR', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
})

const gridColumns = { xs: 'repeat(2, 1fr)', sm: 'repeat(3, 1fr)', md: 'repeat(6, 1fr)' }

export function ShuttlePresencePanel() {
    const [data, setData] = useState<ShuttlePresenceResponse | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const mountedRef = useRef(true)

    const load = async () => {
        try {
            const response = await getShuttleStopPresence()
            if (mountedRef.current) {
                setData(response.data)
                setError('')
            }
        } catch {
            if (mountedRef.current) {
                setError('실시간 시청자 수를 불러오지 못했습니다.')
            }
        } finally {
            if (mountedRef.current) {
                setLoading(false)
            }
        }
    }

    useEffect(() => {
        mountedRef.current = true
        load()
        const intervalId = setInterval(load, POLL_INTERVAL_MS)
        return () => {
            mountedRef.current = false
            clearInterval(intervalId)
        }
    }, [])

    const total = (data?.stops ?? []).reduce((sum, stop) => sum + stop.viewerCount, 0)

    return (
        <Paper variant="outlined" sx={{ p: { xs: 2.5, md: 3 } }}>
            <Stack direction="row" spacing={1} sx={{ alignItems: 'center', justifyContent: 'space-between' }}>
                <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
                    <DirectionsBusFilledRoundedIcon color="primary" />
                    <Typography variant="h6" component="h2">셔틀 실시간 시청자</Typography>
                </Stack>
                {data && <Chip size="small" color="primary" label={`총 ${total}명`} />}
            </Stack>

            {error && <Alert severity="warning" sx={{ mt: 2 }}>{error}</Alert>}

            <Box sx={{ display: 'grid', gridTemplateColumns: gridColumns, gap: 1.5, mt: 2 }}>
                {loading && !data
                    ? Array.from({ length: 6 }).map((_, index) => (
                        <Skeleton key={index} variant="rounded" height={72} />
                    ))
                    : Object.entries(STOP_LABELS).map(([stopId, label]) => {
                        const viewerCount = data?.stops.find((stop) => stop.stopId === stopId)?.viewerCount ?? 0
                        return (
                            <Box
                                key={stopId}
                                sx={{
                                    p: 1.5,
                                    border: '1px solid',
                                    borderColor: 'divider',
                                    borderRadius: 2,
                                    textAlign: 'center',
                                }}
                            >
                                <Typography variant="caption" sx={{ color: 'text.secondary' }}>{label}</Typography>
                                <Typography variant="h5" sx={{ mt: 0.5 }}>{viewerCount}</Typography>
                            </Box>
                        )
                    })}
            </Box>

            {data && (
                <Typography
                    variant="caption"
                    sx={{ color: 'text.secondary', textAlign: 'right', display: 'block', mt: 2 }}
                >
                    마지막 갱신 {timeFormatter.format(new Date(data.updatedAt))}
                </Typography>
            )}
        </Paper>
    )
}
