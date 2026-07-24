import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded'
import CheckCircleOutlineRoundedIcon from '@mui/icons-material/CheckCircleOutlineRounded'
import ErrorOutlineRoundedIcon from '@mui/icons-material/ErrorOutlineRounded'
import LaunchRoundedIcon from '@mui/icons-material/LaunchRounded'
import RefreshRoundedIcon from '@mui/icons-material/RefreshRounded'
import ScheduleRoundedIcon from '@mui/icons-material/ScheduleRounded'
import WarningAmberRoundedIcon from '@mui/icons-material/WarningAmberRounded'
import {
    Alert,
    Box,
    Button,
    Card,
    CardActionArea,
    CardContent,
    Chip,
    IconButton,
    Paper,
    Skeleton,
    Stack,
    Tooltip,
    Typography,
} from '@mui/material'
import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { hasPermission } from '../../security/permissions.ts'
import {
    AdminOverview,
    AdminServiceStatus,
    AdminWeatherForecastStatus,
    getAdminOverview,
} from '../../service/network/overview.ts'
import { useUserInfoStore } from '../../stores/auth.ts'
import { PageLayout } from '../components/PageLayout.tsx'
import { managementSections } from '../navigation.tsx'

const statusPresentation = {
    NORMAL: { label: '정상', color: 'success' as const, icon: <CheckCircleOutlineRoundedIcon color="success" /> },
    WARNING: { label: '확인 필요', color: 'warning' as const, icon: <WarningAmberRoundedIcon color="warning" /> },
    ERROR: { label: '오류', color: 'error' as const, icon: <ErrorOutlineRoundedIcon color="error" /> },
    UNKNOWN: { label: '확인 불가', color: 'default' as const, icon: <ScheduleRoundedIcon color="disabled" /> },
}

const dateTimeFormatter = new Intl.DateTimeFormat('ko-KR', {
    month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit',
})

const formatDateTime = (value: string | null) => {
    if (!value) return '기록 없음'
    const timestamp = Date.parse(value.replace(/\[[^\]]+]$/, ''))
    return Number.isFinite(timestamp) ? dateTimeFormatter.format(timestamp) : '시각 확인 불가'
}

const weatherSourceLabels: Record<string, string> = {
    JMA_MSM: 'JMA',
    ECMWF_IFS: 'ECMWF',
    GFS_GLOBAL: 'GFS',
}

const confidenceLabels: Record<string, string> = {
    HIGH: '높음',
    MEDIUM: '보통',
    LOW: '낮음',
}

function WeatherDiagnostics({ forecast }: { forecast: AdminWeatherForecastStatus }) {
    const availableSources = forecast.sources.filter((source) => source.status === 'AVAILABLE').length
    const agreement = forecast.agreeingModelCount > 0
        ? `강수 합의 ${forecast.agreeingModelCount}/${forecast.availableModelCount}`
        : '합의된 강수 없음'
    return (
        <Stack
            spacing={1}
            sx={{
                p: 1.5,
                borderRadius: 2,
                bgcolor: 'action.hover',
            }}
            aria-label="날씨 예보 모델 상태"
        >
            <Stack
                direction={{ xs: 'column', sm: 'row' }}
                spacing={0.5}
                sx={{ justifyContent: 'space-between' }}
            >
                <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 700 }}>
                    모델 {availableSources}/{forecast.sources.length || forecast.availableModelCount} 정상
                </Typography>
                <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                    {agreement}
                    {forecast.precipitationConfidence
                        ? ` · 신뢰도 ${confidenceLabels[forecast.precipitationConfidence] ?? forecast.precipitationConfidence}`
                        : ''}
                </Typography>
            </Stack>
            <Stack direction="row" sx={{ flexWrap: 'wrap', gap: 0.75 }}>
                {forecast.sources.map((source) => (
                    <Chip
                        key={source.source}
                        size="small"
                        variant="outlined"
                        color={source.status === 'AVAILABLE' ? 'success' : 'error'}
                        label={`${weatherSourceLabels[source.source] ?? source.source} ${source.status === 'AVAILABLE' ? '정상' : '실패'}`}
                    />
                ))}
            </Stack>
            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                실황 {formatDateTime(forecast.observedAt)} · 예보 {formatDateTime(forecast.generatedAt)}
            </Typography>
        </Stack>
    )
}

