import AddIcon from '@mui/icons-material/Add'
import RefreshIcon from '@mui/icons-material/Refresh'
import { GridRowModes, Toolbar, ToolbarButton } from '@mui/x-data-grid'
import { v4 as uuidv4 } from 'uuid'

import {
    CalendarResponse,
    getCalendarCategoryList,
    getCalendarList
} from '../../../../service/network/calendar.ts'
import {
    useCalendarGridModelStore,
    useCalendarStore
} from '../../../../stores/calendar.ts'


export const GridToolbar = () => {
    // Get the store
    const rowModesModelStore = useCalendarGridModelStore()
    const rowStore = useCalendarStore()
    const fetchCalendar = async () => {
        const categoryResponse = await getCalendarCategoryList()
        if (categoryResponse.status === 200) {
            const categoryResponseData = categoryResponse.data
            rowStore.setCategories(categoryResponseData.result)
        }
        const response = await getCalendarList()
        if (response.status === 200) {
            const responseData = response.data
            const { categories } = useCalendarStore.getState()
            rowStore.setRows(responseData.result.map((item: CalendarResponse) => {
                const category = categories.find((category) => category.seq === item.categoryID)
                return {
                    id: uuidv4(),
                    seq: item.seq,
                    category: `${category?.name} (${category?.seq})`,
                    title: item.title,
                    description: item.description,
                    start: item.start,
                    end: item.end,
                }
            }))
        }
    }
    // Add record button click event
    const addRowButtonClicked = () => {
        const id = uuidv4()
        const { categories } = useCalendarStore.getState()
        const category = categories[0]
        rowStore.setRows([
            {
                id,
                seq: null,
                category: `${category?.name} (${category?.seq})`,
                title: '',
                description: '',
                start: '2999-12-31',
                end: '2999-12-31',
                isNew: true,
            },
            ...rowStore.rows,
        ])
        rowModesModelStore.setRowModesModel(({
            ...rowModesModelStore.rowModesModel,
            [id]: { mode: GridRowModes.Edit, fieldToFocus: 'title' },
        }))
    }

    return (
        <Toolbar style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '10px' }}>
            <ToolbarButton onClick={fetchCalendar}>
                <RefreshIcon />
            </ToolbarButton>
            <ToolbarButton onClick={addRowButtonClicked}>
                <AddIcon />
            </ToolbarButton>
        </Toolbar>
    )
}