import {
    Alert,
    Box,
    Button,
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Divider,
    List,
    ListItemButton,
    ListItemText,
    TextField,
    Typography,
} from '@mui/material'
import { useState } from 'react'

import { createBusRoute, createBusStop } from '../../../../service/network/bus.ts'
import {
    GbisRoute,
    GbisRouteDetail,
    GbisRouteStation,
    getGbisRouteInfo,
    getGbisRouteStations,
    searchGbisRoutes,
} from '../../../../service/network/gbis.ts'
import { reportError } from '../../../../utility/reportError.ts'

interface GbisRouteDialogProps {
    open: boolean
    onClose: () => void
    onSuccess: () => void
    existingStopIDs: number[]
}

export const GbisRouteDialog = ({ open, onClose, onSuccess, existingStopIDs }: GbisRouteDialogProps) => {
    const [keyword, setKeyword] = useState('')
    const [searchResults, setSearchResults] = useState<GbisRoute[]>([])
    const [selectedDetail, setSelectedDetail] = useState<GbisRouteDetail | null>(null)
    const [selectedStations, setSelectedStations] = useState<GbisRouteStation[]>([])
    const [searching, setSearching] = useState(false)
    const [loadingDetail, setLoadingDetail] = useState(false)
    const [submitting, setSubmitting] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const handleSearch = async () => {
        if (!keyword.trim()) return
        setSearching(true)
        setError(null)
        setSelectedDetail(null)
        setSelectedStations([])
        try {
            const results = await searchGbisRoutes(keyword.trim())
            setSearchResults(results)
        } catch (e) {
            reportError(e)
            setError('노선 검색 중 오류가 발생했습니다.')
        } finally {
            setSearching(false)
        }
    }

    const handleSelectRoute = async (route: GbisRoute) => {
        setLoadingDetail(true)
        setError(null)
        setSelectedDetail(null)
        setSelectedStations([])
        try {
            const [detail, stations] = await Promise.all([
                getGbisRouteInfo(route.routeId),
                getGbisRouteStations(route.routeId),
            ])
            setSelectedDetail(detail)
            setSelectedStations(stations)
        } catch (e) {
            reportError(e)
            setError('노선 상세 정보를 불러오는 중 오류가 발생했습니다.')
        } finally {
            setLoadingDetail(false)
        }
    }

    const terminalIds = new Set(
        [selectedDetail?.startStationId, selectedDetail?.endStationId].filter(Boolean) as string[]
    )
    const newTerminalStations = selectedStations
        .filter((s) => terminalIds.has(s.stationId))
        .filter((s) => !existingStopIDs.includes(parseInt(s.stationId)))

    const handleAdd = async () => {
        if (!selectedDetail) return
        setSubmitting(true)
        setError(null)
        try {
            for (const station of newTerminalStations) {
                await createBusStop({
                    id: parseInt(station.stationId),
                    name: station.stationName,
                    districtCode: parseInt(station.districtCd),
                    regionName: station.regionName,
                    mobileNumber: station.mobileNo,
                    latitude: parseFloat(station.gpsLati),
                    longitude: parseFloat(station.gpsLong),
                })
            }
            await createBusRoute({
                id: parseInt(selectedDetail.routeId),
                name: selectedDetail.routeName,
                typeCode: selectedDetail.routeTypeCd,
                typeName: selectedDetail.routeTypeName,
                startStopID: parseInt(selectedDetail.startStationId),
                endStopID: parseInt(selectedDetail.endStationId),
                upFirstTime: selectedDetail.upFirstTime,
                upLastTime: selectedDetail.upLastTime,
                downFirstTime: selectedDetail.downFirstTime,
                downLastTime: selectedDetail.downLastTime,
                districtCode: parseInt(selectedDetail.districtCd),
                companyID: parseInt(selectedDetail.companyId),
                companyName: selectedDetail.companyName,
                companyPhone: selectedDetail.companyTel,
            })
            onSuccess()
            onClose()
        } catch (e) {
            reportError(e)
            setError('데이터 저장 중 오류가 발생했습니다.')
        } finally {
            setSubmitting(false)
        }
    }

    const handleClose = () => {
        setKeyword('')
        setSearchResults([])
        setSelectedDetail(null)
        setSelectedStations([])
        setError(null)
        onClose()
    }

    return (
        <Dialog open={open} onClose={handleClose} maxWidth='md' fullWidth>
            <DialogTitle>GBIS 노선 검색</DialogTitle>
            <DialogContent>
                <Box sx={{ display: 'flex', gap: 1, mb: 2, mt: 1 }}>
                    <TextField
                        label='노선명 검색'
                        value={keyword}
                        onChange={(e) => setKeyword(e.target.value)}
                        onKeyDown={(e) => { if (e.key === 'Enter') handleSearch() }}
                        size='small'
                        fullWidth
                    />
                    <Button
                        variant='contained'
                        onClick={handleSearch}
                        disabled={searching}
                        sx={{ whiteSpace: 'nowrap', minWidth: 'fit-content' }}
                    >
                        검색
                    </Button>
                </Box>
                {error && <Alert severity='error' sx={{ mb: 2 }}>{error}</Alert>}
                {searching && <Box sx={{ display: 'flex', justifyContent: 'center', my: 2 }}><CircularProgress /></Box>}
                {!searching && searchResults.length > 0 && (
                    <List dense sx={{ maxHeight: 240, overflow: 'auto', border: '1px solid', borderColor: 'divider', borderRadius: 1, mb: 2 }}>
                        {searchResults.map((route) => (
                            <ListItemButton
                                key={route.routeId}
                                onClick={() => handleSelectRoute(route)}
                                selected={selectedDetail?.routeId === route.routeId}
                            >
                                <ListItemText
                                    primary={`${route.routeName} (${route.routeTypeName})`}
                                    secondary={`${route.startStationName} ~ ${route.endStationName}`}
                                />
                            </ListItemButton>
                        ))}
                    </List>
                )}
                {loadingDetail && <Box sx={{ display: 'flex', justifyContent: 'center', my: 2 }}><CircularProgress /></Box>}
                {!loadingDetail && selectedDetail && (
                    <Box sx={{ p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 1 }}>
                        <Typography variant='subtitle1' gutterBottom sx={{
                            fontWeight: 'bold'
                        }}>
                            선택된 노선 정보
                        </Typography>
                        <Divider sx={{ mb: 1 }} />
                        <Typography variant='body2'>노선명: {selectedDetail.routeName}</Typography>
                        <Typography variant='body2'>유형: {selectedDetail.routeTypeName}</Typography>
                        <Typography variant='body2'>운수사: {selectedDetail.companyName}</Typography>
                        <Typography variant='body2'>회사전화: {selectedDetail.companyTel}</Typography>
                        <Typography variant='body2'>
                            상행 첫차/막차: {selectedDetail.upFirstTime} / {selectedDetail.upLastTime}
                        </Typography>
                        <Typography variant='body2'>
                            하행 첫차/막차: {selectedDetail.downFirstTime} / {selectedDetail.downLastTime}
                        </Typography>
                        <Typography variant='body2' sx={{ mt: 1, color: 'primary.main' }}>
                            새로 추가될 정류장: {newTerminalStations.length}개 (시·종점)
                        </Typography>
                    </Box>
                )}
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose} disabled={submitting}>취소</Button>
                <Button
                    variant='contained'
                    onClick={handleAdd}
                    disabled={!selectedDetail || submitting}
                >
                    {submitting ? <CircularProgress size={20} /> : '추가'}
                </Button>
            </DialogActions>
        </Dialog>
    )
}
