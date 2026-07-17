import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded'
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded'
import ErrorOutlineRoundedIcon from '@mui/icons-material/ErrorOutlineRounded'
import RefreshRoundedIcon from '@mui/icons-material/RefreshRounded'
import RuleRoundedIcon from '@mui/icons-material/RuleRounded'
import SyncRoundedIcon from '@mui/icons-material/SyncRounded'
import WarningAmberRoundedIcon from '@mui/icons-material/WarningAmberRounded'
import {
    Alert,
    Box,
    Button,
    Card,
    CardContent,
    Chip,
    Divider,
    Paper,
    Skeleton,
    Stack,
    Typography,
} from '@mui/material'
import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import {
    getHolidayAudit,
    HolidayAudit,
    HolidayAuditIssue,
} from '../../../service/network/overview.ts'
import { PageLayout } from '../../components/PageLayout.tsx'

type SeverityFilter = 'ALL' | HolidayAuditIssue['severity']

const dateTimeFormatter = new Intl.DateTimeFormat('ko-KR', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
})

const dateFormatter = new Intl.DateTimeFormat('ko-KR', {
    month: 'long',
    day: 'numeric',
    weekday: 'short',
})

const parseBackendDate = (value: string) =>
    Date.parse(value.replace(/\[[^\]]+]$/, ''))

const formatDateTime = (value: string | null) => {
    if (!value) return '정상 동기화 기록 없음'
    const timestamp = parseBackendDate(value)
    return Number.isFinite(timestamp)
        ? dateTimeFormatter.format(timestamp)
        : '시각 확인 불가'
}

const formatDate = (value: string | null) => {
    if (!value) return '상시 점검 항목'
    const [year, month, day] = value.split('-').map(Number)
    const date = new Date(year, month - 1, day)
    return Number.isFinite(date.valueOf()) ? dateFormatter.format(date) : value
}

const serviceLabels: Record<HolidayAuditIssue['service'], string> = {
    holiday: '공식 공휴일',
    shuttle: '셔틀버스',
    bus: '노선버스',
    subway: '전철',
}

function SummaryCard({
    label,
    value,
    tone,
    icon,
}: {
    label: string
    value: string | number
    tone: 'error' | 'warning' | 'success'
    icon: React.ReactNode
}) {
    return (
        <Paper variant="outlined" sx={{ p: 2.25, minWidth: 0 }}>
            <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="flex-start"
                gap={1}
            >
                <Box>
                    <Typography variant="body2" color="text.secondary">
                        {label}
                    </Typography>
                    <Typography
                        variant="h4"
                        component="p"
                        fontWeight={750}
                        sx={{ mt: 0.5 }}
                    >
                        {value}
                    </Typography>
                </Box>
                <Box sx={{ color: `${tone}.main`, display: 'flex' }}>
                    {icon}
                </Box>
            </Stack>
        </Paper>
    )
}

function IssueCard({ issue }: { issue: HolidayAuditIssue }) {
    const navigate = useNavigate()
    const error = issue.severity === 'ERROR'
    return (
        <Card
            variant="outlined"
            component="article"
            sx={{
                borderLeft: 4,
                borderLeftColor: error ? 'error.main' : 'warning.main',
            }}
        >
            <CardContent
                sx={{
                    p: { xs: 2, sm: 2.5 },
                    pb: { xs: 2, sm: 2.5 },
                }}
            >
                <Stack
                    direction={{ xs: 'column', sm: 'row' }}
                    justifyContent="space-between"
                    gap={2}
                >
                    <Stack spacing={1.25} sx={{ minWidth: 0 }}>
                        <Stack
                            direction="row"
                            flexWrap="wrap"
                            gap={1}
                            alignItems="center"
                        >
                            <Chip
                                size="small"
                                color={error ? 'error' : 'warning'}
                                icon={
                                    error ? (
                                        <ErrorOutlineRoundedIcon />
                                    ) : (
                                        <WarningAmberRoundedIcon />
                                    )
                                }
                                label={error ? '즉시 확인' : '사전 확인'}
                            />
                            <Chip
                                size="small"
                                variant="outlined"
                                label={serviceLabels[issue.service]}
                            />
                            <Typography variant="body2" color="text.secondary">
                                {formatDate(issue.date)}
                            </Typography>
                        </Stack>
                        <Typography
                            variant="h6"
                            component="h2"
                            sx={{ overflowWrap: 'anywhere' }}
                        >
                            {issue.message}
                        </Typography>
                    </Stack>
                    <Button
                        variant={error ? 'contained' : 'outlined'}
                        color={error ? 'error' : 'primary'}
                        endIcon={<ArrowForwardRoundedIcon />}
                        onClick={() => navigate(issue.managementPath)}
                        sx={{
                            alignSelf: { xs: 'stretch', sm: 'center' },
                            flexShrink: 0,
                        }}
                    >
                        설정 확인
                    </Button>
                </Stack>
            </CardContent>
        </Card>
    )
}

