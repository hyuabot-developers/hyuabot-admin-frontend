import { DataGrid, GridColDef } from '@mui/x-data-grid'
import { useState } from 'react'

import { GridToolbar } from './toolbar.tsx'
import {
    useBusRealtimeGridModelStore,
    useBusRealtimeStore,
} from '../../../../stores/bus.ts'
import { DataGridPage } from '../../../components/DataGridPage.tsx'
import { GridFeedback } from '../../../components/GridFeedback.tsx'


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
        <DataGridPage>
            <GridFeedback
                error={errorSnackbarContent}
                success={successSnackbarContent}
                onErrorClose={() => setErrorSnackbarContent('')}
                onSuccessClose={() => setSuccessSnackbarContent('')}
            />
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
        </DataGridPage>
    )
}
