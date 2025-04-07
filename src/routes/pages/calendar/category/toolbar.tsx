import { v4 as uuidv4 } from "uuid"
import { Button } from "@mui/material"
import { GridRowModes, GridToolbarContainer } from "@mui/x-data-grid"
import AddIcon from "@mui/icons-material/Add"
import RefreshIcon from '@mui/icons-material/Refresh'
import { useCalendarCategoryGridModelStore, useCalendarCategoryStore } from "../../../../stores/calendar.ts"
import { CalendarCategoryResponse, getCalendarCategoryList } from "../../../../service/network/calendar.ts"

export function Toolbar() {
    // Get the store
    const rowStore = useCalendarCategoryStore()
    const rowModesModelStore = useCalendarCategoryGridModelStore()
    const fetchCalendarCategory = async () => {
        const response = await getCalendarCategoryList()
        if (response.status === 200) {
            const responseData = response.data
            rowStore.setRows(responseData.data.map((item: CalendarCategoryResponse) => {
                return {
                    id: uuidv4(),
                    categoryID: item.id,
                    name: item.name,
                    isNew: false,
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
                categoryID: rowStore.rows.length ? rowStore.rows[rowStore.rows.length - 1].categoryID + 1 : 1,
                name: "",
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
            <Button color="primary" variant="outlined" startIcon={<RefreshIcon />} onClick={fetchCalendarCategory}>
                새로고침
            </Button>
            <Button color="primary" variant="contained" startIcon={<AddIcon />} onClick={addRowButtonClicked}>
                항목 추가
            </Button>
        </GridToolbarContainer>
    )
}