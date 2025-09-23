import AddIcon from '@mui/icons-material/Add'
import RefreshIcon from '@mui/icons-material/Refresh'
import { GridRowModes, Toolbar, ToolbarButton } from '@mui/x-data-grid'
import { v4 as uuidv4 } from 'uuid'

import { getShuttleStop, ShuttleStopResponse } from '../../../../service/network/shuttle.ts'
import { useShuttleStopStore, useShuttleStopGridModelStore } from '../../../../stores/shuttle.ts'


export const GridToolbar = () => {
    const rowStore = useShuttleStopStore()
    const rowModesModelStore = useShuttleStopGridModelStore()
    const fetchShuttleStop = async () => {
        const response = await getShuttleStop()
        if (response.status === 200) {
            const responseData = response.data
            rowStore.setRows(responseData.result.map((period: ShuttleStopResponse) => {
                return {
                    id: uuidv4(),
                    name: period.name,
                    latitude: period.latitude,
                    longitude: period.longitude,
                }
            }))
        }
    }
    // Add record button click event
    const addRowButtonClicked = () => {
        const id = uuidv4()
        rowStore.setRows([
            {
                id,
                name: '',
                latitude: 0,
                longitude: 0,
                isNew: true,
            },
            ...rowStore.rows,
        ])
        rowModesModelStore.setRowModesModel(({
            ...rowModesModelStore.rowModesModel,
            [id]: { mode: GridRowModes.Edit, fieldToFocus: 'name' },
        }))
    }

    return (
        <Toolbar style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '10px' }}>
            <ToolbarButton onClick={fetchShuttleStop}>
                <RefreshIcon />
            </ToolbarButton>
            <ToolbarButton onClick={addRowButtonClicked}>
                <AddIcon />
            </ToolbarButton>
        </Toolbar>
    )
}