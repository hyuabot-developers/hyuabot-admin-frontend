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
    Snackbar,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    TextField,
    Typography,
} from '@mui/material'
import { useEffect, useState } from 'react'
import * as XLSX from 'xlsx'

import {
    BulkSubwayTimetableCreateRequest,
    bulkCreateSubwayTimetable,
    bulkDeleteSubwayTimetable,
    getSubwayTimetable,
    SubwayTimetable,
} from '../../../../service/network/subway.ts'

const SHEET_MAP: Record<string, { weekday: string; direction: string }> = {
    '평일상행': { weekday: 'weekdays', direction: 'up' },
    '평일하행': { weekday: 'weekdays', direction: 'down' },
    '휴일상행': { weekday: 'weekends', direction: 'up' },
    '휴일하행': { weekday: 'weekends', direction: 'down' },
}

const normalizeStationName = (raw: string): string => raw.replace(/^\d+\s*/, '').trim()

const excelTimeToHHMMSS = (value: number): string => {
    const totalSeconds = Math.round(value * 24 * 3600)
    const h = Math.floor(totalSeconds / 3600)
    const m = Math.floor((totalSeconds % 3600) / 60)
    const s = totalSeconds % 60
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
}

type ParsedNames = {
    stationNames: string[]
    startNames: string[]
    terminalNames: string[]
}

type StationOption = { id: string; name: string }

type MappingSectionProps = {
    title: string
    names: string[]
    mappings: Record<string, string>
    stations: StationOption[]
    prefix: string
    onChange: (mappings: Record<string, string>) => void
}

const MappingSection = ({ title, names, mappings, stations, prefix, onChange }: MappingSectionProps) => {
    const filtered = prefix ? stations.filter((s) => s.id.startsWith(prefix)) : stations
    if (names.length === 0) return null
    return (
        <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 600 }}>{title}</Typography>
            <Table size="small">
                <TableHead>
                    <TableRow>
                        <TableCell sx={{ width: '40%' }}>파일 역명</TableCell>
                        <TableCell>DB 역 매핑</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {names.map((name) => (
                        <TableRow key={name}>
                            <TableCell>{name}</TableCell>
                            <TableCell>
                                <Autocomplete
                                    size="small"
                                    options={filtered}
                                    getOptionLabel={(s) => `${s.name} (${s.id})`}
                                    value={filtered.find((s) => s.id === mappings[name]) ?? null}
                                    onChange={(_, v) => onChange({ ...mappings, [name]: v?.id ?? '' })}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            size="small"
                                            error={!mappings[name]}
                                            placeholder="역 선택"
                                        />
                                    )}
                                    sx={{ minWidth: 280 }}
                                />
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </Box>
    )
}

const parseAllNames = (workbook: XLSX.WorkBook): ParsedNames => {
    const stationNamesSet = new Set<string>()
    const startNamesSet = new Set<string>()
    const terminalNamesSet = new Set<string>()

    for (const sheetName of Object.keys(SHEET_MAP)) {
        const sheet = workbook.Sheets[sheetName]
        if (!sheet) continue
        const data = XLSX.utils.sheet_to_json<(string | number)[]>(sheet, { header: 1, defval: '' })

        if (data[0]) {
            for (let col = 1; col < data[0].length; col++) {
                const name = normalizeStationName(String(data[0][col]))
                if (name) startNamesSet.add(name)
            }
        }
        if (data[1]) {
            for (let col = 1; col < data[1].length; col++) {
                const name = normalizeStationName(String(data[1][col]))
                if (name) terminalNamesSet.add(name)
            }
        }
        for (let rowIdx = 3; rowIdx < data.length - 1; rowIdx += 2) {
            const name = normalizeStationName(String(data[rowIdx][0]))
            if (name) stationNamesSet.add(name)
        }
    }

    return {
        stationNames: [...stationNamesSet].sort(),
        startNames: [...startNamesSet].sort(),
        terminalNames: [...terminalNamesSet].sort(),
    }
}

const parseSheetWithMapping = (
    sheet: XLSX.WorkSheet,
    weekday: string,
    direction: string,
    stationMap: Record<string, string>,
    startMap: Record<string, string>,
    terminalMap: Record<string, string>,
): BulkSubwayTimetableCreateRequest[] => {
    const data = XLSX.utils.sheet_to_json<(string | number)[]>(sheet, { header: 1, defval: '' })
    const startNames = data[0]
    const terminalNames = data[1]
    const results: BulkSubwayTimetableCreateRequest[] = []

    if (!startNames || !terminalNames) return results

    for (let rowIdx = 3; rowIdx < data.length - 1; rowIdx += 2) {
        const stationName = normalizeStationName(String(data[rowIdx][0]))
        const stationID = stationMap[stationName]
        if (!stationID) continue

        const departureRow = data[rowIdx + 1]
        if (!departureRow) continue

        for (let col = 1; col < startNames.length; col++) {
            const timeValue = departureRow[col]
            if (typeof timeValue !== 'number') continue

            const startName = normalizeStationName(String(startNames[col]))
            const terminalName = normalizeStationName(String(terminalNames[col]))
            const startID = startMap[startName]
            const terminalID = terminalMap[terminalName]
            if (!startID || !terminalID) continue

            results.push({
                stationID,
                startStationID: startID,
                terminalStationID: terminalID,
                departureTime: excelTimeToHHMMSS(timeValue),
                weekday,
                direction,
            })
        }
    }
    return results
}

