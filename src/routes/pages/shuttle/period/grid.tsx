import { Alert, Box, Snackbar } from "@mui/material"
import {
    DataGrid,
    GridActionsCellItem,
    GridColDef,
    GridEventListener,
    GridRowId,
    GridRowModes,
    GridRowModesModel
} from "@mui/x-data-grid"
import EditIcon from "@mui/icons-material/Edit"
import DeleteIcon from "@mui/icons-material/DeleteOutlined"
import SaveIcon from "@mui/icons-material/Save"
import CancelIcon from "@mui/icons-material/Close"
import { Toolbar } from "./toolbar.tsx"
import { ShuttlePeriod, useShuttlePeriodGridModelStore, useShuttlePeriodStore } from "../../../../stores/shuttle.ts"
import { useState } from "react"

interface GridProps {
    columns: GridColDef[]
}

export function ShuttlePeriodGrid(props: GridProps) {
    const rowStore = useShuttlePeriodStore()
    const rowModesModelStore = useShuttlePeriodGridModelStore()
    const [openInvalidDataSnackbar, setOpenInvalidDataSnackbar] = useState(false)
    const [openInvlideDateRangeSnackbar, setOpenInvalidDateRangeSnackbar] = useState(false)
    const rowEditStopped: GridEventListener<"rowEditStop"> = (params, event) => {
        if (event.defaultMuiPrevented) {
            return
        }
        const editedRow = rowStore.rows.find(row => row.id === params.id)
        if (editedRow!.isNew) {
            rowStore.setRows(rowStore.rows.map(row => {
                if (row.id === params.id) {
                    return {...row, isNew: false}
                }
                return row
            }))
        }
    }
    // Button click event
    const editRowButtonClicked = (id: GridRowId) => {
        rowModesModelStore.setRowModesModel({...rowModesModelStore.rowModesModel, [id]: {mode: GridRowModes.Edit}})
    }
    const saveRowButtonClicked = (id: GridRowId) => {
        rowModesModelStore.setRowModesModel({...rowModesModelStore.rowModesModel, [id]: {mode: GridRowModes.View}})
    }
    const deleteRowButtonClicked = (id: GridRowId) => {
        rowStore.setRows(rowStore.rows.filter(row => row.id !== id))
    }
    const cancelRowButtonClicked = (id: GridRowId) => {
        rowModesModelStore.setRowModesModel({...rowModesModelStore.rowModesModel, [id]: {mode: GridRowModes.View, ignoreModifications: true}})
        const editedRow = rowStore.rows.find(row => row.id === id)
        if (editedRow!.isNew) {
            rowStore.setRows(rowStore.rows.filter(row => row.id !== id))
        }
    }
    const updateRowProcess = (newRow: ShuttlePeriod) => {
        if (newRow.type === "" || newRow.start === "" || newRow.end === "") {
            setOpenInvalidDataSnackbar(true)
            rowStore.setRows(rowStore.rows.filter(row => row.id !== newRow.id))
            return { ...newRow, _action: "delete" }
        } else if (newRow.start > newRow.end) {
            setOpenInvalidDateRangeSnackbar(true)
            rowStore.setRows(rowStore.rows.filter(row => row.id !== newRow.id))
            return { ...newRow, _action: "delete" }
        }
        const updatedRow = {...newRow, isNew: false}
        rowStore.setRows(rowStore.rows.map(row => row.id === newRow.id ? updatedRow : row))
        return updatedRow
    }
    const rowModesModelChanged = (newRowModesModel: GridRowModesModel) => {
        rowModesModelStore.setRowModesModel(newRowModesModel)
    }
    // Add action column
    props.columns.push({
        field: "actions",
        headerName: "동작",
        type: "actions",
        width: 100,
        cellClassName: "actions",
        getActions: ({ id }) => {
            const isEditing = rowModesModelStore.rowModesModel[id]?.mode === GridRowModes.Edit
            if (isEditing) {
                return [
                    <GridActionsCellItem label="save" key="save" icon={<SaveIcon />} onClick={() => saveRowButtonClicked(id)} />,
                    <GridActionsCellItem label="cancel" key="cancel" icon={<CancelIcon />} onClick={() => cancelRowButtonClicked(id)} />,
                ]
            }
            return [
                <GridActionsCellItem
                    label="edit"
                    key="edit"
                    icon={<EditIcon />}
                    onClick={() => editRowButtonClicked(id)}
                    disabled={!rowStore.rows.find(row => row.id === id)!.isNew}
                />,
                <GridActionsCellItem label="delete" key="delete" icon={<DeleteIcon />} onClick={() => deleteRowButtonClicked(id)} />,
            ]
        }
    })
    // Render
    return (
        <Box sx={{height: "100vh", width: "100%"}}>
            <Snackbar
                anchorOrigin={{vertical: "bottom", horizontal: "right"}}
                open={openInvalidDataSnackbar}
                autoHideDuration={3000}
                onClose={() => setOpenInvalidDataSnackbar(false)}>
                <Alert onClose={() => setOpenInvalidDataSnackbar(false)} severity="error" sx={{width: "100%"}}>
                    올바른 데이터가 아닙니다.
                </Alert>
            </Snackbar>
            <Snackbar
                anchorOrigin={{vertical: "bottom", horizontal: "right"}}
                open={openInvlideDateRangeSnackbar}
                autoHideDuration={3000}
                onClose={() => setOpenInvalidDateRangeSnackbar(false)}>
                <Alert onClose={() => setOpenInvalidDateRangeSnackbar(false)} severity="error" sx={{width: "100%"}}>
                    날짜 범위가 올바르지 않습니다.
                </Alert>
            </Snackbar>
            <DataGrid
                columns={props.columns}
                rows={rowStore.rows}
                rowModesModel={rowModesModelStore.rowModesModel}
                editMode="row"
                onRowModesModelChange={rowModesModelChanged}
                onRowEditStop={rowEditStopped}
                processRowUpdate={updateRowProcess}
                slots={{toolbar: Toolbar}}
                isCellEditable={(params) => params.row.isNew}
            />
        </Box>
    )
}