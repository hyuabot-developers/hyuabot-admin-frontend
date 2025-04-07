import { Alert, Box, Snackbar } from "@mui/material"
import {
    DataGrid,
    GridColDef,
    GridEventListener,
    GridRowModesModel
} from "@mui/x-data-grid"
import { Toolbar } from "./toolbar.tsx"
import { useState } from "react"
import { useReadingRoomItemGridModelStore, useReadingRoomItemStore } from "../../../../stores/readingRoom.ts"

interface GridProps {
    columns: GridColDef[]
}

export function ReadingRoomGrid(props: GridProps) {
    const rowStore = useReadingRoomItemStore()
    const rowModesModelStore = useReadingRoomItemGridModelStore()
    const [errorSnackbarContent, setErrorSnackbarContent] = useState<string>("")
    const [successSnackbarContent, setSuccessSnackbarContent] = useState<string>("")

    const rowEditStopped: GridEventListener<"rowEditStop"> = (params, event) => {
        if (event.defaultMuiPrevented) {
            return
        }
        const editedRow = rowStore.rows.find(row => row.id === params.id)
        return editedRow!
    }
    // Button click event
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
            <div style={{ width: "100%" }}>
                <DataGrid
                    columns={props.columns}
                    rows={rowStore.rows}
                    rowModesModel={rowModesModelStore.rowModesModel}
                    editMode="row"
                    onRowModesModelChange={rowModesModelChanged}
                    onRowEditStop={rowEditStopped}
                    slots={{toolbar: Toolbar}}
                    isCellEditable={(params) => params.colDef.field !== "actions" && params.row.isNew}
                    pageSizeOptions={[10]}
                    hideFooterPagination={false}
                    initialState={{
                        pagination: { paginationModel: { pageSize: 10 } },
                        sorting: {
                            sortModel: [
                                { field: "readingRoomID", sort: "asc" },
                            ]
                        },
                    }}
                />
            </div>
        </Box>
    )
}