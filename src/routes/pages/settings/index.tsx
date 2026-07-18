import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined'
import DarkModeOutlinedIcon from '@mui/icons-material/DarkModeOutlined'
import LightModeOutlinedIcon from '@mui/icons-material/LightModeOutlined'
import LockResetOutlinedIcon from '@mui/icons-material/LockResetOutlined'
import SettingsBrightnessOutlinedIcon from '@mui/icons-material/SettingsBrightnessOutlined'
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined'
import Visibility from '@mui/icons-material/Visibility'
import VisibilityOff from '@mui/icons-material/VisibilityOff'
import {
    Alert,
    Box,
    Button,
    IconButton,
    InputAdornment,
    Stack,
    TextField,
    ToggleButton,
    ToggleButtonGroup,
    Typography,
} from '@mui/material'
import { useColorScheme } from '@mui/material/styles'
import axios from 'axios'
import { useState } from 'react'
import type { MouseEvent } from 'react'

import { OperationalAlerts } from './OperationalAlerts.tsx'
import { SettingsCard } from './SettingsCard.tsx'
import { isValidPassword, PASSWORD_REQUIREMENTS } from '../../../security/password.ts'
import { changePassword, updateProfile } from '../../../service/network/auth.ts'
import { useUserInfoStore } from '../../../stores/auth.ts'
import { AppSnackbar } from '../../components/AppSnackbar.tsx'
import { PageLayout } from '../../components/PageLayout.tsx'

const GBIS_API_KEY_STORAGE_KEY = 'hyuabot.gbisApiKey'
type ThemeMode = 'light' | 'dark' | 'system'

