import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline'
import LockResetOutlinedIcon from '@mui/icons-material/LockResetOutlined'
import Visibility from '@mui/icons-material/Visibility'
import VisibilityOff from '@mui/icons-material/VisibilityOff'
import {
    Alert,
    Avatar,
    Box,
    Button,
    CircularProgress,
    IconButton,
    InputAdornment,
    Paper,
    Stack,
    TextField,
    Typography,
} from '@mui/material'
import { useEffect, useState } from 'react'

import { isValidPassword, PASSWORD_REQUIREMENTS } from '../../security/password.ts'
import { completeInvitation, validateInvitation } from '../../service/network/auth.ts'

type SetupState = 'validating' | 'ready' | 'invalid' | 'submitting' | 'complete'

export default function AccountSetup() {
    const [token] = useState(() => new URLSearchParams(window.location.hash.slice(1)).get('token') ?? '')
    const [state, setState] = useState<SetupState>('validating')
    const [password, setPassword] = useState('')
    const [passwordConfirm, setPasswordConfirm] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [error, setError] = useState('')

    useEffect(() => {
        window.history.replaceState({}, '', '/account-setup')
        if (!token) {
            setState('invalid')
            return
        }
        void validateInvitation(token)
            .then((response) => setState(response.data.valid ? 'ready' : 'invalid'))
            .catch(() => setState('invalid'))
    }, [token])

    const validPassword = isValidPassword(password)
    const canSubmit = validPassword && password === passwordConfirm && state === 'ready'
    const submitting = state === 'submitting'

    const handleSubmit = async () => {
        if (!canSubmit) return
        setState('submitting')
        setError('')
        try {
            await completeInvitation(token, password)
            setState('complete')
        } catch {
            setError('초대 링크가 만료되었거나 이미 사용되었습니다.')
            setState('invalid')
        }
    }

    return (
        <Box sx={{ minHeight: '100dvh', display: 'grid', placeItems: 'center', bgcolor: 'background.default', p: 2 }}>
            <Paper variant='outlined' sx={{ width: '100%', maxWidth: 480, p: { xs: 3, sm: 4 }, borderRadius: 4 }}>
                <Stack spacing={3} alignItems='stretch'>
                    <Stack spacing={1.5} alignItems='center' textAlign='center'>
                        <Avatar sx={{ width: 56, height: 56, bgcolor: 'primary.main' }}>
                            {state === 'complete' ? <CheckCircleOutlineIcon /> : <LockResetOutlinedIcon />}
                        </Avatar>
                        <Typography variant='h4' component='h1' fontWeight={750}>
                            {state === 'complete' ? '계정 설정 완료' : '관리자 계정 시작하기'}
                        </Typography>
                        <Typography color='text.secondary'>
                            {state === 'complete'
                                ? '새 비밀번호로 로그인할 수 있습니다.'
                                : '본인만 사용할 안전한 비밀번호를 만들어 주세요.'}
                        </Typography>
                    </Stack>

                    {state === 'validating' && (
                        <Stack alignItems='center' spacing={1.5} sx={{ py: 3 }}>
                            <CircularProgress size={32} />
                            <Typography color='text.secondary'>초대 링크 확인 중</Typography>
                        </Stack>
                    )}

                    {(state === 'ready' || state === 'submitting') && (
                        <Stack spacing={2} component='form' onSubmit={(event) => { event.preventDefault(); void handleSubmit() }}>
                            <Alert severity='info'>{PASSWORD_REQUIREMENTS}</Alert>
                            <TextField
                                autoFocus
                                label='새 비밀번호'
                                type={showPassword ? 'text' : 'password'}
                                value={password}
                                onChange={(event) => setPassword(event.target.value)}
                                error={password.length > 0 && !validPassword}
                                helperText={password.length > 0 && !validPassword ? PASSWORD_REQUIREMENTS : ' '}
                                autoComplete='new-password'
                                slotProps={{
                                    input: {
                                        endAdornment: (
                                            <InputAdornment position='end'>
                                                <IconButton aria-label='비밀번호 표시 전환' onClick={() => setShowPassword((value) => !value)} edge='end'>
                                                    {showPassword ? <VisibilityOff /> : <Visibility />}
                                                </IconButton>
                                            </InputAdornment>
                                        ),
                                    },
                                }}
                            />
                            <TextField
                                label='새 비밀번호 확인'
                                type={showPassword ? 'text' : 'password'}
                                value={passwordConfirm}
                                onChange={(event) => setPasswordConfirm(event.target.value)}
                                error={passwordConfirm.length > 0 && password !== passwordConfirm}
                                helperText={passwordConfirm.length > 0 && password !== passwordConfirm ? '비밀번호가 일치하지 않습니다.' : ' '}
                                autoComplete='new-password'
                            />
                            <Button type='submit' variant='contained' size='large' disabled={!validPassword || password !== passwordConfirm || submitting}>
                                {submitting ? '계정 활성화 중' : '비밀번호 만들고 활성화'}
                            </Button>
                        </Stack>
                    )}

                    {state === 'invalid' && (
                        <Stack spacing={2}>
                            <Alert severity='error'>{error || '유효하지 않거나 만료된 초대 링크입니다.'}</Alert>
                            <Typography variant='body2' color='text.secondary'>관리자에게 새 초대 링크를 요청하세요.</Typography>
                        </Stack>
                    )}

                    {state === 'complete' && (
                        <Button variant='contained' size='large' href='/login'>로그인하러 가기</Button>
                    )}
                </Stack>
            </Paper>
        </Box>
    )
}
