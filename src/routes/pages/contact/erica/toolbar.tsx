import AddIcon from '@mui/icons-material/Add'
import RefreshIcon from '@mui/icons-material/Refresh'
import { GridRowModes, Toolbar, ToolbarButton } from '@mui/x-data-grid'
import { v4 as uuidv4 } from 'uuid'

import {
    ContactResponse,
    getContactCategoryList,
    getContactList
} from '../../../../service/network/contact.ts'
import {
    useContactGridModelStore,
    useContactStore
} from '../../../../stores/contact.ts'

export const GridToolbar = () => {
    // Get the store
    const rowModesModelStore = useContactGridModelStore()
    const rowStore = useContactStore()
    const fetchContact = async () => {
        const categoryResponse = await getContactCategoryList()
        if (categoryResponse.status === 200) {
            const categoryResponseData = categoryResponse.data
            rowStore.setCategories(categoryResponseData.result)
        }
        const response = await getContactList(2)
        if (response.status === 200) {
            const responseData = response.data
            const { categories } = useContactStore.getState()
            rowStore.setRows(responseData.result.map((item: ContactResponse) => {
                const category = categories.find((category) => category.seq === item.categoryID)
                return {
                    id: uuidv4(),
                    seq: item.seq,
                    name: item.name,
                    phone: item.phone,
                    category: `${category?.name} (${category?.seq})`,
                }
            }))
        }
    }
    // Add record button click event
    const addRowButtonClicked = () => {
        const id = uuidv4()
        const { categories } = useContactStore.getState()
        const category = categories[0]
        rowStore.setRows([
            {
                id,
                seq: null,
                name: '',
                phone: '',
                category: `${category?.name} (${category?.seq})`,
                isNew: true,
            },
            ...rowStore.rows,
        ])
        rowModesModelStore.setRowModesModel(({
            ...rowModesModelStore.rowModesModel,
            [id]: { mode: GridRowModes.Edit, fieldToFocus: 'name' },
        }))
    }

    return (
        <Toolbar style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '10px' }}>
            <ToolbarButton onClick={fetchContact}>
                <RefreshIcon />
            </ToolbarButton>
            <ToolbarButton onClick={addRowButtonClicked}>
                <AddIcon />
            </ToolbarButton>
        </Toolbar>
    )
}