export default function Settings() {
    const { mode, setMode } = useColorScheme()
    const userInfo = useUserInfoStore()
    const [nickname, setNickname] = useState(userInfo.nickname ?? '')
    const [email, setEmail] = useState(userInfo.email ?? '')
    const [phone, setPhone] = useState(userInfo.phone ?? '')
    const [profileSaving, setProfileSaving] = useState(false)
    const [currentPassword, setCurrentPassword] = useState('')
    const [newPassword, setNewPassword] = useState('')
    const [passwordConfirm, setPasswordConfirm] = useState('')
    const [passwordSaving, setPasswordSaving] = useState(false)
    const [showPassword, setShowPassword] = useState(false)
    const [apiKey, setApiKey] = useState(localStorage.getItem(GBIS_API_KEY_STORAGE_KEY) ?? '')
    const [showKey, setShowKey] = useState(false)
    const [notice, setNotice] = useState('')
    const [error, setError] = useState('')

    const handleProfileSave = async () => {
        setProfileSaving(true)
        setError('')
        try {
            const response = await updateProfile({ nickname, email, phone })
            const profile = response.data
            userInfo.setUserInfo(profile.username, profile.nickname, profile.email, profile.phone, profile.permissions)
            setNickname(profile.nickname)
            setEmail(profile.email)
            setPhone(profile.phone)
            setNotice('내 정보를 저장했습니다.')
        } catch (requestError: unknown) {
            const duplicateEmail = axios.isAxiosError<{ message?: string }>(requestError) &&
                requestError.response?.data?.message === 'DUPLICATE_EMAIL'
            setError(duplicateEmail ? '이미 등록된 이메일입니다.' : '내 정보를 저장하지 못했습니다.')
        } finally {
            setProfileSaving(false)
        }
    }

    const validNewPassword = isValidPassword(newPassword)
    const handlePasswordChange = async () => {
        setPasswordSaving(true)
        setError('')
        try {
            await changePassword(currentPassword, newPassword)
            window.location.assign('/login')
        } catch (requestError: unknown) {
            const wrongPassword = axios.isAxiosError<{ message?: string }>(requestError) &&
                requestError.response?.data?.message === 'CURRENT_PASSWORD_MISMATCH'
            setError(wrongPassword ? '현재 비밀번호가 일치하지 않습니다.' : '비밀번호를 변경하지 못했습니다.')
        } finally {
            setPasswordSaving(false)
        }
    }

    const handleApiKeySave = () => {
        if (apiKey.trim()) localStorage.setItem(GBIS_API_KEY_STORAGE_KEY, apiKey.trim())
        else localStorage.removeItem(GBIS_API_KEY_STORAGE_KEY)
        setNotice('API 키를 저장했습니다.')
    }

    const handleThemeChange = (_event: MouseEvent<HTMLElement>, nextMode: ThemeMode | null) => {
        if (nextMode !== null) setMode(nextMode)
    }

    return (
        <PageLayout
            title='설정'
            description='내 계정과 관리 도구의 화면 및 연결 정보를 관리합니다.'
            icon={<SettingsOutlinedIcon />}
            maxWidth={760}>
            {error && <Alert severity='error' sx={{ mb: 2 }} onClose={() => setError('')}>{error}</Alert>}
            <SettingsCard icon={<AccountCircleOutlinedIcon />} title='내 정보'>
                <Stack spacing={2}>
                    <TextField label='아이디' value={userInfo.username ?? ''} disabled fullWidth />
                    <TextField label='이름' required value={nickname} onChange={(event) => setNickname(event.target.value)} fullWidth slotProps={{
                        htmlInput: { maxLength: 20 }
                    }} />
                    <TextField label='이메일' required type='email' value={email} onChange={(event) => setEmail(event.target.value)} fullWidth slotProps={{
                        htmlInput: { maxLength: 50 }
                    }} />
                    <TextField label='전화번호' value={phone} onChange={(event) => setPhone(event.target.value)} fullWidth slotProps={{
                        htmlInput: { maxLength: 15 }
                    }} />
                    <Box><Button variant='contained' disabled={profileSaving || !nickname.trim() || !email.trim()} onClick={handleProfileSave}>{profileSaving ? '저장 중' : '내 정보 저장'}</Button></Box>
                </Stack>
            </SettingsCard>
            <SettingsCard icon={<LockResetOutlinedIcon />} title='비밀번호 변경'>
                <Stack spacing={2}>
                    <Alert severity='info'>변경 후 모든 기기에서 로그아웃됩니다. {PASSWORD_REQUIREMENTS}</Alert>
                    <TextField
                        label='현재 비밀번호'
                        type={showPassword ? 'text' : 'password'}
                        value={currentPassword}
                        onChange={(event) => setCurrentPassword(event.target.value)}
                        autoComplete='current-password'
                        slotProps={{ input: { endAdornment: <PasswordVisibility show={showPassword} onToggle={() => setShowPassword((value) => !value)} /> } }}
                    />
                    <TextField
                        label='새 비밀번호'
                        type={showPassword ? 'text' : 'password'}
                        value={newPassword}
                        onChange={(event) => setNewPassword(event.target.value)}
                        autoComplete='new-password'
                        error={newPassword.length > 0 && !validNewPassword}
                        helperText={newPassword.length > 0 && !validNewPassword ? PASSWORD_REQUIREMENTS : ' '}
                    />
                    <TextField
                        label='새 비밀번호 확인'
                        type={showPassword ? 'text' : 'password'}
                        value={passwordConfirm}
                        onChange={(event) => setPasswordConfirm(event.target.value)}
                        autoComplete='new-password'
                        error={passwordConfirm.length > 0 && passwordConfirm !== newPassword}
                        helperText={passwordConfirm.length > 0 && passwordConfirm !== newPassword ? '새 비밀번호가 일치하지 않습니다.' : ' '}
                    />
                    <Box>
                        <Button
                            variant='contained'
                            disabled={passwordSaving || !currentPassword || !validNewPassword || newPassword !== passwordConfirm}
                            onClick={handlePasswordChange}>
                            {passwordSaving ? '변경 중' : '비밀번호 변경'}
                        </Button>
                    </Box>
                </Stack>
            </SettingsCard>
            <SettingsCard title='화면 테마'>
                <Typography
                    variant='body2'
                    sx={{
                        color: 'text.secondary',
                        mb: 2
                    }}>
                    시스템 설정을 선택하면 기기의 화면 모드 변경을 자동으로 따릅니다.
                </Typography>
                <ToggleButtonGroup value={mode ?? 'system'} onChange={handleThemeChange} exclusive fullWidth aria-label='화면 테마'>
                    <ToggleButton value='light' aria-label='라이트 테마'><LightModeOutlinedIcon sx={{ mr: 1 }} />라이트</ToggleButton>
                    <ToggleButton value='dark' aria-label='다크 테마'><DarkModeOutlinedIcon sx={{ mr: 1 }} />다크</ToggleButton>
                    <ToggleButton value='system' aria-label='시스템 설정 테마'><SettingsBrightnessOutlinedIcon sx={{ mr: 1 }} />시스템</ToggleButton>
                </ToggleButtonGroup>
            </SettingsCard>
            {userInfo.permissions.includes('SUPER_ADMIN') && <OperationalAlerts />}
            <SettingsCard title='GBIS API 키'>
                <Typography
                    variant='body2'
                    sx={{
                        color: 'text.secondary',
                        mb: 2
                    }}>
                    키는 브라우저 로컬 스토리지에만 저장되며 서버로 전송되지 않습니다.
                </Typography>
                <TextField
                    label='API 키'
                    value={apiKey}
                    onChange={(event) => setApiKey(event.target.value)}
                    type={showKey ? 'text' : 'password'}
                    fullWidth
                    sx={{ mb: 2 }}
                    slotProps={{ input: { endAdornment: <PasswordVisibility show={showKey} onToggle={() => setShowKey((value) => !value)} label='API 키 표시 전환' /> } }}
                />
                <Button variant='contained' onClick={handleApiKeySave}>API 키 저장</Button>
            </SettingsCard>
            <AppSnackbar message={notice} onClose={() => setNotice('')} />
        </PageLayout>
    )
}

function PasswordVisibility({ show, onToggle, label = '비밀번호 표시 전환' }: { show: boolean, onToggle: () => void, label?: string }) {
    return (
        <InputAdornment position='end'>
            <IconButton aria-label={label} onClick={onToggle} edge='end'>
                {show ? <VisibilityOff /> : <Visibility />}
            </IconButton>
        </InputAdornment>
    )
}
