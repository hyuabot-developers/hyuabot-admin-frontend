import { Alert, Box, Snackbar } from "@mui/material"
import {
    DataGrid,
    GridColDef,
    GridEventListener,
    GridRowModesModel
} from "@mui/x-data-grid"
import { Toolbar } from "./toolbar.tsx"
import { useState } from "react"
import {
    useBusRealtimeGridModelStore,
    useBusRealtimeStore,
} from "../../../../stores/bus.ts"


interface GridProps {
    columns: GridColDef[]
}

export function BusRealtimeGrid(props: GridProps) {
    const rowStore = useBusRealtimeStore()
    const rowModesModelStore = useBusRealtimeGridModelStore()
    const [errorSnackbarContent, setErrorSnackbarContent] = useState<string>("")
    const [successSnackbarContent, setSuccessSnackbarContent] = useState<string>("")

    const rowEditStopped: GridEventListener<"rowEditStop"> = (params, event) => {
        if (event.defaultMuiPrevented) {
            return
        }
        const editedRow = rowStore.rows.find(row => row.id === params.id)
        return editedRow!
    }
    const rowModesModelChanged = (newRowModesModel: GridRowModesModel) => {
        rowModesModelStore.setRowModesModel(newRowModesModel)
    }
    // Render
    return (
        <Box sx={{height: "100vh", width: "100%"}}>
            <Snackbar
                anchorOrigin={{vertical: "bottom", horizontal: "right"}}
                open={errorSnackbarContent !== ""}
                autoHideDuration={3000}
                onClose={() => setErrorSnackbarContent("")}>
                <Alert onClose={() => setErrorSnackbarContent("")} severity="error" sx={{width: "100%"}}>
                    {errorSnackbarContent}
                </Alert>
            </Snackbar>
            <Snackbar
                anchorOrigin={{vertical: "bottom", horizontal: "right"}}
                open={successSnackbarContent !== ""}
                autoHideDuration={3000}
                onClose={() => setSuccessSnackbarContent("")}>
                <Alert onClose={() => setSuccessSnackbarContent("")} severity="success" sx={{width: "100%"}}>
                    {successSnackbarContent}
                </Alert>
            </Snackbar>
            <div style={{width: "100%"}}>
                <DataGrid
                    columns={props.columns}
                    rows={rowStore.rows}
                    rowModesModel={rowModesModelStore.rowModesModel}
                    editMode="row"
                    onRowModesModelChange={rowModesModelChanged}
                    onRowEditStop={rowEditStopped}
                    slots={{toolbar: Toolbar}}
                    initialState={{
                        sorting: {
                            sortModel: [
                                { field: "routeName", sort: "asc" },
                                { field: "stopName", sort: "asc" },
                                { field: "sequence", sort: "asc" },
                            ]
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