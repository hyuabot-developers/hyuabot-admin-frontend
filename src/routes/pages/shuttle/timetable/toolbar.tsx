import { v4 as uuidv4 } from "uuid"
import { Button } from "@mui/material"
import { GridRowModes, GridToolbarContainer } from "@mui/x-data-grid"
import { useShuttleTimetableStore, useShuttleTimetableGridModelStore } from "../../../../stores/shuttle.ts"
import { getShuttleTimetable, ShuttleTimetableResponse } from "../../../../service/network/shuttle.ts"

import AddIcon from "@mui/icons-material/Add"
import RefreshIcon from '@mui/icons-material/Refresh'

export function Toolbar() {
    const rowStore = useShuttleTimetableStore()
    const rowModesModelStore = useShuttleTimetableGridModelStore()
    const fetchShuttleTimetable = async () => {
        const response = await getShuttleTimetable()
        if (response.status === 200) {
            const responseData = response.data
            rowStore.setRows(responseData.data.map((item: ShuttleTimetableResponse) => {
                return {
                    id: uuidv4(),
                    sequence: item.sequence,
                    period: item.period,
                    weekdays: item.weekdays,
                    route: item.route,
                    time: item.time,
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
                sequence: null,
                period: "",
                weekdays: true,
                route: "",
                time: "00:00:00",
                isNew: true,
            },
        ])
        rowModesModelStore.setRowModesModel(({
            ...rowModesModelStore.rowModesModel,
            [id]: { mode: GridRowModes.Edit, fieldToFocus: "period" },
        }))
    }

    return (
        <GridToolbarContainer style={{ display: "flex", justifyContent: "flex-end", marginTop: "10px" }}>
            <Button color="primary" variant="outlined" startIcon={<RefreshIcon />} onClick={fetchShuttleTimetable}>
                새로고침
            </Button>
            <Button color="primary" variant="contained" startIcon={<AddIcon />} onClick={addRowButtonClicked}>
                항목 추가
            </Button>
        </GridToolbarContainer>
    )
}