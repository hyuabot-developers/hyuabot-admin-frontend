import {
    Alert,
    Autocomplete,
    Box,
    Button,
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormControlLabel,
    Snackbar,
    Switch,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    TextField,
    Typography,
} from '@mui/material'
import { useEffect, useState } from 'react'

import {
    createSubwayStation,
    SubwayRoute,
    SubwayStation,
    updateSubwayStation,
} from '../../../../service/network/subway.ts'

type ParsedStationRow = {
    stationName: string
    lineName: string
    externalCode: string
}

type StationUploadPlan = {
    station: SubwayStation
    overwrite: boolean
}

type CsvRouteMappingDialogProps = {
    open: boolean
    onClose: () => void
    file: File | null
    routes: SubwayRoute[]
    existingStationIDs: string[]
    onSuccess: (createdCount: number) => void
}

const REQUIRED_COLUMNS = ['전철역명', '호선', '외부코드']

const parseCsv = (text: string): string[][] => {
    const rows: string[][] = []
    let row: string[] = []
    let value = ''
    let inQuotes = false

    for (let i = 0; i < text.length; i++) {
        const char = text[i]
        const nextChar = text[i + 1]

        if (char === '"') {
            if (inQuotes && nextChar === '"') {
                value += '"'
                i += 1
            } else {
                inQuotes = !inQuotes
            }
            continue
        }

        if (char === ',' && !inQuotes) {
            row.push(value)
            value = ''
            continue
        }

        if ((char === '\n' || char === '\r') && !inQuotes) {
            if (char === '\r' && nextChar === '\n') i += 1
            row.push(value)
            if (row.some((cell) => cell !== '')) rows.push(row)
            row = []
            value = ''
            continue
        }

        value += char
    }

    row.push(value)
    if (row.some((cell) => cell !== '')) rows.push(row)
    return rows
}

const parseStationCsv = (text: string): ParsedStationRow[] => {
    const rows = parseCsv(text)
    const headers = rows[0]?.map((header) => header.trim()) ?? []
    const missingColumns = REQUIRED_COLUMNS.filter((column) => !headers.includes(column))

    if (missingColumns.length > 0) {
        throw new Error(`필수 컬럼이 없습니다: ${missingColumns.join(', ')}`)
    }

    const nameIndex = headers.indexOf('전철역명')
    const lineIndex = headers.indexOf('호선')
    const externalCodeIndex = headers.indexOf('외부코드')

    return rows.slice(1).map((row) => ({
        stationName: row[nameIndex]?.trim() ?? '',
        lineName: row[lineIndex]?.trim() ?? '',
        externalCode: row[externalCodeIndex]?.trim() ?? '',
    })).filter((row) => row.stationName && row.lineName && row.externalCode)
}

const createStationID = (externalCode: string) =>
    /^\d+$/.test(externalCode) ? `K${externalCode}` : externalCode

const compareExternalCode = (a: string, b: string) => {
    const aNumber = Number(a)
    const bNumber = Number(b)
    if (!Number.isNaN(aNumber) && !Number.isNaN(bNumber)) return aNumber - bNumber
    return a.localeCompare(b)
}

const buildStationUploadPlan = (
    rows: ParsedStationRow[],
    routeMappings: Record<string, number | null>,
    existingStationIDs: string[],
    forceOverwrite: boolean,
    reverseOrder: boolean,
): StationUploadPlan[] => {
    const orderByRoute = new Map<number, number>()
    const existingStationIDSet = new Set(existingStationIDs)
    const stationIDSet = new Set<string>()
    const mappedRows = rows
        .map((row) => ({
            ...row,
            routeID: routeMappings[row.lineName],
            stationID: createStationID(row.externalCode),
        }))
        .filter((row): row is ParsedStationRow & { routeID: number; stationID: string } => row.routeID != null)
        .sort((a, b) => {
            if (a.routeID !== b.routeID) return a.routeID - b.routeID
            const externalCodeOrder = compareExternalCode(a.externalCode, b.externalCode)
            return reverseOrder ? -externalCodeOrder : externalCodeOrder
        })

    return mappedRows.flatMap((row) => {
        if (stationIDSet.has(row.stationID)) return []
        const overwrite = existingStationIDSet.has(row.stationID)
        if (overwrite && !forceOverwrite) return []
        stationIDSet.add(row.stationID)

        const order = (orderByRoute.get(row.routeID) ?? 0) + 1
        orderByRoute.set(row.routeID, order)

        return [{
            station: {
                id: row.stationID,
                name: row.stationName,
                routeID: row.routeID,
                order,
                cumulativeTime: '00:00:00',
            },
            overwrite,
        }]
    })
}

