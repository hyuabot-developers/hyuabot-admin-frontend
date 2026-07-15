import { Box } from '@mui/material'
import {
    DataGrid,
    GridColDef,
    GridEventListener,
    GridRowModesModel
} from '@mui/x-data-grid'
import { useState } from 'react'

import { GridToolbar } from './toolbar.tsx'
import {
    useSubwayRealtimeGridModelStore,
    useSubwayRealtimeStore,
} from '../../../../stores/subway.ts'
import { GridFeedback } from '../../../components/GridFeedback.tsx'


interface GridProps {
    columns: GridColDef[]
}

export const SubwayRealtimeGrid = (props: GridProps) => {
    const rowStore = useSubwayRealtimeStore()
    const rowModesModelStore = useSubwayRealtimeGridModelStore()
    const [errorSnackbarContent, setErrorSnackbarContent] = useState<string>('')
    const [successSnackbarContent, setSuccessSnackbarContent] = useState<string>('')

    const rowEditStopped: GridEventListener<'rowEditStop'> = (params, event) => {
        if (event.defaultMuiPrevented) {
            return
        }
        const editedRow = rowStore.rows.find((row) => row.id === params.id)
        return editedRow!
    }
    const rowModesModelChanged = (newRowModesModel: GridRowModesModel) => {
        rowModesModelStore.setRowModesModel(newRowModesModel)
    }
    // Render
    return (
        <Box sx={{ height: '90vh', width: '100%' }}>
            <GridFeedback
                error={errorSnackbarContent}
                success={successSnackbarContent}
                onErrorClose={() => setErrorSnackbarContent('')}
                onSuccessClose={() => setSuccessSnackbarContent('')}
            />
            <DataGrid
                columns={props.columns}
                rows={rowStore.rows}
                rowModesModel={rowModesModelStore.rowModesModel}
                editMode="row"
                onRowModesModelChange={rowModesModelChanged}
                onRowEditStop={rowEditStopped}
                showToolbar={true}
                slots={{ toolbar: GridToolbar }}
                initialState={{
                    sorting: { sortModel: [{ field: 'sortableId', sort: 'asc' }] },
                    columns: { columnVisibilityModel: { sortableId: false, order: false } },
                }}
            />
        </Box>
    )
}
