import { v4 as uuidv4 } from "uuid"
import { Button } from "@mui/material"
import { GridRowModes, GridToolbarContainer } from "@mui/x-data-grid"
import {
    useShuttleRouteStopStore,
    useShuttleRouteStopGridModelStore
} from "../../../../stores/shuttle.ts"
import {
    getShuttleRouteStop,
    ShuttleRouteStopResponse
} from "../../../../service/network/shuttle.ts"

import AddIcon from "@mui/icons-material/Add"
import RefreshIcon from '@mui/icons-material/Refresh'

export function Toolbar() {
    const rowStore = useShuttleRouteStopStore()
    const rowModesModelStore = useShuttleRouteStopGridModelStore()
    const fetchShuttleStop = async () => {
        const response = await getShuttleRouteStop()
        if (response.status === 200) {
            const responseData = response.data
            return responseData.data.map((item: ShuttleRouteStopResponse) => {
                return {
                    id: uuidv4(),
                    route: item.route,
                    stop: item.stop,
                    sequence: item.sequence,
                    cumulativeTime: item.cumulativeTime,
                }
            })
        }
    }
    // Add record button click event
    const addRowButtonClicked = () => {
        const id = uuidv4()
        rowStore.setRows([
            ...rowStore.rows,
            {
                id,
                route: "",
                stop: "",
                sequence: 0,
                cumulativeTime: 0,
                isNew: true,
            },
        ])
        rowModesModelStore.setRowModesModel(({
            ...rowModesModelStore.rowModesModel,
            [id]: { mode: GridRowModes.Edit, fieldToFocus: "route" },
        }))
    }

    return (
        <GridToolbarContainer style={{ display: "flex", justifyContent: "flex-end", marginTop: "10px" }}>
            <Button color="primary" variant="outlined" startIcon={<RefreshIcon />} onClick={fetchShuttleStop}>
                새로고침
            </Button>
            <Button color="primary" variant="contained" startIcon={<AddIcon />} onClick={addRowButtonClicked}>
                항목 추가
            </Button>
        </GridToolbarContainer>
    )
}