function ServiceCard({
    service,
    weatherForecast,
}: {
    service: AdminServiceStatus
    weatherForecast?: AdminWeatherForecastStatus | null
}) {
    const navigate = useNavigate()
    const presentation = statusPresentation[service.status]
    return (
        <Card variant="outlined" sx={{ height: '100%', bgcolor: 'background.paper' }}>
            <CardActionArea onClick={() => navigate(service.managementPath)} sx={{ height: '100%', alignItems: 'stretch' }}>
                <CardContent sx={{ height: '100%', display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                    <Stack
                        direction="row"
                        spacing={1}
                        sx={{
                            alignItems: 'center',
                            justifyContent: 'space-between'
                        }}>
                        <Stack direction="row" spacing={1} sx={{
                            alignItems: 'center'
                        }}>
                            {presentation.icon}
                            <Typography variant="h6" component="h2">{service.title}</Typography>
                        </Stack>
                        <Chip size="small" color={presentation.color} label={presentation.label} />
                    </Stack>
                    <Typography
                        sx={{
                            color: 'text.secondary',
                            flex: 1
                        }}>{service.message}</Typography>
                    {service.lastSuccessAt && (
                        <Typography variant="caption" sx={{
                            color: 'text.secondary'
                        }}>
                            마지막 정상 갱신 {formatDateTime(service.lastSuccessAt)}
                        </Typography>
                    )}
                    {service.id === 'weather' && weatherForecast && (
                        <WeatherDiagnostics forecast={weatherForecast} />
                    )}
                    <Stack
                        direction="row"
                        spacing={0.5}
                        sx={{
                            justifyContent: 'flex-end',
                            alignItems: 'center',
                            color: 'primary.main'
                        }}>
                        <Typography variant="button">관리 화면</Typography>
                        <ArrowForwardRoundedIcon fontSize="small" />
                    </Stack>
                </CardContent>
            </CardActionArea>
        </Card>
    )
}

export default function Dashboard() {
    const permissions = useUserInfoStore((state) => state.permissions)
    const navigate = useNavigate()
    const [overview, setOverview] = useState<AdminOverview | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')

    const load = async () => {
        setLoading(true)
        setError('')
        try {
            const response = await getAdminOverview()
            setOverview(response.data)
        } catch (requestError) {
            setError(requestError instanceof Error ? requestError.message : String(requestError))
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => { load() }, [])

    const attentionCount = overview?.services.filter((service) => service.status !== 'NORMAL').length ?? 0
    const quickActions = useMemo(
        () => managementSections.filter((section) => hasPermission(permissions, section.permission)).slice(0, 6),
        [permissions],
    )

    return (
        <PageLayout title="운영 요약" description="현재 서비스 상태와 자주 사용하는 관리 작업을 확인합니다.">
            <Stack spacing={3} sx={{ width: '100%', pb: 3 }}>
                <Paper
                    variant="outlined"
                    sx={{
                        p: { xs: 2.5, md: 3.5 },
                        background: (theme) => theme.applyStyles('light', {
                            background: 'linear-gradient(135deg, #f7fbff 0%, #eef5fc 100%)',
                        }),
                    }}
                >
                    <Stack
                        direction={{ xs: 'column', sm: 'row' }}
                        sx={{
                            justifyContent: 'space-between',
                            gap: 2
                        }}>
                        <Box>
                            <Typography
                                variant="overline"
                                sx={{
                                    color: 'primary.main',
                                    fontWeight: 700
                                }}>운영 요약</Typography>
                            <Typography variant="h4" component="h1" sx={{ mt: 0.5, fontWeight: 750 }}>
                                {attentionCount > 0 ? `${attentionCount}개 항목을 확인해주세요` : '현재 운영 상태가 정상입니다'}
                            </Typography>
                            <Typography
                                sx={{
                                    color: 'text.secondary',
                                    mt: 1
                                }}>
                                자동 수집 상태와 오늘 적용되는 셔틀 운행 정보를 한눈에 확인할 수 있습니다.
                            </Typography>
                        </Box>
                        <Stack direction="row" spacing={1} sx={{
                            alignItems: 'flex-start'
                        }}>
                            {overview && (
                                <Button
                                    variant="outlined"
                                    startIcon={<LaunchRoundedIcon />}
                                    href={overview.grafanaURL}
                                    target="_blank"
                                    rel="noreferrer"
                                >
                                    Grafana
                                </Button>
                            )}
                            <Tooltip title="새로고침">
                                <span><IconButton onClick={load} disabled={loading} aria-label="운영 상태 새로고침"><RefreshRoundedIcon /></IconButton></span>
                            </Tooltip>
                        </Stack>
                    </Stack>
                </Paper>

                {error && <Alert severity="error">운영 상태를 불러오지 못했습니다: {error}</Alert>}
                {overview?.expiringInvitationCount !== null && Boolean(overview?.expiringInvitationCount) && (
                    <Alert severity="warning" action={<Button onClick={() => navigate('/admin/users')}>사용자 확인</Button>}>
                        24시간 안에 만료되는 관리자 초대가 {overview?.expiringInvitationCount}개 있습니다.
                    </Alert>
                )}

                <Box>
                    <Typography
                        variant="h5"
                        component="h2"
                        sx={{
                            fontWeight: 700,
                            mb: 1.5
                        }}>서비스 상태</Typography>
                    <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, minmax(0, 1fr))', xl: 'repeat(4, minmax(0, 1fr))' }, gap: 2 }}>
                        {loading
                            ? Array.from({ length: 4 }).map((_, index) => <Skeleton key={index} variant="rounded" height={190} />)
                            : overview?.services.map((service) => (
                                <ServiceCard
                                    key={service.id}
                                    service={service}
                                    weatherForecast={overview.weatherForecast}
                                />
                            ))}
                    </Box>
                    {!loading && overview?.services.length === 0 && (
                        <Alert severity="info">자동 상태를 제공하는 관리 영역이 없습니다. 아래 바로가기를 이용해주세요.</Alert>
                    )}
                </Box>

                {quickActions.length > 0 && (
                    <Box>
                        <Typography
                            variant="h5"
                            component="h2"
                            sx={{
                                fontWeight: 700,
                                mb: 1.5
                            }}>빠른 작업</Typography>
                        <Stack
                            direction="row"
                            sx={{
                                flexWrap: 'wrap',
                                gap: 1
                            }}>
                            {quickActions.map((section) => (
                                <Button
                                    key={section.path}
                                    variant="outlined"
                                    startIcon={<section.icon />}
                                    onClick={() => navigate(section.defaultPath)}
                                >
                                    {section.label} 관리
                                </Button>
                            ))}
                        </Stack>
                    </Box>
                )}

                {overview && (
                    <Typography
                        variant="caption"
                        sx={{
                            color: 'text.secondary',
                            textAlign: 'right'
                        }}>
                        마지막 확인 {formatDateTime(overview.checkedAt)}
                    </Typography>
                )}
            </Stack>
        </PageLayout>
    )
}
