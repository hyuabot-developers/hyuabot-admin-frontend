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
    TextField,
    Typography,
} from '@mui/material'
import { useState } from 'react'

import { createBusStop } from '../../../../service/network/bus.ts'
import { GbisStop, searchGbisStops } from '../../../../service/network/gbis.ts'
import { reportError } from '../../../../utility/reportError.ts'

interface GbisStopDialogProps {
    open: boolean
    onClose: () => void
    onSuccess: () => void
    existingStopIDs: number[]
}

export const GbisStopDialog = ({ open, onClose, onSuccess, existingStopIDs }: GbisStopDialogProps) => {
    const [keyword, setKeyword] = useState('')
    const [searchResults, setSearchResults] = useState<GbisStop[]>([])
    const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
    const [searching, setSearching] = useState(false)
    const [submitting, setSubmitting] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const handleSearch = async () => {
        if (!keyword.trim()) return
        setSearching(true)
        setError(null)
        setSelectedIds(new Set())
        try {
            const results = await searchGbisStops(keyword.trim())
            setSearchResults(results)
        } catch (e) {
            reportError(e)
            setError('정류장 검색 중 오류가 발생했습니다.')
        } finally {
            setSearching(false)
        }
    }

    const handleToggle = (stationId: string) => {
        setSelectedIds((prev) => {
            const next = new Set(prev)
            if (next.has(stationId)) {
                next.delete(stationId)
            } else {
                next.add(stationId)
            }
            return next
        })
    }

    const handleAdd = async () => {
        const toAdd = searchResults.filter((s) => selectedIds.has(s.stationId))
        if (!toAdd.length) return
        setSubmitting(true)
        setError(null)
        try {
            for (const stop of toAdd) {
                await createBusStop({
                    id: parseInt(stop.stationId),
                    name: stop.stationName,
                    districtCode: parseInt(stop.districtCd),
                    regionName: stop.regionName,
                    mobileNumber: stop.mobileNo,
                    latitude: parseFloat(stop.gpsLati),
                    longitude: parseFloat(stop.gpsLong),
                })
            }
            onSuccess()
            onClose()
        } catch (e) {
            reportError(e)
            setError('정류장 저장 중 오류가 발생했습니다.')
        } finally {
            setSubmitting(false)
        }
    }

    const handleClose = () => {
        setKeyword('')
        setSearchResults([])
        setSelectedIds(new Set())
        setError(null)
        onClose()
    }

    return (
        <Dialog open={open} onClose={handleClose} maxWidth='sm' fullWidth>
            <DialogTitle>GBIS 정류장 검색</DialogTitle>
            <DialogContent>
                <Box sx={{ display: 'flex', gap: 1, mb: 2, mt: 1 }}>
                    <TextField
                        label='정류장명 검색'
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
                    <List dense sx={{ maxHeight: 320, overflow: 'auto', border: '1px solid', borderColor: 'divider', borderRadius: 1 }}>
                        {searchResults.map((stop) => {
                            const alreadyExists = existingStopIDs.includes(parseInt(stop.stationId))
                            const isChecked = selectedIds.has(stop.stationId)
                            return (
                                <ListItem key={stop.stationId} disablePadding>
                                    <ListItemButton
                                        onClick={() => !alreadyExists && handleToggle(stop.stationId)}
                                        disabled={alreadyExists}
                                    >
                                        <Checkbox
                                            edge='start'
                                            checked={isChecked || alreadyExists}
                                            disabled={alreadyExists}
                                            tabIndex={-1}
                                            disableRipple
                                        />
                                        <ListItemText
                                            primary={
                                                <Typography variant='body2'>
                                                    {stop.stationName}
                                                    {alreadyExists && (
                                                        <Typography component='span' variant='caption' color='text.secondary' sx={{ ml: 1 }}>
                                                            (이미 추가됨)
                                                        </Typography>
                                                    )}
                                                </Typography>
                                            }
                                            secondary={`${stop.regionName} · ${stop.mobileNo}`}
                                        />
                                    </ListItemButton>
                                </ListItem>
                            )
                        })}
                    </List>
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
