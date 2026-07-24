import AddLocationAltOutlinedIcon from '@mui/icons-material/AddLocationAltOutlined'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutlineOutlined'
import EditOutlinedIcon from '@mui/icons-material/EditOutlined'
import LayersOutlinedIcon from '@mui/icons-material/LayersOutlined'
import RestartAltIcon from '@mui/icons-material/RestartAlt'
import SaveOutlinedIcon from '@mui/icons-material/SaveOutlined'
import UndoIcon from '@mui/icons-material/Undo'
import {
    Alert,
    Box,
    Button,
    Card,
    CardContent,
    Chip,
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Divider,
    FormControl,
    FormControlLabel,
    InputLabel,
    MenuItem,
    Select,
    Snackbar,
    Stack,
    Switch,
    TextField,
    Typography,
} from '@mui/material'
import 'leaflet/dist/leaflet.css'
import { useCallback, useEffect, useMemo, useState } from 'react'

import { GeofenceMap } from './GeofenceMap.tsx'
import {
    createShuttleInitialStopRule,
    deleteShuttleInitialStopRule,
    getShuttleInitialStopRules,
    getShuttleStop,
    type ShuttleGeoPoint,
    type ShuttleInitialStopRule,
    type ShuttleInitialStopRuleRequest,
    type ShuttleStopResponse,
    updateShuttleInitialStopRule,
} from '../../../../service/network/shuttle.ts'
import { reportError } from '../../../../utility/reportError.ts'
import { PageLayout } from '../../../components/PageLayout.tsx'

const PERIOD_OPTIONS = [
    { value: 'semester', label: '학기' },
    { value: 'vacation_session', label: '계절학기' },
    { value: 'vacation', label: '방학' },
]

type RuleDraft = {
    name: string,
    periodType: string,
    weekday: boolean,
    allDay: boolean,
    startTime: string,
    endTime: string,
    stopName: string,
    priority: number,
    enabled: boolean,
    polygon: ShuttleGeoPoint[],
}

const emptyDraft = (): RuleDraft => ({
    name: '',
    periodType: 'semester',
    weekday: true,
    allDay: true,
    startTime: '07:00',
    endTime: '10:00',
    stopName: '',
    priority: 100,
    enabled: true,
    polygon: [],
})

const toDraft = (rule: ShuttleInitialStopRule): RuleDraft => ({
    name: rule.name,
    periodType: rule.periodType,
    weekday: rule.weekday,
    allDay: rule.startTime === null,
    startTime: rule.startTime?.slice(0, 5) ?? '07:00',
    endTime: rule.endTime?.slice(0, 5) ?? '10:00',
    stopName: rule.stopName,
    priority: rule.priority,
    enabled: rule.enabled,
    polygon: rule.polygon,
})

const periodLabel = (periodType: string) =>
    PERIOD_OPTIONS.find(({ value }) => value === periodType)?.label ?? periodType

