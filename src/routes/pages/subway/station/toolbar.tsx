import AddIcon from '@mui/icons-material/Add'
import RefreshIcon from '@mui/icons-material/Refresh'
import UploadFileIcon from '@mui/icons-material/UploadFile'
import { Alert, Snackbar } from '@mui/material'
import { GridRowModes, Toolbar, ToolbarButton } from '@mui/x-data-grid'
import { ChangeEvent, useRef, useState } from 'react'
import { v4 as uuidv4 } from 'uuid'

import { CsvRouteMappingDialog } from './CsvRouteMappingDialog.tsx'
import {
    getSubwayRoutes,
    getSubwayStations,
    SubwayStation
} from '../../../../service/network/subway.ts'
import {
    useSubwayStationGridModelStore,
    useSubwayStationStore
} from '../../../../stores/subway.ts'

export const GridToolbar = () => {
    // Get the store
    const rowStore = useSubwayStationStore()
    const rowModesModelStore = useSubwayStationGridModelStore()
    const fileInputRef = useRef<HTMLInputElement>(null)
    const [selectedFile, setSelectedFile] = useState<File | null>(null)
    const [mappingDialogOpen, setMappingDialogOpen] = useState(false)
    const [snackbarOpen, setSnackbarOpen] = useState(false)
    const [snackbarMessage, setSnackbarMessage] = useState('')
    const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success')
    const fetchSubwayStation = async () => {
        // Fetch subway route
        const routeResponse = await getSubwayRoutes()
        if (routeResponse.status === 200) {
            rowStore.setRoutes(routeResponse.data.result)
        }
        // Fetch subway station
        const stationResponse = await getSubwayStations()
        if (stationResponse.status === 200) {
            const stationData = stationResponse.data
            rowStore.setRows(stationData.result.map((item: SubwayStation) => {
                return {
                    id: uuidv4(),
                    stationID: item.id,
                    routeID: item.routeID,
                    name: item.name,
                    order: item.order,
                    cumulativeTime: item.cumulativeTime,
                }
            }))
        }
    }
    // Add record button click event
    const addRowButtonClicked = () => {
        if (!rowStore.routes.length) return
        const id = uuidv4()
        rowStore.setRows([
            {
                id,
                stationID: '',
                routeID: rowStore.routes[0].id,
                name: '',
                order: 0,
                cumulativeTime: '00:00:00',
                isNew: true,
            },
            ...rowStore.rows,
        ])
        rowModesModelStore.setRowModesModel(({
            ...rowModesModelStore.rowModesModel,
            [id]: { mode: GridRowModes.Edit, fieldToFocus: 'stationID' },
        }))
    }

    const uploadButtonClicked = () => {
        fileInputRef.current?.click()
    }

    const onFileChange = (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0]
        if (!file) return

        setSelectedFile(file)
        setMappingDialogOpen(true)
        event.target.value = ''
    }

    const handleUploadSuccess = (createdCount: number) => {
        setSnackbarMessage(`${createdCount}개의 역이 업로드되었습니다.`)
        setSnackbarSeverity('success')
        setSnackbarOpen(true)
        fetchSubwayStation().catch((e) => {
            setSnackbarMessage('목록 새로고침 실패: ' + (e instanceof Error ? e.message : String(e)))
            setSnackbarSeverity('error')
            setSnackbarOpen(true)
        })
    }

    return (
        <Toolbar style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '10px' }}>
            <input
                type="file"
                accept=".csv"
                ref={fileInputRef}
                style={{ display: 'none' }}
                onChange={onFileChange}
            />
            <ToolbarButton onClick={fetchSubwayStation}>
                <RefreshIcon />
            </ToolbarButton>
            <ToolbarButton onClick={addRowButtonClicked}>
                <AddIcon />
            </ToolbarButton>
            <ToolbarButton onClick={uploadButtonClicked}>
                <UploadFileIcon />
            </ToolbarButton>
            <CsvRouteMappingDialog
                open={mappingDialogOpen}
                onClose={() => setMappingDialogOpen(false)}
                file={selectedFile}
                routes={rowStore.routes}
                existingStationIDs={rowStore.rows.map((row) => row.stationID)}
                onSuccess={handleUploadSuccess}
            />
            <Snackbar open={snackbarOpen} autoHideDuration={3000} onClose={() => setSnackbarOpen(false)}>
                <Alert onClose={() => setSnackbarOpen(false)} severity={snackbarSeverity} sx={{ width: '100%' }}>
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </Toolbar>
    )
}
