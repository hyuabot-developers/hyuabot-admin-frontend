import { Alert, Box, Snackbar } from '@mui/material'
import { DataGrid, GridColDef } from '@mui/x-data-grid'
import { useState } from 'react'

import { GridToolbar } from './toolbar.tsx'
import {
    useBusRealtimeGridModelStore,
    useBusRealtimeStore,
} from '../../../../stores/bus.ts'


interface GridProps {
    columns: GridColDef[]
}

export const BusRealtimeGrid = (props: GridProps) => {
    const rowStore = useBusRealtimeStore()
    const rowModesModelStore = useBusRealtimeGridModelStore()
    const [errorSnackbarContent, setErrorSnackbarContent] = useState<string>('')
    const [successSnackbarContent, setSuccessSnackbarContent] = useState<string>('')
    // Render
    return (
        <Box sx={{ height: '90vh', width: '100%' }}>
            <Snackbar
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                open={errorSnackbarContent !== ''}
                autoHideDuration={3000}
                onClose={() => setErrorSnackbarContent('')}>
                <Alert onClose={() => setErrorSnackbarContent('')} severity="error" sx={{ width: '100%' }}>
                    {errorSnackbarContent}
                </Alert>
            </Snackbar>
            <Snackbar
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                open={successSnackbarContent !== ''}
                autoHideDuration={3000}
                onClose={() => setSuccessSnackbarContent('')}>
                <Alert onClose={() => setSuccessSnackbarContent('')} severity="success" sx={{ width: '100%' }}>
                    {successSnackbarContent}
                </Alert>
            </Snackbar>
            <div style={{ height: '100%', width: '100%' }}>
                <DataGrid
                    columns={props.columns}
                    rows={rowStore.rows}
                    rowModesModel={rowModesModelStore.rowModesModel}
                    editMode="row"
                    slots={{ toolbar: GridToolbar }}
                    initialState={{
                        sorting: {
                            sortModel: [{ field: 'route', sort: 'asc' }],
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