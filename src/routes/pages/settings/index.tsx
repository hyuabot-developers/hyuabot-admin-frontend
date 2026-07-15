import DarkModeOutlinedIcon from '@mui/icons-material/DarkModeOutlined'
import LightModeOutlinedIcon from '@mui/icons-material/LightModeOutlined'
import SettingsBrightnessOutlinedIcon from '@mui/icons-material/SettingsBrightnessOutlined'
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined'
import Visibility from '@mui/icons-material/Visibility'
import VisibilityOff from '@mui/icons-material/VisibilityOff'
import {
    Button,
    Divider,
    IconButton,
    InputAdornment,
    Paper,
    TextField,
    ToggleButton,
    ToggleButtonGroup,
    Typography,
} from '@mui/material'
import { useColorScheme } from '@mui/material/styles'
import { useState } from 'react'

import { AppSnackbar } from '../../components/AppSnackbar.tsx'
import { PageLayout } from '../../components/PageLayout.tsx'

const GBIS_API_KEY_STORAGE_KEY = 'hyuabot.gbisApiKey'
type ThemeMode = 'light' | 'dark' | 'system'

export default function Settings() {
    const { mode, setMode } = useColorScheme()
    const [apiKey, setApiKey] = useState(localStorage.getItem(GBIS_API_KEY_STORAGE_KEY) ?? '')
    const [showKey, setShowKey] = useState(false)
    const [saved, setSaved] = useState(false)

    const handleSave = () => {
        if (apiKey.trim()) {
            localStorage.setItem(GBIS_API_KEY_STORAGE_KEY, apiKey.trim())
        } else {
            localStorage.removeItem(GBIS_API_KEY_STORAGE_KEY)
        }
        setSaved(true)
    }
    const handleThemeChange = (_event: React.MouseEvent<HTMLElement>, nextMode: ThemeMode | null) => {
        if (nextMode !== null) {
            setMode(nextMode)
        }
    }

    return (
        <PageLayout
            title='설정'
            description='관리 도구에서 사용하는 연결 정보를 관리합니다.'
            icon={<SettingsOutlinedIcon />}
            maxWidth={680}>
            <Paper sx={{ p: 3, mt: 2 }}>
                <Typography variant='subtitle1' fontWeight='bold' gutterBottom>
                    화면 테마
                </Typography>
                <Divider sx={{ mb: 2 }} />
                <Typography variant='body2' color='text.secondary' sx={{ mb: 2 }}>
                    시스템 설정을 선택하면 기기의 화면 모드 변경을 자동으로 따릅니다.
                </Typography>
                <ToggleButtonGroup
                    value={mode ?? 'system'}
                    onChange={handleThemeChange}
                    exclusive
                    fullWidth
                    aria-label='화면 테마'>
                    <ToggleButton value='light' aria-label='라이트 테마'>
                        <LightModeOutlinedIcon sx={{ mr: { xs: 0.75, sm: 1 } }} />
                        라이트
                    </ToggleButton>
                    <ToggleButton value='dark' aria-label='다크 테마'>
                        <DarkModeOutlinedIcon sx={{ mr: { xs: 0.75, sm: 1 } }} />
                        다크
                    </ToggleButton>
                    <ToggleButton value='system' aria-label='시스템 설정 테마'>
                        <SettingsBrightnessOutlinedIcon sx={{ mr: { xs: 0.75, sm: 1 } }} />
                        시스템
                    </ToggleButton>
                </ToggleButtonGroup>
            </Paper>
            <Paper sx={{ p: 3, mt: 2 }}>
                <Typography variant='subtitle1' fontWeight='bold' gutterBottom>
                    GBIS API 키
                </Typography>
                <Divider sx={{ mb: 2 }} />
                <Typography variant='body2' color='text.secondary' sx={{ mb: 2 }}>
                    경기도 버스정보시스템(GBIS) API 키를 입력하세요.
                    키는 브라우저 로컬 스토리지에만 저장되며 서버로 전송되지 않습니다.
                </Typography>
                <TextField
                    label='API 키'
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    type={showKey ? 'text' : 'password'}
                    fullWidth
                    size='small'
                    sx={{ mb: 2 }}
                    InputProps={{
                        endAdornment: (
                            <InputAdornment position='end'>
                                <IconButton onClick={() => setShowKey((v) => !v)} edge='end'>
                                    {showKey ? <VisibilityOff /> : <Visibility />}
                                </IconButton>
                            </InputAdornment>
                        ),
                    }}
                />
                <Button variant='contained' onClick={handleSave}>
                    저장
                </Button>
            </Paper>
            <AppSnackbar message={saved ? '저장되었습니다.' : ''} onClose={() => setSaved(false)} />
        </PageLayout>
    )
}
