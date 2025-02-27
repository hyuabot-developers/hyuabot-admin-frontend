import { v4 as uuidv4 } from "uuid"
import { Button } from "@mui/material"
import { GridRowModes, GridToolbarContainer } from "@mui/x-data-grid"
import { useShuttleHolidayGridModelStore, useShuttleHolidayStore } from "../../../../stores/shuttle.ts"
import { getShuttleHoliday, ShuttleHolidayResponse } from "../../../../service/network/shuttle.ts"

import AddIcon from "@mui/icons-material/Add"
import RefreshIcon from '@mui/icons-material/Refresh'

export function Toolbar() {
    const rowStore = useShuttleHolidayStore()
    const rowModesModelStore = useShuttleHolidayGridModelStore()
    const fetchShuttleHoliday = async () => {
        const response = await getShuttleHoliday()
        if (response.status === 200) {
            const responseData = response.data
            rowStore.setRows(responseData.data.map((period: ShuttleHolidayResponse) => {
                return {
                    id: uuidv4(),
                    type: period.type,
                    calendar: period.calendar,
                    date: period.date,
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
                type: "",
                calendar: "",
                date: "",
                isNew: true,
            },
        ])
        rowModesModelStore.setRowModesModel(({
            ...rowModesModelStore.rowModesModel,
            [id]: { mode: GridRowModes.Edit, fieldToFocus: "type" },
        }))
    }

    return (
        <GridToolbarContainer style={{ display: "flex", justifyContent: "flex-end", marginTop: "10px" }}>
            <Button color="primary" variant="outlined" startIcon={<RefreshIcon />} onClick={fetchShuttleHoliday}>
                새로고침
            </Button>
            <Button color="primary" variant="contained" startIcon={<AddIcon />} onClick={addRowButtonClicked}>
                항목 추가
            </Button>
        </GridToolbarContainer>
    )
}