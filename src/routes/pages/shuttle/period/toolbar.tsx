
import AddIcon from '@mui/icons-material/Add'
import RefreshIcon from '@mui/icons-material/Refresh'
import { Toolbar, ToolbarButton, GridRowModes, GridRowModesModel } from '@mui/x-data-grid'
import dayjs from 'dayjs'
import { v4 as uuidv4 } from 'uuid'

import { getShuttlePeriod, ShuttlePeriodResponse } from '../../../../service/network/shuttle.ts'
import { ShuttlePeriod, useShuttlePeriodGridModelStore, useShuttlePeriodStore } from '../../../../stores/shuttle.ts'

export const GridToolbar = () => {
    const rowStore = useShuttlePeriodStore()
    const rowModesModelStore = useShuttlePeriodGridModelStore()
    // Fetch shuttle period
    const fetchShuttlePeriod = async () => {
        const response = await getShuttlePeriod()
        if (response.status === 200) {
            const responseData = response.data
            const rows = responseData.result.map((period: ShuttlePeriodResponse) => {
                return {
                    id: uuidv4(),
                    seq: period.seq,
                    type: period.type,
                    start: dayjs(period.start),
                    end: dayjs(period.end),
                }
            })
            rowStore.setRows(rows as ShuttlePeriod[])
            rowModesModelStore.setRowModesModel(
                rows.reduce((acc: GridRowModesModel, row: ShuttlePeriod) => {
                    acc[row.id] = { mode: GridRowModes.View }
                    return acc
                }, {} as Record<string, { mode: GridRowModes }>)
            )
        }
    }
    // Add record button click event
    const addRowButtonClicked = () => {
        const id = uuidv4()
        rowStore.setRows([
            {
                id,
                seq: null,
                type: '',
                start: null,
                end: null,
                isNew: true,
            },
            ...rowStore.rows,
        ])
        rowModesModelStore.setRowModesModel(({
            ...rowModesModelStore.rowModesModel,
            [id]: { mode: GridRowModes.Edit, fieldToFocus: 'type' },
        }))
    }

    return (
        <Toolbar>
            <ToolbarButton color="primary" onClick={fetchShuttlePeriod}>
                <RefreshIcon />
            </ToolbarButton>
            <ToolbarButton onClick={addRowButtonClicked}>
                <AddIcon />
            </ToolbarButton>
        </Toolbar>
    )
}