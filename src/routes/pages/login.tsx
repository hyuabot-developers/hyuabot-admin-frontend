import { Alert, Button, Snackbar, TextField } from "@mui/material"
import { useState } from "react"
import { login } from "../../service/network/auth.ts"
import { AxiosError } from "axios"

export default function Login() {
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [snackbarOpened, setSnackbarOpened] = useState(false)

    const handleLogin = async () => {
        try {
            const response = await login({ username, password })
            if (response?.status === 200) {
                const data = response.data
                localStorage.setItem('accessToken', data.access_token)
                localStorage.setItem('refreshToken', data.refresh_token)
                window.location.href = '/'
            }
        } catch (error) {
            const err = error as AxiosError
            if (err.response?.status === 401) {
                setSnackbarOpened(true)
            }
        }
    }

    return (
        <div style={{
            display: 'grid',
            placeItems: 'center',
            width: '100vw',
            height: '100vh',
        }}>
            <Snackbar
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                open={snackbarOpened}
                autoHideDuration={3000}
                onClose={() => setSnackbarOpened(false)}>
                <Alert severity="error" variant="filled" sx={{ width: '100%' }}>
                    아이디나 비밀번호가 일치하지 않습니다.
                </Alert>
            </Snackbar>
            <div style={{
                padding: '20px',
                borderRadius: '10px',
                backgroundColor: 'white',
                display: 'flex',
                justifyContent: 'center',
                flexDirection: 'column',
                alignItems: 'center',
                width: '80vw',
            }}>
                <img src="images/hanyangCharacter.png" alt="logo" style={{ width: '100px' }} />
                <h3 style={{ textAlign: 'center', marginBottom: '4px' }}>휴아봇 서비스 관리자 페이지</h3>
                <TextField
                    id="username"
                    label="아이디"
                    variant="outlined"
                    fullWidth
                    size="small"
                    margin="dense"
                    value={username}
                    onChange={(e) => {
                        setUsername(e.target.value)
                    }}
                />
                <TextField
                    id="password"
                    label="비밀번호"
                    type="password"
                    variant="outlined"
                    fullWidth
                    size="small"
                    margin="dense"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <Button
                    disabled={!username || !password}
                    variant="contained"
                    color="primary"
                    fullWidth
                    onClick={handleLogin}
                    style={{ marginTop: '12px' }}>
                    로그인
                </Button>
            </div>
        </div>
    )
}