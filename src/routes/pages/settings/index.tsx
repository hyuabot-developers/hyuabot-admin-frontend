import Visibility from '@mui/icons-material/Visibility'
import VisibilityOff from '@mui/icons-material/VisibilityOff'
import {
    Alert,
    Box,
    Button,
    Divider,
    IconButton,
    InputAdornment,
    Paper,
    Snackbar,
    TextField,
    Typography,
} from '@mui/material'
import { useState } from 'react'

const GBIS_API_KEY_STORAGE_KEY = 'hyuabot.gbisApiKey'

export default function Settings() {
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

    return (
        <Box sx={{ p: 3, maxWidth: 600 }}>
            <Typography variant='h5' gutterBottom>설정</Typography>
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
            <Snackbar
                open={saved}
                autoHideDuration={3000}
                onClose={() => setSaved(false)}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            >
                <Alert severity='success' onClose={() => setSaved(false)}>
                    저장되었습니다.
                </Alert>
            </Snackbar>
        </Box>
    )
}
