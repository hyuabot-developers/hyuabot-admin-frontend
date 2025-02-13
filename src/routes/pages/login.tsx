import { Button, TextField } from "@mui/material";
import { useState } from "react";

export default function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const handleLogin = () => {
        console.log("Logging in with", username, password);
    };

    return (
        <div style={{
            display: 'grid',
            placeItems: 'center',
            width: '100vw',
            height: '100vh',
        }}>
            <div style={{
                padding: '20px',
                borderRadius: '10px',
                backgroundColor: 'white',
                display: 'flex',
                justifyContent: 'center',
                flexDirection: 'column',
                alignItems: 'center',
                width: '40vw',
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