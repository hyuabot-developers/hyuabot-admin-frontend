import { v4 as uuidv4 } from "uuid"
import { Button } from "@mui/material"
import { GridRowModes, GridToolbarContainer } from "@mui/x-data-grid"
import AddIcon from "@mui/icons-material/Add"
import { useShuttlePeriodGridModelStore, useShuttlePeriodStore } from "../../../../stores/shuttle.ts"

export function Toolbar() {
    const rowStore = useShuttlePeriodStore()
    const rowModesModelStore = useShuttlePeriodGridModelStore()
    const addRowButtonClicked = () => {
        const id = uuidv4()
        rowStore.setRows([
            ...rowStore.rows,
            {
                id,
                type: "",
                start: "",
                end: "",
                isNew: true,
            },
        ])
        rowModesModelStore.setRowModesModel(({
            ...rowModesModelStore.rowModesModel,
            [id]: { mode: GridRowModes.Edit, fieldToFocus: "type" },
        }))
    }

    return (
        <GridToolbarContainer>
            <Button color="primary" startIcon={<AddIcon />} onClick={addRowButtonClicked}>
                Add record
            </Button>
        </GridToolbarContainer>
    )
}