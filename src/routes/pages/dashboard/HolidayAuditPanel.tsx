import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined'
import CheckRoundedIcon from '@mui/icons-material/CheckRounded'
import OpenInNewRoundedIcon from '@mui/icons-material/OpenInNewRounded'
import WarningAmberRoundedIcon from '@mui/icons-material/WarningAmberRounded'
import {
    Alert,
    Box,
    Button,
    Chip,
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormControl,
    FormHelperText,
    InputLabel,
    MenuItem,
    Paper,
    Select,
    Skeleton,
    Stack,
    Typography,
} from '@mui/material'
import type { SelectChangeEvent } from '@mui/material'
import { useId, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import type { HolidayAudit, HolidayAuditIssue } from '../../../service/network/overview.ts'
import { createShuttleHoliday } from '../../../service/network/shuttle.ts'
import { AppSnackbar } from '../../components/AppSnackbar.tsx'

type HolidayDecision = '' | 'weekends' | 'halt'

type HolidayAuditPanelProps = {
    audit: HolidayAudit | null,
    loading: boolean,
    error: string,
    onRetry: () => void,
    onResolved: () => Promise<void>,
}

const decisionIssueCode = 'SHUTTLE_DECISION_MISSING'

const issueKey = (issue: HolidayAuditIssue) =>
    `${issue.code}:${issue.date ?? 'undated'}:${issue.message}`

const holidayDateFormatter = new Intl.DateTimeFormat('ko-KR', {
    dateStyle: 'full',
    timeZone: 'Asia/Seoul',
})

const formatHolidayDate = (date: string | null) => {
    if (!date) return '날짜 미확인'
    const value = new Date(`${date}T00:00:00+09:00`)
    return Number.isNaN(value.getTime()) ? date : holidayDateFormatter.format(value)
}

const saveErrorMessage = (error: unknown) => {
    const status = (error as { response?: { status?: number } })?.response?.status
    if (status === 409) return '이미 이 날짜의 셔틀 운행 방식이 설정되어 있습니다. 점검 목록을 새로고침해 주세요.'
    if (status === 403) return '셔틀 휴일 설정을 변경할 권한이 없습니다.'
    return '운행 방식 저장에 실패했습니다. 잠시 후 다시 시도해 주세요.'
}

export function HolidayAuditPanel({
    audit,
    loading,
    error,
    onRetry,
    onResolved,
}: HolidayAuditPanelProps) {
    const navigate = useNavigate()
    const selectId = useId()
    const [decisions, setDecisions] = useState<Record<string, HolidayDecision>>({})
    const [savingKey, setSavingKey] = useState('')
    const [rowErrors, setRowErrors] = useState<Record<string, string>>({})
    const [notice, setNotice] = useState('')
    const [haltConfirmation, setHaltConfirmation] = useState<HolidayAuditIssue | null>(null)

    const decisionIssues = useMemo(
        () => audit?.issues.filter((issue) => issue.code === decisionIssueCode && issue.date) ?? [],
        [audit],
    )
    const otherIssues = useMemo(
        () => audit?.issues.filter((issue) => issue.code !== decisionIssueCode || !issue.date) ?? [],
        [audit],
    )

    const updateDecision = (issue: HolidayAuditIssue, event: SelectChangeEvent<HolidayDecision>) => {
        const key = issueKey(issue)
        setDecisions((current) => ({ ...current, [key]: event.target.value as HolidayDecision }))
        setRowErrors((current) => ({ ...current, [key]: '' }))
    }

    const saveDecision = async (issue: HolidayAuditIssue) => {
        const key = issueKey(issue)
        const decision = decisions[key]
        if (!issue.date || !decision) {
            setRowErrors((current) => ({ ...current, [key]: '적용할 운행 방식을 선택해 주세요.' }))
            return
        }

        setSavingKey(key)
        setRowErrors((current) => ({ ...current, [key]: '' }))
        try {
            await createShuttleHoliday({
                date: issue.date,
                calendarType: 'solar',
                type: decision,
            })
            setNotice(`${formatHolidayDate(issue.date)}을(를) ${
                decision === 'weekends' ? '주말 시간표 운행' : '운행 중지'
            }로 설정했습니다.`)
            setDecisions((current) => {
                const next = { ...current }
                delete next[key]
                return next
            })
            await onResolved()
        } catch (requestError) {
            setRowErrors((current) => ({ ...current, [key]: saveErrorMessage(requestError) }))
        } finally {
            setSavingKey('')
        }
    }

    const requestSave = (issue: HolidayAuditIssue) => {
        const key = issueKey(issue)
        const decision = decisions[key]
        if (!decision) {
            setRowErrors((current) => ({ ...current, [key]: '적용할 운행 방식을 선택해 주세요.' }))
            return
        }
        if (decision === 'halt') {
            setHaltConfirmation(issue)
            return
        }
        saveDecision(issue)
    }

    return (
        <Paper variant="outlined" sx={{ overflow: 'hidden' }}>
            <Stack
                direction={{ xs: 'column', sm: 'row' }}
                sx={{
                    alignItems: { xs: 'flex-start', sm: 'center' },
                    justifyContent: 'space-between',
                    gap: 1.5,
                    px: { xs: 2, sm: 2.5 },
                    py: 2,
                    borderBottom: 1,
                    borderColor: 'divider',
                }}
            >
                <Box>
                    <Typography variant="h5" component="h2" sx={{ fontWeight: 700 }}>휴일 시간표 점검</Typography>
                    <Typography sx={{ color: 'text.secondary', mt: 0.5 }}>
                        향후 90일의 공휴일별 셔틀 운행 방식을 대시보드에서 바로 결정합니다.
                    </Typography>
                </Box>
                {!loading && (
                    <Chip
                        icon={decisionIssues.length > 0 ? <WarningAmberRoundedIcon /> : <CheckRoundedIcon />}
                        color={decisionIssues.length > 0 ? 'warning' : 'success'}
                        label={decisionIssues.length > 0 ? `결정 필요 ${decisionIssues.length}건` : '설정 완료'}
                        variant="outlined"
                    />
                )}
            </Stack>

            <Box sx={{ p: { xs: 2, sm: 2.5 } }}>
                {loading && (
                    <Stack spacing={1.5}>
                        <Skeleton variant="rounded" height={112} />
                        <Skeleton variant="rounded" height={112} />
                    </Stack>
                )}

                {!loading && error && (
                    <Alert
                        severity="error"
                        action={<Button color="inherit" size="small" onClick={onRetry}>다시 시도</Button>}
                    >
                        {error}
                    </Alert>
                )}

                {!loading && !error && audit && audit.issues.length === 0 && (
                    <Alert severity="success">향후 90일의 휴일 시간표 설정이 모두 완료되었습니다.</Alert>
                )}

                {!loading && !error && decisionIssues.length > 0 && (
                    <Stack spacing={1.5}>
                        {decisionIssues.map((issue, index) => {
                            const key = issueKey(issue)
                            const value = decisions[key] ?? ''
                            const saving = savingKey === key
                            const labelId = `${selectId}-${index}-label`
                            const helperId = `${selectId}-${index}-helper`
                            return (
                                <Paper
                                    key={key}
                                    variant="outlined"
                                    sx={{
                                        p: { xs: 1.75, sm: 2 },
                                        bgcolor: 'background.default',
                                        borderLeft: 4,
                                        borderLeftColor: 'warning.main',
                                    }}
                                >
                                    <Stack
                                        direction={{ xs: 'column', md: 'row' }}
                                        sx={{
                                            alignItems: { xs: 'stretch', md: 'center' },
                                            justifyContent: 'space-between',
                                            gap: 2,
                                        }}
                                    >
                                        <Stack direction="row" spacing={1.5} sx={{ minWidth: 0 }}>
                                            <CalendarMonthOutlinedIcon color="action" sx={{ mt: 0.25, flexShrink: 0 }} />
                                            <Box sx={{ minWidth: 0 }}>
                                                <Typography sx={{ fontWeight: 700 }}>{formatHolidayDate(issue.date)}</Typography>
                                                <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.5 }}>
                                                    {issue.message}
                                                </Typography>
                                            </Box>
                                        </Stack>
                                        <Stack
                                            direction={{ xs: 'column', sm: 'row' }}
                                            spacing={1}
                                            sx={{
                                                alignItems: { xs: 'stretch', sm: 'flex-start' },
                                                width: { xs: '100%', md: 'auto' },
                                                flexShrink: 0,
                                            }}
                                        >
                                            <FormControl
                                                size="small"
                                                error={Boolean(rowErrors[key])}
                                                sx={{ minWidth: { sm: 240 } }}
                                            >
                                                <InputLabel id={labelId}>운행 방식</InputLabel>
                                                <Select
                                                    aria-describedby={helperId}
                                                    labelId={labelId}
                                                    value={value}
                                                    label="운행 방식"
                                                    disabled={saving}
                                                    onChange={(event) => updateDecision(issue, event)}
                                                >
                                                    <MenuItem value="weekends">주말 시간표로 운행</MenuItem>
                                                    <MenuItem value="halt">운행 중지</MenuItem>
                                                </Select>
                                                <FormHelperText id={helperId}>
                                                    {rowErrors[key] || '선택 후 적용해 주세요.'}
                                                </FormHelperText>
                                            </FormControl>
                                            <Button
                                                variant="contained"
                                                disabled={!value || saving}
                                                onClick={() => requestSave(issue)}
                                                startIcon={saving ? <CircularProgress size={16} color="inherit" /> : undefined}
                                                sx={{ minWidth: 88 }}
                                            >
                                                {saving ? '저장 중' : '적용'}
                                            </Button>
                                        </Stack>
                                    </Stack>
                                </Paper>
                            )
                        })}
                    </Stack>
                )}

                {!loading && !error && otherIssues.length > 0 && (
                    <Stack spacing={1} sx={{ mt: decisionIssues.length > 0 ? 2 : 0 }}>
                        {otherIssues.map((issue) => (
                            <Alert
                                key={issueKey(issue)}
                                severity={issue.severity === 'ERROR' ? 'error' : 'warning'}
                                action={
                                    <Button
                                        color="inherit"
                                        size="small"
                                        endIcon={<OpenInNewRoundedIcon fontSize="small" />}
                                        onClick={() => navigate(issue.managementPath)}
                                    >
                                        관리
                                    </Button>
                                }
                            >
                                {issue.message}
                            </Alert>
                        ))}
                    </Stack>
                )}
            </Box>

            <Dialog
                open={haltConfirmation !== null}
                onClose={() => savingKey === '' && setHaltConfirmation(null)}
                fullWidth
                maxWidth="xs"
            >
                <DialogTitle>셔틀 운행을 중지할까요?</DialogTitle>
                <DialogContent>
                    <Typography>
                        {haltConfirmation && formatHolidayDate(haltConfirmation.date)}에는 셔틀 시간표가 제공되지 않습니다.
                        이 설정은 사용자 앱에 바로 반영될 수 있습니다.
                    </Typography>
                </DialogContent>
                <DialogActions sx={{ p: 2 }}>
                    <Button onClick={() => setHaltConfirmation(null)} disabled={savingKey !== ''}>취소</Button>
                    <Button
                        variant="contained"
                        color="error"
                        disabled={!haltConfirmation || savingKey !== ''}
                        onClick={() => {
                            if (!haltConfirmation) return
                            const issue = haltConfirmation
                            setHaltConfirmation(null)
                            saveDecision(issue)
                        }}
                    >
                        운행 중지 적용
                    </Button>
                </DialogActions>
            </Dialog>

            <AppSnackbar message={notice} onClose={() => setNotice('')} />
        </Paper>
    )
}
