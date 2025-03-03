import { v4 as uuidv4 } from "uuid"
import { Button } from "@mui/material"
import { GridRowModes, GridToolbarContainer } from "@mui/x-data-grid"
import {
    useShuttleRouteStopStore,
    useShuttleRouteStopGridModelStore,
    ShuttleRouteStop
} from "../../../../stores/shuttle.ts"
import {
    getShuttleRoute,
    getShuttleRouteStop,
    ShuttleRouteResponse,
    ShuttleRouteStopResponse
} from "../../../../service/network/shuttle.ts"

import AddIcon from "@mui/icons-material/Add"
import RefreshIcon from '@mui/icons-material/Refresh'

export function Toolbar() {
    const rowStore = useShuttleRouteStopStore()
    const rowModesModelStore = useShuttleRouteStopGridModelStore()
    const fetchShuttleRoute = async () => {
        const response = await getShuttleRoute()
        if (response.status === 200) {
            const responseData = response.data
            return responseData.data.map((item: ShuttleRouteResponse) => {
                return {
                    id: uuidv4(),
                    name: item.name,
                    tag: item.tag,
                    korean: item.korean,
                    english: item.english,
                    start: item.start,
                    end: item.end,
                }
            })
        }
    }
    const fetchShuttleStop = async (routeName: string) => {
        const response = await getShuttleRouteStop(routeName)
        if (response.status === 200) {
            const responseData = response.data
            return responseData.data.map((item: ShuttleRouteStopResponse) => {
                return {
                    id: uuidv4(),
                    route: routeName,
                    stop: item.stop,
                    sequence: item.sequence,
                    cumulativeTime: item.cumulativeTime,
                }
            })
        }
    }
    const fetchShuttleRouteStop = async () => {
        const shuttleRoute = await fetchShuttleRoute()
        if (shuttleRoute) {
            const rows: ShuttleRouteStop[] = []
            for (const route of shuttleRoute) {
                const response = await fetchShuttleStop(route.name)
                if (response) {
                    rows.push(...response)
                }
            }
            rowStore.setRows(rows)
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
            <Button color="primary" variant="outlined" startIcon={<RefreshIcon />} onClick={fetchShuttleRouteStop}>
                새로고침
            </Button>
            <Button color="primary" variant="contained" startIcon={<AddIcon />} onClick={addRowButtonClicked}>
                항목 추가
            </Button>
        </GridToolbarContainer>
    )
}