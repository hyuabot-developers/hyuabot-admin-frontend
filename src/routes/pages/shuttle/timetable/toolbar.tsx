import AddIcon from '@mui/icons-material/Add'
import UploadFileIcon from '@mui/icons-material/UploadFile'
import { Alert, Autocomplete, Snackbar, TextField } from '@mui/material'
import { GridRowModes, Toolbar, ToolbarButton } from '@mui/x-data-grid'
import { ChangeEvent, useEffect, useRef, useState } from 'react'
import { v4 as uuidv4 } from 'uuid'

import { ShuttleTimetableImportDialog } from './TimetableImportDialog.tsx'
import {
    getShuttleRoute,
    getShuttleTimetable,
    ShuttleRouteResponse,
    ShuttleTimetableResponse
} from '../../../../service/network/shuttle.ts'
import type { TimetableImportResult } from '../../../../service/network/timetableImport.ts'
import {
    useShuttleTimetableStore,
    useShuttleTimetableGridModelStore,
} from '../../../../stores/shuttle.ts'
import { reportError } from '../../../../utility/reportError.ts'

export const GridToolbar = () => {
    const rowStore = useShuttleTimetableStore()
    const rowModesModelStore = useShuttleTimetableGridModelStore()
    const fileInputRef = useRef<HTMLInputElement>(null)
    const [importOpen, setImportOpen] = useState(false)
    const [selectedFile, setSelectedFile] = useState<File | null>(null)
    const [message, setMessage] = useState('')
    const fetchShuttleRoute = async () => {
        const response = await getShuttleRoute()
        if (response.status === 200) {
            const responseData = response.data
            rowStore.setRoutes(responseData.result.map((item: ShuttleRouteResponse) => {
                return {
                    id: uuidv4(),
                    name: item.name,
                    tag: item.tag,
                    korean: item.descriptionKorean,
                    english: item.descriptionEnglish,
                    start: item.startStopID,
                    end: item.endStopID,
                }
            }))
        }
    }
    const fetchShuttleTimetable = async (routeName: string) => {
        const response = await getShuttleTimetable(routeName)
        if (response.status === 200) {
            const responseData = response.data
            rowStore.setRows(responseData.result.map((item: ShuttleTimetableResponse) => {
                return {
                    id: uuidv4(),
                    seq: item.seq,
                    period: item.period,
                    weekdays: item.isWeekdays,
                    time: item.departureTime,
                }
            }))
        }
    }
    const onChangeSelectedRoute = (value: string | null) => {
        if (value) {
            rowStore.setSelectedRoute(value)
            fetchShuttleTimetable(value).catch(reportError)
        }
    }
    // Add record button click event
    const addRowButtonClicked = () => {
        const id = uuidv4()
        rowStore.setRows([
            {
                id,
                seq: null,
                period: '',
                weekdays: true,
                time: '00:00:00',
                isNew: true,
            },
            ...rowStore.rows,
        ])
        rowModesModelStore.setRowModesModel(({
            ...rowModesModelStore.rowModesModel,
            [id]: { mode: GridRowModes.Edit, fieldToFocus: 'period' },
        }))
    }
    useEffect(() => {
        fetchShuttleRoute().catch(reportError)
    }, [])
    const onFileChange = (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0]
        if (!file) return
        setSelectedFile(file)
        setImportOpen(true)
        event.target.value = ''
    }
    const onImportSuccess = (result: TimetableImportResult) => {
        setMessage(`${result.createCount}건 추가, ${result.deleteCount}건 삭제 완료`)
        const selectedRoute = useShuttleTimetableStore.getState().selectedRoute
        if (selectedRoute) fetchShuttleTimetable(selectedRoute).catch(reportError)
    }
    return (
        <Toolbar style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '10px' }}>
            <input ref={fileInputRef} type="file" accept=".xlsx,.xls,.csv" hidden onChange={onFileChange} />
            <Autocomplete
                size="small"
                disablePortal={true}
                options={rowStore.routes.map((route) => route.name)}
                sx={{ width: 300, marginRight: 2 }}
                renderInput={(params) => <TextField {...params} label="셔틀버스 노선" />}
                onChange={(_, value) => onChangeSelectedRoute(value)}
            />
            <ToolbarButton onClick={addRowButtonClicked}>
                <AddIcon />
            </ToolbarButton>
            <ToolbarButton onClick={() => fileInputRef.current?.click()}>
                <UploadFileIcon />
            </ToolbarButton>
            <ShuttleTimetableImportDialog
                open={importOpen}
                file={selectedFile}
                onClose={() => setImportOpen(false)}
                onSuccess={onImportSuccess}
            />
            <Snackbar open={Boolean(message)} autoHideDuration={3000} onClose={() => setMessage('')}>
                <Alert severity="success" onClose={() => setMessage('')}>{message}</Alert>
            </Snackbar>
        </Toolbar>
    )
}