export type ExcelMappingDialogProps = {
    open: boolean
    onClose: () => void
    file: File | null
    stations: StationOption[]
    onSuccess: (result: { deletedCount: number; createdCount: number }) => void
}

export const ExcelMappingDialog = ({
    open,
    onClose,
    file,
    stations,
    onSuccess,
}: ExcelMappingDialogProps) => {
    const [prefix, setPrefix] = useState('')
    const [stationMappings, setStationMappings] = useState<Record<string, string>>({})
    const [startMappings, setStartMappings] = useState<Record<string, string>>({})
    const [terminalMappings, setTerminalMappings] = useState<Record<string, string>>({})
    const [parsedNames, setParsedNames] = useState<ParsedNames | null>(null)
    const [workbook, setWorkbook] = useState<XLSX.WorkBook | null>(null)
    const [loading, setLoading] = useState(false)
    const [snackbarOpen, setSnackbarOpen] = useState(false)
    const [snackbarMessage, setSnackbarMessage] = useState('')

    useEffect(() => {
        if (!file || !open) return
        const load = async () => {
            const arrayBuffer = await file.arrayBuffer()
            const wb = XLSX.read(new Uint8Array(arrayBuffer))
            setWorkbook(wb)
            setParsedNames(parseAllNames(wb))
            setStationMappings({})
            setStartMappings({})
            setTerminalMappings({})
            setPrefix('')
        }
        load()
    }, [file, open])

    const autoMap = () => {
        if (!parsedNames) return
        const filtered = prefix ? stations.filter((s) => s.id.startsWith(prefix)) : stations

        const newStation: Record<string, string> = { ...stationMappings }
        const newStart: Record<string, string> = { ...startMappings }
        const newTerminal: Record<string, string> = { ...terminalMappings }

        const findMatch = (name: string) =>
            filtered.find((s) => {
                const dbName = s.name.trim()
                return dbName === name || dbName.includes(name) || name.includes(dbName)
            })

        for (const name of parsedNames.stationNames) {
            const match = findMatch(name)
            if (match) newStation[name] = match.id
        }
        for (const name of parsedNames.startNames) {
            const match = findMatch(name)
            if (match) newStart[name] = match.id
        }
        for (const name of parsedNames.terminalNames) {
            const match = findMatch(name)
            if (match) newTerminal[name] = match.id
        }

        setStationMappings(newStation)
        setStartMappings(newStart)
        setTerminalMappings(newTerminal)
    }

    const handleSave = async () => {
        if (!workbook || !parsedNames) return

        const mappedStationIDs = [...new Set(
            Object.entries(stationMappings).filter(([, v]) => v).map(([, v]) => v),
        )]
        if (mappedStationIDs.length === 0) {
            setSnackbarMessage('매핑된 역이 없습니다.')
            setSnackbarOpen(true)
            return
        }

        setLoading(true)
        try {
            const timetableResponse = await getSubwayTimetable()
            const deletedCount = (timetableResponse.data.result as SubwayTimetable[])
                .filter((t) => mappedStationIDs.includes(t.stationID)).length

            await bulkDeleteSubwayTimetable({ stationIDs: mappedStationIDs })

            const allEntries: BulkSubwayTimetableCreateRequest[] = []
            for (const [sheetName, mapping] of Object.entries(SHEET_MAP)) {
                const sheet = workbook.Sheets[sheetName]
                if (!sheet) continue
                const entries = parseSheetWithMapping(
                    sheet,
                    mapping.weekday,
                    mapping.direction,
                    stationMappings,
                    startMappings,
                    terminalMappings,
                )
                allEntries.push(...entries)
            }

            await bulkCreateSubwayTimetable(allEntries)
            onSuccess({ deletedCount, createdCount: allEntries.length })
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
            <DialogTitle>시간표 매핑 및 업로드</DialogTitle>
            <DialogContent dividers>
                <Box sx={{ mb: 2, display: 'flex', gap: 1, alignItems: 'center' }}>
                    <TextField
                        label="노선 접두사 (예: K4, K2)"
                        value={prefix}
                        onChange={(e) => setPrefix(e.target.value)}
                        size="small"
                        sx={{ width: 220 }}
                    />
                    <Button onClick={autoMap} variant="outlined" size="small">
                        자동 매핑
                    </Button>
                </Box>
                {parsedNames && (
                    <Box>
                        <MappingSection
                            title={`역 매핑 (${parsedNames.stationNames.length}개)`}
                            names={parsedNames.stationNames}
                            mappings={stationMappings}
                            stations={stations}
                            prefix={prefix}
                            onChange={setStationMappings}
                        />
                        <MappingSection
                            title={`시점역 매핑 (${parsedNames.startNames.length}개)`}
                            names={parsedNames.startNames}
                            mappings={startMappings}
                            stations={stations}
                            prefix={prefix}
                            onChange={setStartMappings}
                        />
                        <MappingSection
                            title={`종점역 매핑 (${parsedNames.terminalNames.length}개)`}
                            names={parsedNames.terminalNames}
                            mappings={terminalMappings}
                            stations={stations}
                            prefix={prefix}
                            onChange={setTerminalMappings}
                        />
                    </Box>
                )}
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} disabled={loading}>취소</Button>
                <Button
                    onClick={handleSave}
                    variant="contained"
                    disabled={loading || !parsedNames}
                    startIcon={loading ? <CircularProgress size={16} /> : undefined}
                >
                    저장
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
