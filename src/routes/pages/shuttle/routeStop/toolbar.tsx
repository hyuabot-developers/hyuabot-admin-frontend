import { v4 as uuidv4 } from "uuid"
import { useEffect } from "react"
import { Autocomplete, TextField } from "@mui/material"
import { GridRowModes, Toolbar, ToolbarButton } from "@mui/x-data-grid"
import {
    useShuttleRouteStore,
    useShuttleRouteStopStore,
    useShuttleRouteStopGridModelStore,
    useSelectedShuttleRouteStore,
} from "../../../../stores/shuttle.ts"
import {
    getShuttleRoute,
    getShuttleRouteStop,
    ShuttleRouteResponse,
    ShuttleRouteStopResponse
} from "../../../../service/network/shuttle.ts"

import AddIcon from "@mui/icons-material/Add"

export function GridToolbar() {
    const routeStore = useShuttleRouteStore()
    const rowStore = useShuttleRouteStopStore()
    const rowModesModelStore = useShuttleRouteStopGridModelStore()
    const selectedRouteStore = useSelectedShuttleRouteStore()
    const fetchShuttleRoute = async () => {
        const response = await getShuttleRoute()
        if (response.status === 200) {
            const responseData = response.data
            routeStore.setRows(responseData.result.map((item: ShuttleRouteResponse) => {
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
    const fetchShuttleStop = async (routeName: string) => {
        const response = await getShuttleRouteStop(routeName)
        if (response.status === 200) {
            const responseData = response.data
            rowStore.setRows(responseData.result.map((item: ShuttleRouteStopResponse) => {
                return {
                    id: uuidv4(),
                    seq: item.seq,
                    stop: item.name,
                    order: item.order,
                    cumulativeTime: item.cumulativeTime,
                }
            }))
        }
    }
    const onChangeSelectedRoute = (value: string | null) => {
        if (value) {
            selectedRouteStore.setSelectedRoute(value)
            fetchShuttleStop(value).then()
        }
    }
    // Add record button click event
    const addRowButtonClicked = () => {
        const id = uuidv4()
        rowStore.setRows([
            {
                id,
                seq: null,
                stop: "",
                order: 0,
                cumulativeTime: "00:00:00",
                isNew: true,
            },
            ...rowStore.rows,
        ])
        rowModesModelStore.setRowModesModel(({
            ...rowModesModelStore.rowModesModel,
            [id]: { mode: GridRowModes.Edit, fieldToFocus: "route" },
        }))
    }
    useEffect(() => {
        fetchShuttleRoute().then()
    }, [])
    return (
        <Toolbar style={{ display: "flex", justifyContent: "flex-end", marginTop: "10px" }}>
            <Autocomplete
                size="small"
                disablePortal={true}
                options={routeStore.rows.map((route) => route.name)}
                sx={{ width: 300, marginRight: 2 }}
                renderInput={(params) => <TextField {...params} label="셔틀버스 노선" />}
                onChange={(_, value) => onChangeSelectedRoute(value)}
            />
            <ToolbarButton onClick={addRowButtonClicked}>
                <AddIcon />
            </ToolbarButton>
        </Toolbar>
    )
}