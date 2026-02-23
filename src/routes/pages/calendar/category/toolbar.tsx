import AddIcon from '@mui/icons-material/Add'
import RefreshIcon from '@mui/icons-material/Refresh'
import { GridRowModes, Toolbar, ToolbarButton } from '@mui/x-data-grid'
import { v4 as uuidv4 } from 'uuid'

import { CalendarCategoryResponse, getCalendarCategoryList } from '../../../../service/network/calendar.ts'
import { useCalendarCategoryGridModelStore, useCalendarCategoryStore } from '../../../../stores/calendar.ts'

export const GridToolbar = () => {
    // Get the store
    const rowStore = useCalendarCategoryStore()
    const rowModesModelStore = useCalendarCategoryGridModelStore()
    const fetchCalendarCategory = async () => {
        const response = await getCalendarCategoryList()
        if (response.status === 200) {
            const responseData = response.data
            rowStore.setRows(responseData.result.map((item: CalendarCategoryResponse) => {
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
            {
                id,
                seq: null,
                name: '',
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
            <ToolbarButton onClick={fetchCalendarCategory}>
                <RefreshIcon />
            </ToolbarButton>
            <ToolbarButton onClick={addRowButtonClicked}>
                <AddIcon />
            </ToolbarButton>
        </Toolbar>
    )
}