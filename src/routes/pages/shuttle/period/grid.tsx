import CancelIcon from '@mui/icons-material/Close'
import DeleteIcon from '@mui/icons-material/DeleteOutlined'
import EditIcon from '@mui/icons-material/Edit'
import SaveIcon from '@mui/icons-material/Save'
import { Alert, Box, Snackbar } from '@mui/material'
import {
    DataGrid,
    GridActionsCellItem,
    GridColDef,
    GridEventListener,
    GridRowId,
    GridRowModes,
    GridRowModesModel
} from '@mui/x-data-grid'
import dayjs from 'dayjs'
import { useState } from 'react'

import { GridToolbar } from './toolbar.tsx'
import { createShuttlePeriod, deleteShuttlePeriod, updateShuttlePeriod } from '../../../../service/network/shuttle.ts'
import { ShuttlePeriod, useShuttlePeriodGridModelStore, useShuttlePeriodStore } from '../../../../stores/shuttle.ts'


interface GridProps {
    columns: GridColDef[]
}

export const ShuttlePeriodGrid = (props: GridProps) => {
    const rowStore = useShuttlePeriodStore()
    const rowModesModelStore = useShuttlePeriodGridModelStore()
    const [errorSnackbarContent, setErrorSnackbarContent] = useState<string>('')
    const [successSnackbarContent, setSuccessSnackbarContent] = useState<string>('')

    const rowEditStopped: GridEventListener<'rowEditStop'> = (params, event) => {
        if (event.defaultMuiPrevented) {
            return
        }
        const editedRow = rowStore.rows.find((row) => row.id === params.id)
        if (editedRow!.isNew) {
            rowStore.setRows(rowStore.rows.map((row) => {
                if (row.id === params.id) {
                    return { ...row, isNew: false }
                }
                return row
            }))
        }
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
        if (rowToDelete === undefined) { setErrorSnackbarContent('데이터 삭제에 실패했습니다.'); return }
        const response = await deleteShuttlePeriod(rowToDelete.seq!)
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
    const updateRowProcess = async (newRow: ShuttlePeriod) => {
        if (newRow.type === null || newRow.start === null || newRow.end === null) {
            setErrorSnackbarContent('올바른 데이터가 아닙니다.')
            rowStore.setRows(rowStore.rows.filter((row) => row.id !== newRow.id))
            return { ...newRow, _action: 'delete' }
        }
        if (!newRow.isNew && newRow.seq !== null) {
            if (newRow.start > newRow.end) {
                setErrorSnackbarContent('날짜 범위가 올바르지 않습니다.')
                return { ...newRow, _action: 'revert' }
            }
            const response = await updateShuttlePeriod(newRow.seq!, {
                type: newRow.type,
                start: dayjs(newRow.start).format('YYYY-MM-DD HH:mm:ss'),
                end: dayjs(newRow.end).format('YYYY-MM-DD HH:mm:ss'),
            })
            if (response.status !== 200) {
                setErrorSnackbarContent('데이터 저장에 실패했습니다.')
                return { ...newRow, _action: 'revert' }
            }
            setSuccessSnackbarContent('데이터 저장에 성공했습니다.')
            return newRow
        } else {
            if (newRow.start > newRow.end) {
                setErrorSnackbarContent('날짜 범위가 올바르지 않습니다.')
                rowStore.setRows(rowStore.rows.filter((row) => row.id !== newRow.id))
                return { ...newRow, _action: 'delete' }
            }
            const response = await createShuttlePeriod({
                type: newRow.type,
                start: dayjs(newRow.start).format('YYYY-MM-DD HH:mm:ss'),
                end: dayjs(newRow.end).format('YYYY-MM-DD HH:mm:ss'),
            })
            if (response.status !== 201) {
                setErrorSnackbarContent('데이터 저장에 실패했습니다.')
                rowStore.setRows(rowStore.rows.filter((row) => row.id !== newRow.id))
                return { ...newRow, _action: 'delete' }
            }
            setSuccessSnackbarContent('데이터 저장에 성공했습니다.')
            const updatedRow = { ...newRow, isNew: false }
            rowStore.setRows(rowStore.rows.map((row) => row.id === newRow.id ? updatedRow : row))
            return updatedRow
        }
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
        <Box sx={{ height: '100vh', width: '100%' }}>
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
            />
        </Box>
    )
}