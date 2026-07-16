import {
    Alert,
    Button,
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Stack,
    Typography,
} from '@mui/material'
import { useEffect, useState } from 'react'
import * as XLSX from 'xlsx'

import {
    applyShuttleTimetableImport,
    previewShuttleTimetableImport,
    ShuttleTimetableImportEntry,
    TimetableImportPreview,
    TimetableImportResult,
} from '../../../../service/network/timetableImport.ts'
import { TimetableImportPreviewPanel } from '../../../components/TimetableImportPreview.tsx'

type Props = {
    open: boolean,
    file: File | null,
    onClose: () => void,
    onSuccess: (result: TimetableImportResult) => void,
}

const readField = (row: Record<string, unknown>, names: string[]) => {
    const key = names.find((name) => row[name] !== undefined)
    return key ? row[key] : undefined
}

const parseWeekday = (value: unknown): boolean | null => {
    if (value === true || value === 1) return true
    if (value === false || value === 0) return false
    const normalized = String(value ?? '').trim().toLowerCase()
    if (['true', 'weekday', 'weekdays', '평일'].includes(normalized)) return true
    if (['false', 'weekend', 'weekends', '주말', '휴일'].includes(normalized)) return false
    return null
}

export function ShuttleTimetableImportDialog({ open, file, onClose, onSuccess }: Props) {
    const [entries, setEntries] = useState<ShuttleTimetableImportEntry[]>([])
    const [parseErrors, setParseErrors] = useState<string[]>([])
    const [preview, setPreview] = useState<TimetableImportPreview | null>(null)
    const [loading, setLoading] = useState(false)
    const [requestError, setRequestError] = useState('')

    useEffect(() => {
        if (!file || !open) return
        const load = async () => {
            try {
                const workbook = XLSX.read(new Uint8Array(await file.arrayBuffer()))
                const firstSheet = workbook.Sheets[workbook.SheetNames[0]]
                let rows: Record<string, unknown>[] = []
                if (firstSheet) {
                    rows = XLSX.utils.sheet_to_json(firstSheet, { defval: '' })
                }
                const errors: string[] = []
                const parsed = rows.map((row, index) => {
                    const routeName = String(readField(row, ['routeName', '노선', '노선명']) ?? '').trim()
                    const period = String(readField(row, ['period', '운행 종류', '운행종류']) ?? '').trim()
                    const departureTime = String(readField(row, ['departureTime', '출발 시각', '출발시각', '출발 시간']) ?? '').trim()
                    const weekday = parseWeekday(readField(row, ['weekday', '평일 여부', '평일여부', '요일']))
                    if (!routeName || !period || !departureTime || weekday === null) {
                        errors.push(`${index + 2}행의 노선, 운행 종류, 평일 여부 또는 출발 시각을 확인해주세요.`)
                    }
                    const isWeekday = weekday === true
                    return { routeName, period, weekday: isWeekday, departureTime }
                })
                setEntries(parsed)
                setParseErrors(errors)
                setPreview(null)
                setRequestError('')
            } catch (error) {
                setEntries([])
                setParseErrors([])
                setPreview(null)
                setRequestError(`파일을 읽지 못했습니다: ${error instanceof Error ? error.message : String(error)}`)
            }
        }
        void load()
    }, [file, open])

    const handlePrimaryAction = async () => {
        setLoading(true)
        setRequestError('')
        try {
            if (preview?.previewID) {
                const response = await applyShuttleTimetableImport(preview.previewID)
                onSuccess(response.data)
                onClose()
                return
            }
            const routeNames = [...new Set(entries.map((entry) => entry.routeName).filter(Boolean))]
            const response = await previewShuttleTimetableImport(routeNames, entries)
            setPreview(response.data)
        } catch (error) {
            setRequestError(error instanceof Error ? error.message : String(error))
            if (preview) setPreview(null)
        } finally {
            setLoading(false)
        }
    }
    const primaryDisabled = loading || parseErrors.length > 0 || entries.length === 0 || Boolean(preview && !preview.previewID)

    return (
        <Dialog open={open} onClose={loading ? undefined : onClose} maxWidth="md" fullWidth>
            <DialogTitle>셔틀 시간표 일괄 업로드</DialogTitle>
            <DialogContent dividers>
                <Stack spacing={2}>
                    {!preview && (
                        <Stack spacing={1.5}>
                            <Alert severity="info">
                                첫 행에 <strong>routeName, period, weekday, departureTime</strong> 열을 입력해주세요.
                                한글 열 이름인 노선명, 운행 종류, 평일 여부, 출발 시각도 사용할 수 있습니다.
                            </Alert>
                            <Typography color="text.secondary">
                                {entries.length > 0 ? `${entries.length}건을 읽었습니다.` : '파일에서 읽은 시간표가 없습니다.'}
                            </Typography>
                            {parseErrors.map((error) => <Alert key={error} severity="error">{error}</Alert>)}
                        </Stack>
                    )}
                    {preview && <TimetableImportPreviewPanel preview={preview} />}
                    {requestError && <Alert severity="error">요청에 실패했습니다: {requestError}</Alert>}
                </Stack>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} disabled={loading}>취소</Button>
                {preview && <Button onClick={() => setPreview(null)} disabled={loading}>파일 확인</Button>}
                <Button
                    variant="contained"
                    color={preview?.deleteCount ? 'error' : 'primary'}
                    disabled={primaryDisabled}
                    startIcon={loading ? <CircularProgress size={16} /> : undefined}
                    onClick={handlePrimaryAction}
                >
                    {preview ? '변경사항 적용' : '변경사항 검토'}
                </Button>
            </DialogActions>
        </Dialog>
    )
}