function SummaryGrid({
    audit,
    counts,
    loading,
}: {
    audit: HolidayAudit | null
    counts: Record<HolidayAuditIssue['severity'], number>
    loading: boolean
}) {
    if (loading) {
        return Array.from({ length: 3 }).map((_, index) => (
            <Skeleton key={index} variant="rounded" height={116} />
        ))
    }
    return (
        <>
            <SummaryCard
                label="즉시 확인"
                value={counts.ERROR}
                tone="error"
                icon={<ErrorOutlineRoundedIcon fontSize="large" />}
            />
            <SummaryCard
                label="사전 확인"
                value={counts.WARNING}
                tone="warning"
                icon={<WarningAmberRoundedIcon fontSize="large" />}
            />
            <SummaryCard
                label="공휴일 마지막 동기화"
                value={formatDateTime(audit?.lastSuccessAt ?? null)}
                tone="success"
                icon={<SyncRoundedIcon fontSize="large" />}
            />
        </>
    )
}

function IssueResults({
    audit,
    issues,
    loading,
}: {
    audit: HolidayAudit | null
    issues: HolidayAuditIssue[]
    loading: boolean
}) {
    if (loading) {
        return (
            <Stack spacing={1.5}>
                {Array.from({ length: 3 }).map((_, index) => (
                    <Skeleton key={index} variant="rounded" height={128} />
                ))}
            </Stack>
        )
    }
    if (issues.length > 0) {
        return (
            <Stack spacing={1.5}>
                {issues.map((issue, index) => (
                    <IssueCard
                        key={`${issue.code}-${issue.date ?? 'global'}-${index}`}
                        issue={issue}
                    />
                ))}
            </Stack>
        )
    }
    if (audit?.issues.length === 0) {
        return (
            <Paper
                variant="outlined"
                sx={{ p: { xs: 3, sm: 5 }, textAlign: 'center' }}
            >
                <CheckCircleRoundedIcon color="success" sx={{ fontSize: 48 }} />
                <Typography variant="h6" sx={{ mt: 1 }}>
                    향후 90일의 휴일 시간표 설정이 정상입니다.
                </Typography>
                <Typography color="text.secondary" sx={{ mt: 0.5 }}>
                    공휴일 동기화와 교통수단별 시간표 보유 여부를 확인했습니다.
                </Typography>
            </Paper>
        )
    }
    return (
        <Alert severity="info">선택한 심각도에 해당하는 항목이 없습니다.</Alert>
    )
}

