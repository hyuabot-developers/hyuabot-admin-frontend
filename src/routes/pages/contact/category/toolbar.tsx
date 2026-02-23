import AddIcon from '@mui/icons-material/Add'
import RefreshIcon from '@mui/icons-material/Refresh'
import { GridRowModes, Toolbar, ToolbarButton } from '@mui/x-data-grid'
import { v4 as uuidv4 } from 'uuid'

import { ContactCategoryResponse, getContactCategoryList } from '../../../../service/network/contact.ts'
import { useContactCategoryGridModelStore, useContactCategoryStore } from '../../../../stores/contact.ts'

export const GridToolbar = () => {
    // Get the store
    const rowStore = useContactCategoryStore()
    const rowModesModelStore = useContactCategoryGridModelStore()
    const fetchContactCategory = async () => {
        const response = await getContactCategoryList()
        if (response.status === 200) {
            const responseData = response.data
            rowStore.setRows(responseData.result.map((item: ContactCategoryResponse) => {
                return {
                    id: uuidv4(),
                    seq: item.seq,
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
                seq: null,
                name: '',
                isNew: true,
            },
        ])
        rowModesModelStore.setRowModesModel(({
            ...rowModesModelStore.rowModesModel,
            [id]: { mode: GridRowModes.Edit, fieldToFocus: 'name' },
        }))
    }

    return (
        <Toolbar style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '10px' }}>
            <ToolbarButton onClick={fetchContactCategory}>
                <RefreshIcon />
            </ToolbarButton>
            <ToolbarButton onClick={addRowButtonClicked}>
                <AddIcon />
            </ToolbarButton>
        </Toolbar>
    )
}