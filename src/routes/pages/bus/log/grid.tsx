import { Box } from '@mui/material'
import { DataGrid, GridColDef } from '@mui/x-data-grid'
import { useState } from 'react'

import { GridToolbar } from './toolbar.tsx'
import {
    useBusDepartureLogGridModelStore,
    useBusDepartureLogStore,
} from '../../../../stores/bus.ts'
import { GridFeedback } from '../../../components/GridFeedback.tsx'


interface GridProps {
    columns: GridColDef[]
}

export const BusDepartureGrid = (props: GridProps) => {
    const rowStore = useBusDepartureLogStore()
    const rowModesModelStore = useBusDepartureLogGridModelStore()
    const [errorSnackbarContent, setErrorSnackbarContent] = useState<string>('')
    const [successSnackbarContent, setSuccessSnackbarContent] = useState<string>('')
    // Render
    return (
        <Box sx={{ height: '90vh', width: '100%' }}>
            <GridFeedback
                error={errorSnackbarContent}
                success={successSnackbarContent}
                onErrorClose={() => setErrorSnackbarContent('')}
                onSuccessClose={() => setSuccessSnackbarContent('')}
            />
            <div style={{ height: '100%', width: '100%' }}>
                <DataGrid
                    showToolbar={true}
                    columns={props.columns}
                    rows={rowStore.rows}
                    rowModesModel={rowModesModelStore.rowModesModel}
                    editMode="row"
                    slots={{ toolbar: GridToolbar }}
                    initialState={{
                        sorting: {
                            sortModel: [{ field: 'timestamp', sort: 'desc' }],
                        },
                        pagination: { paginationModel: { pageSize: 20 } }
                    }}
                    pageSizeOptions={[20]}
                    hideFooterPagination={false}
                />
            </div>
        </Box>
    )
}