export default function ShuttleInitialStopRules() {
    const [rules, setRules] = useState<ShuttleInitialStopRule[]>([])
    const [stops, setStops] = useState<ShuttleStopResponse[]>([])
    const [draft, setDraft] = useState<RuleDraft>(emptyDraft)
    const [editingSeq, setEditingSeq] = useState<number | null>(null)
    const [deleteTarget, setDeleteTarget] = useState<ShuttleInitialStopRule | null>(null)
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [message, setMessage] = useState('')
    const [error, setError] = useState('')

    const loadData = useCallback(async () => {
        setLoading(true)
        try {
            const [ruleResponse, stopResponse] = await Promise.all([
                getShuttleInitialStopRules(),
                getShuttleStop(),
            ])
            setRules(ruleResponse.data.result as ShuttleInitialStopRule[])
            setStops(stopResponse.data.result as ShuttleStopResponse[])
        } catch (loadError) {
            reportError(loadError)
            setError('초기 정류장 규칙을 불러오지 못했습니다.')
        } finally {
            setLoading(false)
        }
    }, [])

    useEffect(() => {
        void loadData()
    }, [loadData])

    const validationMessage = useMemo(() => {
        if (!draft.name.trim()) return '규칙 이름을 입력해 주세요.'
        if (!draft.stopName) return '초기 정류장을 선택해 주세요.'
        if (draft.polygon.length < 3) return '지도에서 꼭짓점을 3개 이상 지정해 주세요.'
        if (!draft.allDay && draft.startTime === draft.endTime) {
            return '시작 시간과 종료 시간은 달라야 합니다.'
        }
        return ''
    }, [draft])

    const resetDraft = () => {
        setEditingSeq(null)
        setDraft(emptyDraft())
    }

    const buildRequest = (): ShuttleInitialStopRuleRequest => ({
        name: draft.name.trim(),
        periodType: draft.periodType,
        weekday: draft.weekday,
        startTime: draft.allDay ? null : `${draft.startTime}:00`,
        endTime: draft.allDay ? null : `${draft.endTime}:00`,
        stopName: draft.stopName,
        priority: draft.priority,
        enabled: draft.enabled,
        polygon: draft.polygon,
    })

    const saveRule = async () => {
        if (validationMessage) {
            setError(validationMessage)
            return
        }
        setSaving(true)
        try {
            const request = buildRequest()
            if (editingSeq === null) {
                await createShuttleInitialStopRule(request)
                setMessage('초기 정류장 규칙을 만들었습니다.')
            } else {
                await updateShuttleInitialStopRule(editingSeq, request)
                setMessage('초기 정류장 규칙을 수정했습니다.')
            }
            resetDraft()
            await loadData()
        } catch (saveError) {
            reportError(saveError)
            setError('규칙을 저장하지 못했습니다. 입력값과 다각형을 확인해 주세요.')
        } finally {
            setSaving(false)
        }
    }

    const confirmDelete = async () => {
        if (deleteTarget === null) return
        try {
            await deleteShuttleInitialStopRule(deleteTarget.seq)
            if (editingSeq === deleteTarget.seq) resetDraft()
            setDeleteTarget(null)
            setMessage('초기 정류장 규칙을 삭제했습니다.')
            await loadData()
        } catch (deleteError) {
            reportError(deleteError)
            setError('규칙을 삭제하지 못했습니다.')
        }
    }

    const editRule = (rule: ShuttleInitialStopRule) => {
        setEditingSeq(rule.seq)
        setDraft(toDraft(rule))
        window.scrollTo({ top: 0, behavior: 'smooth' })
    }

    return (
        <PageLayout
            maxWidth={1440}
            title='초기 정류장 규칙'
            description='위치와 운행 조건에 따라 앱에서 먼저 보여 줄 정류장을 정합니다. 일치하는 규칙이 없으면 가까운 정류장을 사용합니다.'
            icon={<AddLocationAltOutlinedIcon />}>
            <Alert severity='info' sx={{ mb: 2 }}>
                지도에서 영역의 꼭짓점을 차례로 누르세요. 겹치는 영역에서는 우선순위가 높은 활성 규칙부터 평가합니다.
            </Alert>

            <Box sx={{
                display: 'grid',
                gridTemplateColumns: { xs: '1fr', lg: 'minmax(0, 3fr) minmax(340px, 2fr)' },
                gap: 2,
                alignItems: 'start',
            }}>
                <Card variant='outlined'>
                    <CardContent sx={{ p: { xs: 1, sm: 2 }, '&:last-child': { pb: { xs: 1, sm: 2 } } }}>
                        <Stack
                            direction={{ xs: 'column', sm: 'row' }}
                            spacing={1}
                            sx={{ px: { xs: 1, sm: 0 }, pb: 1.5, justifyContent: 'space-between' }}>
                            <Box>
                                <Typography variant='h6' sx={{ fontWeight: 800 }}>
                                    Geofence 영역
                                </Typography>
                                <Typography variant='body2' color='text.secondary'>
                                    꼭짓점은 드래그해서 위치를 조정할 수 있습니다.
                                </Typography>
                            </Box>
                            <Stack direction='row' spacing={1}>
                                <Button
                                    disabled={draft.polygon.length === 0}
                                    onClick={() => setDraft((current) => ({
                                        ...current,
                                        polygon: current.polygon.slice(0, -1),
                                    }))}
                                    size='small'
                                    startIcon={<UndoIcon />}>
                                    되돌리기
                                </Button>
                                <Button
                                    color='inherit'
                                    disabled={draft.polygon.length === 0}
                                    onClick={() => setDraft((current) => ({ ...current, polygon: [] }))}
                                    size='small'
                                    startIcon={<RestartAltIcon />}>
                                    초기화
                                </Button>
                            </Stack>
                        </Stack>
                        <GeofenceMap
                            onPolygonChange={(polygon) => setDraft((current) => ({ ...current, polygon }))}
                            onStopSelect={(stopName) => setDraft((current) => ({ ...current, stopName }))}
                            polygon={draft.polygon}
                            selectedStopName={draft.stopName}
                            stops={stops}
                        />
                    </CardContent>
                </Card>

                <Card variant='outlined'>
                    <CardContent>
                        <Stack direction='row' sx={{ mb: 2, justifyContent: 'space-between', alignItems: 'center' }}>
                            <Box>
                                <Typography variant='h6' sx={{ fontWeight: 800 }}>
                                    {editingSeq === null ? '새 규칙' : '규칙 수정'}
                                </Typography>
                                <Typography variant='body2' color='text.secondary'>
                                    시간은 한국 표준시(Asia/Seoul) 기준입니다.
                                </Typography>
                            </Box>
                            {editingSeq !== null && <Chip color='primary' label={`#${editingSeq} 수정 중`} size='small' />}
                        </Stack>
                        <Stack spacing={2}>
                            <TextField
                                fullWidth
                                label='규칙 이름'
                                onChange={(event) => setDraft((current) => ({ ...current, name: event.target.value }))}
                                placeholder='예: ERICA 캠퍼스 평일 오전'
                                value={draft.name}
                            />
                            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 1.5 }}>
                                <FormControl fullWidth>
                                    <InputLabel id='period-type-label'>운행 기간</InputLabel>
                                    <Select
                                        label='운행 기간'
                                        labelId='period-type-label'
                                        onChange={(event) => setDraft((current) => ({ ...current, periodType: event.target.value }))}
                                        value={draft.periodType}>
                                        {PERIOD_OPTIONS.map((option) => (
                                            <MenuItem key={option.value} value={option.value}>{option.label}</MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                                <FormControl fullWidth>
                                    <InputLabel id='weekday-label'>적용 시간표</InputLabel>
                                    <Select
                                        label='적용 시간표'
                                        labelId='weekday-label'
                                        onChange={(event) => setDraft((current) => ({
                                            ...current,
                                            weekday: event.target.value === 'weekday',
                                        }))}
                                        value={draft.weekday ? 'weekday' : 'weekend'}>
                                        <MenuItem value='weekday'>평일 시간표</MenuItem>
                                        <MenuItem value='weekend'>주말 시간표</MenuItem>
                                    </Select>
                                </FormControl>
                            </Box>
                            <FormControlLabel
                                control={
                                    <Switch
                                        checked={draft.allDay}
                                        onChange={(event) => setDraft((current) => ({ ...current, allDay: event.target.checked }))}
                                    />
                                }
                                label='하루 종일 적용'
                            />
                            {!draft.allDay && (
                                <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1.5 }}>
                                    <TextField
                                        label='시작 시간'
                                        onChange={(event) => setDraft((current) => ({ ...current, startTime: event.target.value }))}
                                        slotProps={{ htmlInput: { step: 300 }, inputLabel: { shrink: true } }}
                                        type='time'
                                        value={draft.startTime}
                                    />
                                    <TextField
                                        helperText={draft.endTime < draft.startTime ? '다음 날 종료' : '종료 시각 미포함'}
                                        label='종료 시간'
                                        onChange={(event) => setDraft((current) => ({ ...current, endTime: event.target.value }))}
                                        slotProps={{ htmlInput: { step: 300 }, inputLabel: { shrink: true } }}
                                        type='time'
                                        value={draft.endTime}
                                    />
                                </Box>
                            )}
                            <FormControl fullWidth>
                                <InputLabel id='stop-name-label'>초기 정류장</InputLabel>
                                <Select
                                    label='초기 정류장'
                                    labelId='stop-name-label'
                                    onChange={(event) => setDraft((current) => ({ ...current, stopName: event.target.value }))}
                                    value={draft.stopName}>
                                    {stops.map((stop) => (
                                        <MenuItem key={stop.name} value={stop.name}>{stop.name}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                            <TextField
                                fullWidth
                                label='우선순위'
                                onChange={(event) => setDraft((current) => ({
                                    ...current,
                                    priority: Number(event.target.value),
                                }))}
                                slotProps={{ htmlInput: { min: 0, max: 10000 } }}
                                type='number'
                                value={draft.priority}
                            />
                            <FormControlLabel
                                control={
                                    <Switch
                                        checked={draft.enabled}
                                        onChange={(event) => setDraft((current) => ({ ...current, enabled: event.target.checked }))}
                                    />
                                }
                                label='규칙 활성화'
                            />
                            {validationMessage && (
                                <Alert severity='warning'>{validationMessage}</Alert>
                            )}
                            <Stack direction={{ xs: 'column-reverse', sm: 'row' }} spacing={1}>
                                <Button
                                    color='inherit'
                                    fullWidth
                                    onClick={resetDraft}
                                    variant='outlined'>
                                    {editingSeq === null ? '입력 초기화' : '수정 취소'}
                                </Button>
                                <Button
                                    disabled={saving || Boolean(validationMessage)}
                                    fullWidth
                                    onClick={() => void saveRule()}
                                    startIcon={saving ? <CircularProgress size={18} /> : <SaveOutlinedIcon />}
                                    variant='contained'>
                                    {editingSeq === null ? '규칙 만들기' : '변경 저장'}
                                </Button>
                            </Stack>
                        </Stack>
                    </CardContent>
                </Card>
            </Box>

            <Card variant='outlined' sx={{ mt: 2 }}>
                <CardContent>
                    <Stack direction='row' spacing={1} sx={{ mb: 2, alignItems: 'center' }}>
                        <LayersOutlinedIcon color='primary' />
                        <Typography variant='h6' sx={{ fontWeight: 800 }}>등록된 규칙</Typography>
                        <Chip label={`${rules.length}개`} size='small' />
                    </Stack>
                    {loading ? (
                        <Box sx={{ display: 'grid', placeItems: 'center', minHeight: 120 }}>
                            <CircularProgress />
                        </Box>
                    ) : rules.length === 0 ? (
                        <Alert severity='info'>아직 등록된 규칙이 없습니다. 위 지도에서 첫 규칙을 만들어 보세요.</Alert>
                    ) : (
                        <Stack divider={<Divider flexItem />} spacing={0}>
                            {rules.map((rule) => (
                                <Stack
                                    direction={{ xs: 'column', md: 'row' }}
                                    key={rule.seq}
                                    sx={{ py: 1.5, gap: 1.5, alignItems: { xs: 'stretch', md: 'center' } }}>
                                    <Box sx={{ flex: 1, minWidth: 0 }}>
                                        <Stack direction='row' spacing={1} sx={{ mb: 0.5, alignItems: 'center' }}>
                                            <Typography sx={{ fontWeight: 800 }}>{rule.name}</Typography>
                                            <Chip
                                                color={rule.enabled ? 'success' : 'default'}
                                                label={rule.enabled ? '활성' : '비활성'}
                                                size='small'
                                            />
                                        </Stack>
                                        <Typography variant='body2' color='text.secondary'>
                                            {periodLabel(rule.periodType)} · {rule.weekday ? '평일 시간표' : '주말 시간표'} ·{' '}
                                            {rule.startTime === null
                                                ? '종일'
                                                : `${rule.startTime.slice(0, 5)}–${rule.endTime?.slice(0, 5)}`}
                                            {' '}· {rule.stopName} · 우선순위 {rule.priority}
                                        </Typography>
                                    </Box>
                                    <Stack direction='row' spacing={1}>
                                        <Button
                                            onClick={() => editRule(rule)}
                                            startIcon={<EditOutlinedIcon />}
                                            variant='outlined'>
                                            수정
                                        </Button>
                                        <Button
                                            color='error'
                                            onClick={() => setDeleteTarget(rule)}
                                            startIcon={<DeleteOutlineIcon />}>
                                            삭제
                                        </Button>
                                    </Stack>
                                </Stack>
                            ))}
                        </Stack>
                    )}
                </CardContent>
            </Card>

            <Dialog
                fullWidth
                maxWidth='xs'
                onClose={() => setDeleteTarget(null)}
                open={deleteTarget !== null}>
                <DialogTitle>규칙을 삭제할까요?</DialogTitle>
                <DialogContent>
                    <Typography>
                        ‘{deleteTarget?.name}’ 규칙은 삭제 후 복구할 수 없습니다.
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button color='inherit' onClick={() => setDeleteTarget(null)}>취소</Button>
                    <Button color='error' onClick={() => void confirmDelete()} variant='contained'>삭제</Button>
                </DialogActions>
            </Dialog>

            <Snackbar
                autoHideDuration={4000}
                message={message}
                onClose={() => setMessage('')}
                open={Boolean(message)}
            />
            <Snackbar
                autoHideDuration={5000}
                onClose={() => setError('')}
                open={Boolean(error)}>
                <Alert onClose={() => setError('')} severity='error' variant='filled'>
                    {error}
                </Alert>
            </Snackbar>
        </PageLayout>
    )
}
