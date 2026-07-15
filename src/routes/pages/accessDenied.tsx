import LockOutlinedIcon from '@mui/icons-material/LockOutlined'
import { Box, Paper, Typography } from '@mui/material'

export default function AccessDenied() {
    return (
        <Box sx={{ p: { xs: 2, sm: 3 }, display: 'flex', justifyContent: 'center' }}>
            <Paper
                variant='outlined'
                sx={{ p: 4, maxWidth: 520, width: '100%', textAlign: 'center', borderRadius: 3 }}>
                <LockOutlinedIcon sx={{ color: 'text.secondary', fontSize: 52, mb: 2 }} />
                <Typography variant='h5' fontWeight={700} gutterBottom>
                    관리 권한이 없습니다
                </Typography>
                <Typography color='text.secondary'>
                    필요한 관리 영역을 사용할 수 있도록 최고 관리자에게 권한을 요청해 주세요.
                </Typography>
            </Paper>
        </Box>
    )
}
