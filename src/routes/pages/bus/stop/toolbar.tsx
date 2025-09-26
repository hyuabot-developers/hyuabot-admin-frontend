import AddIcon from '@mui/icons-material/Add'
import RefreshIcon from '@mui/icons-material/Refresh'
import { GridRowModes, Toolbar, ToolbarButton } from '@mui/x-data-grid'
import { v4 as uuidv4 } from 'uuid'

import { BusStopResponse, getBusStops } from '../../../../service/network/bus.ts'
import { useBusStopGridModelStore, useBusStopStore } from '../../../../stores/bus.ts'


export const GridToolbar = () => {
    const rowStore = useBusStopStore()
    const rowModesModelStore = useBusStopGridModelStore()
    const fetchBusStop = async () => {
        const response = await getBusStops()
        if (response.status === 200) {
            const responseData = response.data
            rowStore.setRows(responseData.result.map((item: BusStopResponse) => {
                return {
                    id: uuidv4(),
                    stopID: item.id,
                    name: item.name,
                    latitude: item.latitude,
                    longitude: item.longitude,
                    districtCode: item.districtCode,
                    mobileNumber: item.mobileNumber,
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
                stopID: 0,
                name: '',
                latitude: 0,
                longitude: 0,
                districtCode: 2,
                mobileNumber: '',
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
            <ToolbarButton onClick={fetchBusStop}>
                <RefreshIcon />
            </ToolbarButton>
            <ToolbarButton onClick={addRowButtonClicked}>
                <AddIcon />
            </ToolbarButton>
        </Toolbar>
    )
}