import NotificationsActiveOutlinedIcon from '@mui/icons-material/NotificationsActiveOutlined'
import NotificationsOffOutlinedIcon from '@mui/icons-material/NotificationsOffOutlined'
import { Alert, Box, Button, CircularProgress, Stack, Typography } from '@mui/material'
import { useEffect, useState } from 'react'

import { SettingsCard } from './SettingsCard.tsx'
import {
    disableOperationalPush,
    enableOperationalPush,
    getPushAvailability,
    isOperationalPushEnabled,
    PushSetupError,
} from '../../../pwa/push.ts'

type AlertState = 'checking' | 'disabled' | 'enabled' | 'error'

export function OperationalAlerts() {
    const availability = getPushAvailability()
    const [state, setState] = useState<AlertState>('checking')

    useEffect(() => {
        let active = true
        if (availability !== 'available') {
            setState('disabled')
            return () => { active = false }
        }

        isOperationalPushEnabled()
            .then((enabled) => { if (active) setState(enabled ? 'enabled' : 'disabled') })
            .catch(() => { if (active) setState('error') })
        return () => { active = false }
    }, [availability])

    const handleEnable = async () => {
        setState('checking')
        try {
            await enableOperationalPush()
            setState('enabled')
        } catch (error: unknown) {
            setState(error instanceof PushSetupError && error.reason === 'denied' ? 'disabled' : 'error')
        }
    }

    const handleDisable = async () => {
        setState('checking')
        try {
            await disableOperationalPush()
            setState('disabled')
        } catch {
            setState('error')
        }
    }

    const guidance = getGuidance(availability, state)
    return (
        <SettingsCard icon={<NotificationsActiveOutlinedIcon />} title='운영 알림'>
            <Stack spacing={2}>
                <Typography variant='body2' sx={{
                    color: 'text.secondary'
                }}>
                    백엔드 또는 수집 작업에 장애가 발생하거나 복구되면 이 기기로 알려드립니다. 상태가 바뀔 때만 전송합니다.
                </Typography>
                <Alert severity={guidance.severity} icon={state === 'checking' ? <CircularProgress size={20} /> : undefined}>
                    {guidance.message}
                </Alert>
                <Box>
                    {state === 'enabled' ? (
                        <Button
                            variant='outlined'
                            color='inherit'
                            startIcon={<NotificationsOffOutlinedIcon />}
                            onClick={handleDisable}>
                            이 기기 알림 끄기
                        </Button>
                    ) : (
                        <Button
                            variant='contained'
                            startIcon={<NotificationsActiveOutlinedIcon />}
                            disabled={availability !== 'available' || state === 'checking'}
                            onClick={handleEnable}>
                            {state === 'checking' ? '상태 확인 중' : '이 기기에서 알림 받기'}
                        </Button>
                    )}
                </Box>
                <Typography variant='caption' sx={{
                    color: 'text.secondary'
                }}>
                    macOS Safari 16.1 이상 또는 홈 화면에 설치한 iOS·iPadOS 16.4 이상에서 사용할 수 있습니다.
                </Typography>
            </Stack>
        </SettingsCard>
    )
}

function getGuidance(availability: ReturnType<typeof getPushAvailability>, state: AlertState): {
    severity: 'error' | 'info' | 'success' | 'warning',
    message: string,
} {
    if (availability === 'install-required') return {
        severity: 'info',
        message: 'iPhone 또는 iPad에서는 Safari 공유 메뉴의 “홈 화면에 추가”로 대시보드를 설치한 뒤, 설치된 앱에서 설정을 열어주세요.',
    }
    if (availability === 'unsupported') return {
        severity: 'warning',
        message: '현재 브라우저는 웹 푸시를 지원하지 않습니다. 지원되는 Safari에서 다시 시도해주세요.',
    }
    if (availability === 'denied') return {
        severity: 'warning',
        message: '브라우저에서 알림이 차단되어 있습니다. Safari의 웹사이트 설정에서 알림 권한을 허용해주세요.',
    }
    if (state === 'checking') return { severity: 'info', message: '이 기기의 알림 설정을 확인하고 있습니다.' }
    if (state === 'enabled') return { severity: 'success', message: '이 기기에서 운영 알림을 받고 있습니다.' }
    if (state === 'error') return { severity: 'error', message: '알림 서버에 연결하지 못했습니다. 잠시 후 다시 시도해주세요.' }
    return { severity: 'info', message: '알림은 이 기기에서 직접 허용한 경우에만 전송됩니다.' }
}