export const CsvRouteMappingDialog = ({
    open,
    onClose,
    file,
    routes,
    existingStationIDs,
    onSuccess,
}: CsvRouteMappingDialogProps) => {
    const [rows, setRows] = useState<ParsedStationRow[]>([])
    const [routeMappings, setRouteMappings] = useState<Record<string, number | null>>({})
    const [forceOverwrite, setForceOverwrite] = useState(false)
    const [reverseOrder, setReverseOrder] = useState(false)
    const [loading, setLoading] = useState(false)
    const [snackbarOpen, setSnackbarOpen] = useState(false)
    const [snackbarMessage, setSnackbarMessage] = useState('')

    useEffect(() => {
        if (!open || !file) return

        const load = async () => {
            try {
                const buffer = await file.arrayBuffer()
                const decoder = new TextDecoder('euc-kr')
                const parsedRows = parseStationCsv(decoder.decode(buffer))
                const lineNames = [...new Set(parsedRows.map((row) => row.lineName))].sort()
                const nextMappings = Object.fromEntries(
                    lineNames.map((lineName) => {
                        const routeNumber = Number(lineName.replace(/\D/g, ''))
                        const matchedRoute = routes.find((route) => route.id === routeNumber)
                        return [lineName, matchedRoute?.id ?? null]
                    })
                )

                setRows(parsedRows)
                setRouteMappings(nextMappings)
                setForceOverwrite(false)
                setReverseOrder(false)
            } catch (e) {
                setRows([])
                setRouteMappings({})
                setSnackbarMessage('CSV 읽기 실패: ' + (e instanceof Error ? e.message : String(e)))
                setSnackbarOpen(true)
            }
        }

        load()
    }, [file, open, routes])

    const lineNames = Object.keys(routeMappings)
    const stationUploadPlan = buildStationUploadPlan(rows, routeMappings, existingStationIDs, forceOverwrite, reverseOrder)
    const createCount = stationUploadPlan.filter((plan) => !plan.overwrite).length
    const overwriteCount = stationUploadPlan.filter((plan) => plan.overwrite).length
    const skippedCount = rows.length - stationUploadPlan.length

    const handleSave = async () => {
        if (stationUploadPlan.length === 0) {
            setSnackbarMessage('업로드할 역이 없습니다. 노선 매핑을 확인해주세요.')
            setSnackbarOpen(true)
            return
        }

        setLoading(true)
        try {
            for (const plan of stationUploadPlan) {
                if (plan.overwrite) {
                    await updateSubwayStation(plan.station.id, {
                        name: plan.station.name,
                        routeID: plan.station.routeID,
                        order: plan.station.order,
                        cumulativeTime: plan.station.cumulativeTime,
                    })
                } else {
                    await createSubwayStation(plan.station)
                }
            }
            onSuccess(stationUploadPlan.length)
            onClose()
        } catch (e) {
            setSnackbarMessage('업로드 실패: ' + (e instanceof Error ? e.message : String(e)))
            setSnackbarOpen(true)
        } finally {
            setLoading(false)
        }
    }

    return (
        <Dialog open={open} onClose={loading ? undefined : onClose} maxWidth="md" fullWidth>
            <DialogTitle>지하철역 CSV 업로드</DialogTitle>
            <DialogContent dividers>
                <Box sx={{ mb: 2 }}>
                    <Typography variant="body2">
                        생성 {createCount}개, 덮어쓰기 {overwriteCount}개, 제외 {skippedCount}개
                    </Typography>
                    <FormControlLabel
                        control={(
                            <Switch
                                checked={forceOverwrite}
                                onChange={(event) => setForceOverwrite(event.target.checked)}
                            />
                        )}
                        label="기존 역 ID 강제 덮어쓰기"
                    />
                    <FormControlLabel
                        control={(
                            <Switch
                                checked={reverseOrder}
                                onChange={(event) => setReverseOrder(event.target.checked)}
                            />
                        )}
                        label="외부코드 역순으로 순서 매기기"
                    />
                </Box>
                <Table size="small">
                    <TableHead>
                        <TableRow>
                            <TableCell sx={{ width: '40%' }}>CSV 호선</TableCell>
                            <TableCell>DB 노선 매핑</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {lineNames.map((lineName) => (
                            <TableRow key={lineName}>
                                <TableCell>{lineName}</TableCell>
                                <TableCell>
                                    <Autocomplete
                                        size="small"
                                        options={routes}
                                        getOptionLabel={(route) => `${route.name} (${route.id})`}
                                        value={routes.find((route) => route.id === routeMappings[lineName]) ?? null}
                                        onChange={(_, value) => setRouteMappings({
                                            ...routeMappings,
                                            [lineName]: value?.id ?? null,
                                        })}
                                        renderInput={(params) => (
                                            <TextField
                                                {...params}
                                                size="small"
                                                placeholder="업로드하지 않음"
                                            />
                                        )}
                                    />
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} disabled={loading}>취소</Button>
                <Button
                    onClick={handleSave}
                    variant="contained"
                    disabled={loading || rows.length === 0}
                    startIcon={loading ? <CircularProgress size={16} /> : undefined}
                >
                    업로드
                </Button>
            </DialogActions>
            <Snackbar open={snackbarOpen} autoHideDuration={4000} onClose={() => setSnackbarOpen(false)}>
                <Alert severity="error" onClose={() => setSnackbarOpen(false)} sx={{ width: '100%' }}>
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </Dialog>
    )
}
