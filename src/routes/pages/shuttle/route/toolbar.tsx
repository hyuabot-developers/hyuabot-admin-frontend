import { v4 as uuidv4 } from "uuid"
import { Button } from "@mui/material"
import { GridRowModes, GridToolbarContainer } from "@mui/x-data-grid"
import { useShuttleRouteStore, useShuttleRouteGridModelStore } from "../../../../stores/shuttle.ts"
import { getShuttleRoute, ShuttleRouteResponse } from "../../../../service/network/shuttle.ts"

import AddIcon from "@mui/icons-material/Add"
import RefreshIcon from '@mui/icons-material/Refresh'

export function Toolbar() {
    const rowStore = useShuttleRouteStore()
    const rowModesModelStore = useShuttleRouteGridModelStore()
    const fetchShuttleRoute = async () => {
        const response = await getShuttleRoute()
        if (response.status === 200) {
            const responseData = response.data
            rowStore.setRows(responseData.data.map((period: ShuttleRouteResponse) => {
                return {
                    id: uuidv4(),
                    name: period.name,
                    tag: period.tag,
                    korean: period.korean,
                    english: period.english,
                    start: period.start,
                    end: period.end,
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
                tag: "",
                korean: "",
                english: "",
                start: "",
                end: "",
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
            <Button color="primary" variant="outlined" startIcon={<RefreshIcon />} onClick={fetchShuttleRoute}>
                새로고침
            </Button>
            <Button color="primary" variant="contained" startIcon={<AddIcon />} onClick={addRowButtonClicked}>
                항목 추가
            </Button>
        </GridToolbarContainer>
    )
}