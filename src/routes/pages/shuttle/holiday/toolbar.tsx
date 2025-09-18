import { v4 as uuidv4 } from "uuid"
import {GridRowModes, Toolbar, ToolbarButton} from "@mui/x-data-grid"
import { useShuttleHolidayGridModelStore, useShuttleHolidayStore } from "../../../../stores/shuttle.ts"
import { getShuttleHoliday, ShuttleHolidayResponse } from "../../../../service/network/shuttle.ts"

import AddIcon from "@mui/icons-material/Add"
import RefreshIcon from '@mui/icons-material/Refresh'
import dayjs from "dayjs"

export function GridToolbar() {
    const rowStore = useShuttleHolidayStore()
    const rowModesModelStore = useShuttleHolidayGridModelStore()
    const fetchShuttleHoliday = async () => {
        const response = await getShuttleHoliday()
        if (response.status === 200) {
            const responseData = response.data
            rowStore.setRows(responseData.result.map((period: ShuttleHolidayResponse) => {
                return {
                    id: uuidv4(),
                    seq: period.seq,
                    type: period.type,
                    calendarType: period.calendarType,
                    date: dayjs(period.date),
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
                seq: null,
                type: "",
                calendarType: "",
                date: null,
                isNew: true,
            },
            ...rowStore.rows,
        ])
        rowModesModelStore.setRowModesModel(({
            ...rowModesModelStore.rowModesModel,
            [id]: { mode: GridRowModes.Edit, fieldToFocus: "type" },
        }))
    }

    return (
        <Toolbar>
            <ToolbarButton onClick={fetchShuttleHoliday}>
                <RefreshIcon />
            </ToolbarButton>
            <ToolbarButton onClick={addRowButtonClicked}>
                <AddIcon />
            </ToolbarButton>
        </Toolbar>
    )
}