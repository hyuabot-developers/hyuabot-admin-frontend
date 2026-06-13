import AddIcon from '@mui/icons-material/Add'
import RefreshIcon from '@mui/icons-material/Refresh'
import { GridRowModes, Toolbar, ToolbarButton } from '@mui/x-data-grid'
import dayjs from 'dayjs'
import { v4 as uuidv4 } from 'uuid'

import { getPublicHoliday, PublicHolidayResponse } from '../../../../service/network/publicHoliday.ts'
import { usePublicHolidayGridModelStore, usePublicHolidayStore } from '../../../../stores/publicHoliday.ts'

export const GridToolbar = () => {
    const rowStore = usePublicHolidayStore()
    const rowModesModelStore = usePublicHolidayGridModelStore()
    const fetchPublicHoliday = async () => {
        const response = await getPublicHoliday()
        if (response.status === 200) {
            rowStore.setRows(response.data.result.map((item: PublicHolidayResponse) => ({
                id: uuidv4(),
                seq: item.seq,
                name: item.name,
                calendarType: item.calendarType,
                date: dayjs(item.date),
            })))
        }
    }
    const addRowButtonClicked = () => {
        const id = uuidv4()
        rowStore.setRows([
            {
                id,
                seq: null,
                name: '',
                calendarType: '',
                date: null,
                isNew: true,
            },
            ...rowStore.rows,
        ])
        rowModesModelStore.setRowModesModel({
            ...rowModesModelStore.rowModesModel,
            [id]: { mode: GridRowModes.Edit, fieldToFocus: 'name' },
        })
    }

    return (
        <Toolbar>
            <ToolbarButton onClick={fetchPublicHoliday}>
                <RefreshIcon />
            </ToolbarButton>
            <ToolbarButton onClick={addRowButtonClicked}>
                <AddIcon />
            </ToolbarButton>
        </Toolbar>
    )
}