export default function HolidayAuditPage() {
    const [audit, setAudit] = useState<HolidayAudit | null>(null)
    const [filter, setFilter] = useState<SeverityFilter>('ALL')
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')

    const load = async () => {
        setLoading(true)
        setError('')
        try {
            const response = await getHolidayAudit()
            setAudit(response.data)
        } catch (requestError) {
            setError(
                requestError instanceof Error
                    ? requestError.message
                    : String(requestError),
            )
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        void load()
    }, [])

    const counts = useMemo(
        () => ({
            ERROR:
                audit?.issues.filter((issue) => issue.severity === 'ERROR')
                    .length ?? 0,
            WARNING:
                audit?.issues.filter((issue) => issue.severity === 'WARNING')
                    .length ?? 0,
        }),
        [audit],
    )
    const visibleIssues =
        audit?.issues.filter(
            (issue) => filter === 'ALL' || issue.severity === filter,
        ) ?? []

    return (
        <PageLayout
            title="휴일 시간표 점검"
            description="공식 공휴일 동기화와 교통수단별 휴일 운행 설정을 한 곳에서 확인합니다."
            icon={<RuleRoundedIcon />}
            actions={
                <Button
                    variant="outlined"
                    startIcon={<RefreshRoundedIcon />}
                    onClick={() => void load()}
                    disabled={loading}
                >
                    새로고침
                </Button>
            }
        >
            <Stack spacing={3} sx={{ pb: 4 }}>
                <Alert severity="info" icon={<SyncRoundedIcon />}>
                    노선버스·전철은 공식 공휴일에 휴일 시간표를 사용합니다.
                    셔틀은 날짜별로 ‘주말 운행’ 또는 ‘운행 안 함’을 결정하고,
                    미설정 시 주말 시간표로 안전하게 적용됩니다.
                </Alert>

                {error && (
                    <Alert
                        severity="error"
                        action={
                            <Button color="inherit" onClick={() => void load()}>
                                다시 시도
                            </Button>
                        }
                    >
                        점검 결과를 불러오지 못했습니다. {error}
                    </Alert>
                )}

                <Box
                    sx={{
                        display: 'grid',
                        gridTemplateColumns: {
                            xs: '1fr',
                            sm: 'repeat(3, minmax(0, 1fr))',
                        },
                        gap: 2,
                    }}
                >
                    <SummaryGrid
                        audit={audit}
                        counts={counts}
                        loading={loading}
                    />
                </Box>

                <Box component="section" aria-labelledby="holiday-issues-title">
                    <Stack
                        direction={{ xs: 'column', sm: 'row' }}
                        justifyContent="space-between"
                        alignItems={{ xs: 'stretch', sm: 'center' }}
                        gap={1.5}
                        sx={{ mb: 1.5 }}
                    >
                        <Box>
                            <Typography
                                id="holiday-issues-title"
                                variant="h5"
                                component="h2"
                                fontWeight={700}
                            >
                                점검 항목
                            </Typography>
                            <Typography
                                variant="body2"
                                color="text.secondary"
                                sx={{ mt: 0.5 }}
                            >
                                운행일 3일 이내 문제는 즉시 확인으로 표시됩니다.
                            </Typography>
                        </Box>
                        <Stack
                            direction="row"
                            flexWrap="wrap"
                            gap={1}
                            role="group"
                            aria-label="심각도 필터"
                        >
                            {(
                                [
                                    [
                                        'ALL',
                                        `전체 ${audit?.issues.length ?? 0}`,
                                    ],
                                    ['ERROR', `즉시 ${counts.ERROR}`],
                                    ['WARNING', `사전 ${counts.WARNING}`],
                                ] as const
                            ).map(([value, label]) => (
                                <Chip
                                    key={value}
                                    label={label}
                                    color={
                                        filter === value ? 'primary' : 'default'
                                    }
                                    variant={
                                        filter === value ? 'filled' : 'outlined'
                                    }
                                    onClick={() => setFilter(value)}
                                />
                            ))}
                        </Stack>
                    </Stack>
                    <Divider sx={{ mb: 2 }} />

                    <IssueResults
                        audit={audit}
                        issues={visibleIssues}
                        loading={loading}
                    />
                </Box>

                {audit && (
                    <Typography
                        variant="caption"
                        color="text.secondary"
                        textAlign="right"
                    >
                        마지막 점검 {formatDateTime(audit.checkedAt)}
                    </Typography>
                )}
            </Stack>
        </PageLayout>
    )
}
