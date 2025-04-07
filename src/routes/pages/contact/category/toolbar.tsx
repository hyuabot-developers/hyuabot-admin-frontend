import { v4 as uuidv4 } from "uuid"
import { Button } from "@mui/material"
import { GridRowModes, GridToolbarContainer } from "@mui/x-data-grid"
import AddIcon from "@mui/icons-material/Add"
import RefreshIcon from '@mui/icons-material/Refresh'
import { useContactCategoryGridModelStore, useContactCategoryStore } from "../../../../stores/contact.ts"
import { ContactCategoryResponse, getContactCategoryList } from "../../../../service/network/contact.ts"

export function Toolbar() {
    // Get the store
    const rowStore = useContactCategoryStore()
    const rowModesModelStore = useContactCategoryGridModelStore()
    const fetchContactCategory = async () => {
        const response = await getContactCategoryList()
        if (response.status === 200) {
            const responseData = response.data
            rowStore.setRows(responseData.data.map((item: ContactCategoryResponse) => {
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
                categoryID: rowStore.rows.length,
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
            <Button color="primary" variant="outlined" startIcon={<RefreshIcon />} onClick={fetchContactCategory}>
                새로고침
            </Button>
            <Button color="primary" variant="contained" startIcon={<AddIcon />} onClick={addRowButtonClicked}>
                항목 추가
            </Button>
        </GridToolbarContainer>
    )
}