import { v4 as uuidv4 } from "uuid"
import { Button } from "@mui/material"
import { GridRowModes, GridSlotProps, GridToolbarContainer } from "@mui/x-data-grid"
import AddIcon from "@mui/icons-material/Add"

export function Toolbar(props: GridSlotProps["toolbar"]) {
    const { setRows, setRowModesModel } = props
    const addRowButtonClicked = () => {
        const id = uuidv4()
        setRows((oldRows) => [
            ...oldRows,
            {
                id,
                type: "",
                start: "",
                end: "",
                isNew: true,
            },
        ])
        setRowModesModel((oldRowModesModel) => ({
            ...oldRowModesModel,
            [id]: { mode: GridRowModes.Edit, fieldToFocus: "name" },
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