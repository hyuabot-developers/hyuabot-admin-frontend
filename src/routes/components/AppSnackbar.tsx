import { Alert, Snackbar } from '@mui/material'
import type { AlertColor } from '@mui/material'

type AppSnackbarProps = {
    message: string,
    severity?: AlertColor,
    onClose: () => void,
}

export function AppSnackbar({ message, severity = 'success', onClose }: AppSnackbarProps) {
    return (
        <Snackbar
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            open={message !== ''}
            autoHideDuration={3000}
            onClose={onClose}>
            <Alert onClose={onClose} severity={severity} variant='filled' sx={{ width: '100%' }}>
                {message}
            </Alert>
        </Snackbar>
    )
}
