import {
    Alert,
    Box,
    Button,
    Checkbox,
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    List,
    ListItem,
    ListItemButton,
    ListItemText,
    Typography,
} from '@mui/material'
import { useEffect, useState } from 'react'

import { createBusRouteStop, createBusStop } from '../../../../service/network/bus.ts'
import { GbisRouteStation, getGbisRouteStations } from '../../../../service/network/gbis.ts'
import { useBusRouteStopStore } from '../../../../stores/bus.ts'
import { reportError } from '../../../../utility/reportError.ts'

interface GbisRouteStopDialogProps {
    open: boolean
    onClose: () => void
    onSuccess: () => void
    routeID: number
}

export const GbisRouteStopDialog = ({ open, onClose, onSuccess, routeID }: GbisRouteStopDialogProps) => {
    const [stations, setStations] = useState<GbisRouteStation[]>([])
    const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
    const [loading, setLoading] = useState(false)
    const [submitting, setSubmitting] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const { stops, rows } = useBusRouteStopStore()
    const existingStopIDs = new Set(stops.map((s) => s.stopID))
    const routeStopIDs = new Set(
        rows.map((r) => parseInt(r.stop.split('(')[1]?.split(')')[0] ?? '0'))
    )

    useEffect(() => {
        if (!open || !routeID) return
        setLoading(true)
        setError(null)
        setSelectedIds(new Set())
        getGbisRouteStations(routeID.toString())
            .then(setStations)
            .catch(() => setError('정류장 목록을 불러오는 중 오류가 발생했습니다.'))
            .finally(() => setLoading(false))
    }, [open, routeID])

    const handleToggle = (stationId: string) => {
        setSelectedIds((prev) => {
            const next = new Set(prev)
            if (next.has(stationId)) next.delete(stationId)
            else next.add(stationId)
            return next
        })
    }

    const handleAdd = async () => {
        const toAdd = stations.filter((s) => selectedIds.has(s.stationId))
        if (!toAdd.length) return

        const { stops: currentStops, rows: currentRows, routes: currentRoutes } = useBusRouteStopStore.getState()
        const currentStopIDs = new Set(currentStops.map((s) => s.stopID))
        const currentRouteStopIDs = new Set(
            currentRows.map((r) => parseInt(r.stop.split('(')[1]?.split(')')[0] ?? '0'))
        )
        const selectedRoute = currentRoutes.find((r) => r.routeID === routeID)
        const startStopID = parseInt(selectedRoute?.startStop.split('(')[1]?.split(')')[0] ?? '0')

        setSubmitting(true)
        setError(null)
        try {
            for (const station of toAdd) {
                const stopID = parseInt(station.stationId)
                if (currentRouteStopIDs.has(stopID)) continue
                if (!currentStopIDs.has(stopID)) {
                    await createBusStop({
                        id: stopID,
                        name: station.stationName,
                        districtCode: parseInt(station.districtCd),
                        regionName: station.regionName,
                        mobileNumber: station.mobileNo,
                        latitude: parseFloat(station.gpsLati),
                        longitude: parseFloat(station.gpsLong),
                    })
                }
                await createBusRouteStop(routeID, {
                    stopID,
                    order: parseInt(station.stationSeq),
                    startStopID,
                    travelTime: 0,
                })
            }
            onSuccess()
            onClose()
        } catch (e) {
            reportError(e)
            setError('저장 중 오류가 발생했습니다.')
        } finally {
            setSubmitting(false)
        }
    }

    const handleClose = () => {
        setStations([])
        setSelectedIds(new Set())
        setError(null)
        onClose()
    }

    return (
        <Dialog open={open} onClose={handleClose} maxWidth='sm' fullWidth>
            <DialogTitle>GBIS 경유 정류장 추가</DialogTitle>
            <DialogContent>
                {error && <Alert severity='error' sx={{ mb: 2 }}>{error}</Alert>}
                {loading && (
                    <Box sx={{ display: 'flex', justifyContent: 'center', my: 2 }}>
                        <CircularProgress />
                    </Box>
                )}
                {!loading && stations.length > 0 && (
                    <List dense sx={{ maxHeight: 400, overflow: 'auto', border: '1px solid', borderColor: 'divider', borderRadius: 1 }}>
                        {stations.map((station) => {
                            const stopID = parseInt(station.stationId)
                            const alreadyInRoute = routeStopIDs.has(stopID)
                            const isNewStop = !existingStopIDs.has(stopID)
                            return (
                                <ListItem key={station.stationId} disablePadding>
                                    <ListItemButton
                                        onClick={() => !alreadyInRoute && handleToggle(station.stationId)}
                                        disabled={alreadyInRoute}
                                    >
                                        <Checkbox
                                            edge='start'
                                            checked={selectedIds.has(station.stationId) || alreadyInRoute}
                                            disabled={alreadyInRoute}
                                            tabIndex={-1}
                                            disableRipple
                                        />
                                        <ListItemText
                                            primary={
                                                <Typography variant='body2'>
                                                    {station.stationName}
                                                    {alreadyInRoute && (
                                                        <Typography component='span' variant='caption' color='text.secondary' sx={{ ml: 1 }}>
                                                            (이미 추가됨)
                                                        </Typography>
                                                    )}
                                                    {!alreadyInRoute && isNewStop && (
                                                        <Typography component='span' variant='caption' color='warning.main' sx={{ ml: 1 }}>
                                                            (신규 정류장)
                                                        </Typography>
                                                    )}
                                                </Typography>
                                            }
                                            secondary={`순서: ${station.stationSeq} · ${station.regionName}`}
                                        />
                                    </ListItemButton>
                                </ListItem>
                            )
                        })}
                    </List>
                )}
                {!loading && stations.length === 0 && !error && (
                    <Typography variant='body2' color='text.secondary' sx={{ textAlign: 'center', py: 2 }}>
                        노선을 선택하면 정류장 목록이 표시됩니다.
                    </Typography>
                )}
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose} disabled={submitting}>취소</Button>
                <Button
                    variant='contained'
                    onClick={handleAdd}
                    disabled={selectedIds.size === 0 || submitting}
                >
                    {submitting ? <CircularProgress size={20} /> : `선택한 항목 추가 (${selectedIds.size}개)`}
                </Button>
            </DialogActions>
        </Dialog>
    )
}
