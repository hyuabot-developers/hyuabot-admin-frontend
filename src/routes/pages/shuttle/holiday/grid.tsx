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
import {
    ShuttleHoliday,
    useShuttleHolidayStore,
    useShuttleHolidayGridModelStore
} from "../../../../stores/shuttle.ts"
import { useState } from "react"
import { createShuttleHoliday, deleteShuttleHoliday } from "../../../../service/network/shuttle.ts"
import dayjs from "dayjs"

interface GridProps {
    columns: GridColDef[]
}

export function ShuttleHolidayGrid(props: GridProps) {
    const rowStore = useShuttleHolidayStore()
    const rowModesModelStore = useShuttleHolidayGridModelStore()
    const [errorSnackbarContent, setErrorSnackbarContent] = useState<string>("")
    const [successSnackbarContent, setSuccessSnackbarContent] = useState<string>("")

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
    const deleteRowButtonClicked = async (id: GridRowId) => {
        const rowToDelete = rowStore.rows.find(row => row.id === id)
        if (rowToDelete === undefined) { setErrorSnackbarContent("데이터 삭제에 실패했습니다."); return }
        const response = await deleteShuttleHoliday({
            type: rowToDelete.type,
            calendar: rowToDelete.calendar,
            date: dayjs(rowToDelete.date).format("YYYY-MM-DD"),
        })
        if (response.status !== 204) {
            setErrorSnackbarContent("데이터 삭제에 실패했습니다.")
            return
        }
        setSuccessSnackbarContent("데이터 삭제에 성공했습니다.")
        rowStore.setRows(rowStore.rows.filter(row => row.id !== id))
    }
    const cancelRowButtonClicked = (id: GridRowId) => {
        rowModesModelStore.setRowModesModel({...rowModesModelStore.rowModesModel, [id]: {mode: GridRowModes.View, ignoreModifications: true}})
        const editedRow = rowStore.rows.find(row => row.id === id)
        if (editedRow!.isNew) {
            rowStore.setRows(rowStore.rows.filter(row => row.id !== id))
        }
    }
    const updateRowProcess = async (newRow: ShuttleHoliday) => {
        if (newRow.type === "" || newRow.calendar === "" || newRow.date === "") {
            setErrorSnackbarContent("올바른 데이터가 아닙니다.")
            rowStore.setRows(rowStore.rows.filter(row => row.id !== newRow.id))
            return { ...newRow, _action: "delete" }
        }
        const response = await createShuttleHoliday({
            type: newRow.type,
            calendar: newRow.calendar,
            date: dayjs(newRow.date).format("YYYY-MM-DD"),
        })
        if (response.status !== 201) {
            setErrorSnackbarContent("데이터 저장에 실패했습니다.")
            rowStore.setRows(rowStore.rows.filter(row => row.id !== newRow.id))
            return { ...newRow, _action: "delete" }
        }
        setSuccessSnackbarContent("데이터 저장에 성공했습니다.")
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