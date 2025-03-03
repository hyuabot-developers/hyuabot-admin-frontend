import { v4 as uuidv4 } from "uuid"
import { Button } from "@mui/material"
import { GridRowModes, GridToolbarContainer } from "@mui/x-data-grid"
import { useShuttleStopStore, useShuttleStopGridModelStore } from "../../../../stores/shuttle.ts"
import { getShuttleStop, ShuttleStopResponse } from "../../../../service/network/shuttle.ts"

import AddIcon from "@mui/icons-material/Add"
import RefreshIcon from '@mui/icons-material/Refresh'

export function Toolbar() {
    const rowStore = useShuttleStopStore()
    const rowModesModelStore = useShuttleStopGridModelStore()
    const fetchShuttleStop = async () => {
        const response = await getShuttleStop()
        if (response.status === 200) {
            const responseData = response.data
            rowStore.setRows(responseData.data.map((period: ShuttleStopResponse) => {
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
            ...rowStore.rows,
            {
                id,
                name: "",
                latitude: 0,
                longitude: 0,
                isNew: true,
            },
        ])
        rowModesModelStore.setRowModesModel(({
            ...rowModesModelStore.rowModesModel,
            [id]: { mode: GridRowModes.Edit, fieldToFocus: "name" },
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