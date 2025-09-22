import { v4 as uuidv4 } from "uuid"
import { Button } from "@mui/material"
import { GridRowModes, Toolbar, ToolbarButton } from "@mui/x-data-grid"
import { useShuttleRouteStore, useShuttleRouteGridModelStore } from "../../../../stores/shuttle.ts"
import { getShuttleRoute, ShuttleRouteResponse } from "../../../../service/network/shuttle.ts"

import AddIcon from "@mui/icons-material/Add"
import RefreshIcon from '@mui/icons-material/Refresh'

export function GridToolbar() {
    const rowStore = useShuttleRouteStore()
    const rowModesModelStore = useShuttleRouteGridModelStore()
    const fetchShuttleRoute = async () => {
        const response = await getShuttleRoute()
        if (response.status === 200) {
            const responseData = response.data
            rowStore.setRows(responseData.result.map((period: ShuttleRouteResponse) => {
                return {
                    id: uuidv4(),
                    name: period.name,
                    tag: period.tag,
                    korean: period.descriptionKorean,
                    english: period.descriptionEnglish,
                    start: period.startStopID,
                    end: period.endStopID,
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
                name: "",
                tag: "",
                korean: "",
                english: "",
                start: "",
                end: "",
                isNew: true,
            },
            ...rowStore.rows,
        ])
        rowModesModelStore.setRowModesModel(({
            ...rowModesModelStore.rowModesModel,
            [id]: { mode: GridRowModes.Edit, fieldToFocus: "name" },
        }))
    }

    return (
        <Toolbar style={{ display: "flex", justifyContent: "flex-end", marginTop: "10px" }}>
            <ToolbarButton onClick={fetchShuttleRoute}>
                <RefreshIcon />
            </ToolbarButton>
            <Button onClick={addRowButtonClicked}>
                <AddIcon />
            </Button>
        </Toolbar>
    )
}