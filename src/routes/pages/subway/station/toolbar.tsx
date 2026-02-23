import AddIcon from '@mui/icons-material/Add'
import RefreshIcon from '@mui/icons-material/Refresh'
import { GridRowModes, Toolbar, ToolbarButton } from '@mui/x-data-grid'
import { v4 as uuidv4 } from 'uuid'

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
            rowStore.setRows(stationData.data.map((item: SubwayStation) => {
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

    return (
        <Toolbar style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '10px' }}>
            <ToolbarButton onClick={fetchSubwayStation}>
                <RefreshIcon />
            </ToolbarButton>
            <ToolbarButton onClick={addRowButtonClicked}>
                <AddIcon />
            </ToolbarButton>
        </Toolbar>
    )
}