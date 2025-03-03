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
    ShuttleTimetable,
    useShuttleTimetableStore,
    useShuttleTimetableGridModelStore,
} from "../../../../stores/shuttle.ts"
import { useState } from "react"
import {
    createShuttleTimetable,
    deleteShuttleTimetable,
    updateShuttleTimetable,
} from "../../../../service/network/shuttle.ts"

interface GridProps {
    columns: GridColDef[]
}

export function ShuttleTimetableGrid(props: GridProps) {
    const rowStore = useShuttleTimetableStore()
    const rowModesModelStore = useShuttleTimetableGridModelStore()
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
    const editRowButtonClicked = (id: GridRowId) => {
        rowModesModelStore.setRowModesModel({...rowModesModelStore.rowModesModel, [id]: {mode: GridRowModes.Edit}})
    }
    const saveRowButtonClicked = (id: GridRowId) => {
        rowModesModelStore.setRowModesModel({...rowModesModelStore.rowModesModel, [id]: {mode: GridRowModes.View}})
    }
    const deleteRowButtonClicked = async (id: GridRowId) => {
        const rowToDelete = rowStore.rows.find(row => row.id === id)
        if (rowToDelete === undefined) { setErrorSnackbarContent("데이터 삭제에 실패했습니다."); return }
        if (rowToDelete.sequence === null) { setErrorSnackbarContent("데이터 삭제에 실패했습니다."); return }
        const response = await deleteShuttleTimetable(rowToDelete.sequence)
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
    const updateRowProcess = async (newRow: ShuttleTimetable) => {
        if (newRow.period === "" || newRow.route === "" || newRow.time === "") {
            setErrorSnackbarContent("올바른 데이터가 아닙니다.")
            rowStore.setRows(rowStore.rows.filter(row => row.id !== newRow.id))
            return { ...newRow, _action: "delete" }
        }
        if (newRow.isNew) {
            const response = await createShuttleTimetable({
                period: newRow.period,
                route: newRow.route,
                weekdays: newRow.weekdays,
                time: newRow.time,
            })
            if (response.status !== 201) {
                setErrorSnackbarContent("데이터 저장에 실패했습니다.")
                rowStore.setRows(rowStore.rows.filter(row => row.id !== newRow.id))
                return { ...newRow, _action: "delete" }
            }
            const responseData = response.data
            const updatedRow = {...newRow, sequence: responseData.sequence, isNew: false}
            setSuccessSnackbarContent("데이터 저장에 성공했습니다.")
            rowStore.setRows(rowStore.rows.map(row => row.id === newRow.id ? updatedRow : row))
            return updatedRow
        } else if (newRow.sequence !== null) {
            const response = await updateShuttleTimetable(newRow.sequence, {
                period: newRow.period,
                route: newRow.route,
                weekdays: newRow.weekdays,
                time: newRow.time,
            })
            if (response.status !== 200) {
                setErrorSnackbarContent("데이터 저장에 실패했습니다.")
                return { ...newRow, _action: "delete" }
            }
            setSuccessSnackbarContent("데이터 저장에 성공했습니다.")
            const updatedRow = {...newRow, isNew: false}
            rowStore.setRows(rowStore.rows.map(row => row.id === newRow.id ? updatedRow : row))
            return updatedRow
        } else {
            setErrorSnackbarContent("데이터 저장에 실패했습니다.")
            return { ...newRow, _action: "delete" }
        }
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
                autoPageSize={true}
                isCellEditable={(params) => params.colDef.field !== "actions" && (params.colDef.field !== "name" || params.row.isNew)}
            />
        </Box>
    )
}