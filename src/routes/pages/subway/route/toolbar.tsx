import AddIcon from '@mui/icons-material/Add'
import RefreshIcon from '@mui/icons-material/Refresh'
import { GridRowModes, Toolbar, ToolbarButton } from '@mui/x-data-grid'
import { v4 as uuidv4 } from 'uuid'

import { getSubwayRoutes, SubwayRoute } from '../../../../service/network/subway.ts'
import { useSubwayRouteGridModelStore, useSubwayRouteStore } from '../../../../stores/subway.ts'

export const GridToolbar = () => {
    const rowStore = useSubwayRouteStore()
    const rowModesModelStore = useSubwayRouteGridModelStore()
    const fetchSubwayRoute = async () => {
        // Fetch subway route
        const routeResponse = await getSubwayRoutes()
        if (routeResponse.status === 200) {
            const responseData = routeResponse.data
            rowStore.setRows(responseData.data.map((item: SubwayRoute) => {
                return {
                    id: uuidv4(),
                    routeID: item.id,
                    name: item.name,
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
                routeID: 0,
                name: '',
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
            <ToolbarButton onClick={fetchSubwayRoute}>
                <RefreshIcon />
            </ToolbarButton>
            <ToolbarButton onClick={addRowButtonClicked}>
                <AddIcon />
            </ToolbarButton>
        </Toolbar>
    )
}