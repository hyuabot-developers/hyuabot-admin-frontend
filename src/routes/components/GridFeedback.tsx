import { AppSnackbar } from './AppSnackbar.tsx'

type GridFeedbackProps = {
    error: string,
    success: string,
    onErrorClose: () => void,
    onSuccessClose: () => void,
}

export function GridFeedback({
    error,
    success,
    onErrorClose,
    onSuccessClose,
}: GridFeedbackProps) {
    return (
        <div>
            <AppSnackbar message={error} severity='error' onClose={onErrorClose} />
            <AppSnackbar message={success} onClose={onSuccessClose} />
        </div>
    )
}
