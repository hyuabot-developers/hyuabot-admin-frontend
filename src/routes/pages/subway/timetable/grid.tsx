import CancelIcon from '@mui/icons-material/Close'
import DeleteIcon from '@mui/icons-material/DeleteOutlined'
import EditIcon from '@mui/icons-material/Edit'
import SaveIcon from '@mui/icons-material/Save'
import { Alert, Box, Snackbar } from '@mui/material'
import {
    DataGrid, GridActionsCellItem,
    GridColDef,
    GridEventListener, GridRowId, GridRowModes,
    GridRowModesModel
} from '@mui/x-data-grid'
import { useState } from 'react'

import { GridToolbar } from './toolbar.tsx'
import {
    createSubwayTimetable,
    deleteSubwayTimetable,
    updateSubwayTimetable
} from '../../../../service/network/subway.ts'
import {
    GridSubwayTimetable,
    useSubwayTimetableGridModelStore,
    useSubwayTimetableStore
} from '../../../../stores/subway.ts'



interface GridProps {
    columns: GridColDef[]
}

export const SubwayTimetableGrid = (props: GridProps) => {
    const rowStore = useSubwayTimetableStore()
    const rowModesModelStore = useSubwayTimetableGridModelStore()
    const [errorSnackbarContent, setErrorSnackbarContent] = useState<string>('')
    const [successSnackbarContent, setSuccessSnackbarContent] = useState<string>('')

    const rowEditStopped: GridEventListener<'rowEditStop'> = (params, event) => {
        if (event.defaultMuiPrevented) {
            return
        }
        const editedRow = rowStore.rows.find((row) => row.id === params.id)
        return editedRow!
    }
    // Button click event
    const editRowButtonClicked = (id: GridRowId) => {
        rowModesModelStore.setRowModesModel({ ...rowModesModelStore.rowModesModel, [id]: { mode: GridRowModes.Edit } })
    }
    const saveRowButtonClicked = (id: GridRowId) => {
        rowModesModelStore.setRowModesModel({ ...rowModesModelStore.rowModesModel, [id]: { mode: GridRowModes.View } })
    }
    const deleteRowButtonClicked = async (id: GridRowId) => {
        const rowToDelete = rowStore.rows.find((row) => row.id === id)
        if (rowToDelete === undefined || rowToDelete.seq == null) { setErrorSnackbarContent('데이터 삭제에 실패했습니다.'); return }
        const { selectedStationID } = useSubwayTimetableStore.getState()
        if (selectedStationID == null) { setErrorSnackbarContent('데이터 삭제에 실패했습니다.'); return }
        const response = await deleteSubwayTimetable(selectedStationID, rowToDelete.seq)
        if (response.status !== 204) {
            setErrorSnackbarContent('데이터 삭제에 실패했습니다.')
            return
        }
        setSuccessSnackbarContent('데이터 삭제에 성공했습니다.')
        rowStore.setRows(rowStore.rows.filter((row) => row.id !== id))
    }
    const cancelRowButtonClicked = (id: GridRowId) => {
        rowModesModelStore.setRowModesModel({ ...rowModesModelStore.rowModesModel, [id]: { mode: GridRowModes.View, ignoreModifications: true } })
        const editedRow = rowStore.rows.find((row) => row.id === id)
        if (editedRow!.isNew) {
            rowStore.setRows(rowStore.rows.filter((row) => row.id !== id))
        }
    }
    const updateRowProcess = async (newRow: GridSubwayTimetable) => {
        if (
            newRow.startStation === '' ||
            newRow.terminalStation === '' ||
            newRow.departureTime === ''
        ) {
            setErrorSnackbarContent('올바른 데이터가 아닙니다.')
            rowStore.setRows(rowStore.rows.filter((row) => row.id !== newRow.id))
            return { ...newRow, _action: 'delete' }
        }
        const { selectedStationID, selectedDirection, selectedWeekday } = useSubwayTimetableStore.getState()
        if (selectedStationID == null || selectedDirection == null || selectedWeekday == null) {
            setErrorSnackbarContent('올바른 데이터가 아닙니다.')
            rowStore.setRows(rowStore.rows.filter((row) => row.id !== newRow.id))
            return { ...newRow, _action: 'delete' }
        }
        if (newRow.isNew) {
            const response = await createSubwayTimetable(
                selectedStationID,
                {
                    direction: selectedDirection,
                    weekday: selectedWeekday,
                    departureTime: newRow.departureTime,
                    startStationID: newRow.startStation.split('(')[1].split(')')[0],
                    terminalStationID: newRow.terminalStation.split('(')[1].split(')')[0],
                }
            )
            if (response.status !== 201) {
                setErrorSnackbarContent('데이터 저장에 실패했습니다.')
                rowStore.setRows(rowStore.rows.filter((row) => row.id !== newRow.id))
                return { ...newRow, _action: 'delete' }
            }
        } else {
            const response = await updateSubwayTimetable(
                selectedStationID,
                newRow.seq!,
                {
                    direction: selectedDirection,
                    weekday: selectedWeekday,
                    departureTime: newRow.departureTime,
                    startStationID: newRow.startStation.split('(')[1].split(')')[0],
                    terminalStationID: newRow.terminalStation.split('(')[1].split(')')[0],
                }
            )
            if (response.status !== 200) {
                setErrorSnackbarContent('데이터 저장에 실패했습니다.')
                return { ...newRow, _action: 'delete' }
            }
        }
        setSuccessSnackbarContent('데이터 저장에 성공했습니다.')
        const updatedRow = { ...newRow, isNew: false }
        rowStore.setRows(rowStore.rows.map((row) => row.id === newRow.id ? updatedRow : row))
        return updatedRow
    }
    const rowModesModelChanged = (newRowModesModel: GridRowModesModel) => {
        rowModesModelStore.setRowModesModel(newRowModesModel)
    }
    // Add action column
    props.columns.push({
        field: 'actions',
        headerName: '동작',
        type: 'actions',
        width: 100,
        cellClassName: 'actions',
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
                    showToolbar={true}
                    columns={props.columns}
                    rows={rowStore.rows}
                    rowModesModel={rowModesModelStore.rowModesModel}
                    editMode="row"
                    onRowModesModelChange={rowModesModelChanged}
                    onRowEditStop={rowEditStopped}
                    processRowUpdate={updateRowProcess}
                    slots={{ toolbar: GridToolbar }}
                    isCellEditable={(params) => params.colDef.field !== 'actions'}
                    initialState={{
                        sorting: {
                            sortModel: [
                                { field: 'departureTime', sort: 'asc' }
                            ]
                        },
                    }}
                    autoPageSize={true}
                    hideFooterPagination={false}
                />
            </div>
        </Box>
    )
}