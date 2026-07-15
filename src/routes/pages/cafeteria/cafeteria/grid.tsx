import { Box } from '@mui/material'
import {
    DataGrid,
    GridColDef,
    GridEventListener,
    GridRowId,
    GridRowModes,
    GridRowModesModel
} from '@mui/x-data-grid'
import { useState } from 'react'

import { GridToolbar } from './toolbar.tsx'
import { createCafeteria, deleteCafeteria, updateCafeteria } from '../../../../service/network/cafeteria.ts'
import {
    GridCafeteriaItem,
    useCafeteriaItemGridModelStore,
    useCafeteriaItemStore
} from '../../../../stores/cafeteria.ts'
import { createCrudGridActionsColumn } from '../../../components/CrudGridActions.tsx'
import { GridFeedback } from '../../../components/GridFeedback.tsx'

interface GridProps {
    columns: GridColDef[]
}

export const CafeteriaGrid = (props: GridProps) => {
    const rowStore = useCafeteriaItemStore()
    const rowModesModelStore = useCafeteriaItemGridModelStore()
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
        if (rowToDelete === undefined || rowToDelete.seq === null) { setErrorSnackbarContent('데이터 삭제에 실패했습니다.'); return }
        const response = await deleteCafeteria(rowToDelete.seq)
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
    const updateRowProcess = async (newRow: GridCafeteriaItem) => {
        if (newRow.name === '' || newRow.seq === 0 || newRow.seq == null) {
            setErrorSnackbarContent('올바른 데이터가 아닙니다.')
            rowStore.setRows(rowStore.rows.filter((row) => row.id !== newRow.id))
            return { ...newRow, _action: 'delete' }
        }
        if (newRow.isNew) {
            try {
                await createCafeteria({
                    id: newRow.seq,
                    name: newRow.name,
                    campusID: parseInt(newRow.campus.split('(')[1]?.split(')')[0] ?? '0', 10),
                    latitude: newRow.latitude,
                    longitude: newRow.longitude,
                    breakfastTime: newRow.breakfastTime.length > 0 ? newRow.breakfastTime : null,
                    lunchTime: newRow.lunchTime.length > 0 ? newRow.lunchTime : null,
                    dinnerTime: newRow.dinnerTime.length > 0 ? newRow.dinnerTime : null,
                })
                setSuccessSnackbarContent('데이터 저장에 성공했습니다.')
            } catch {
                setErrorSnackbarContent('데이터 저장에 실패했습니다.')
                rowStore.setRows(rowStore.rows.filter((row) => row.id !== newRow.id))
                return { ...newRow, _action: 'delete' }
            }
        } else {
            try {
                await updateCafeteria(newRow.seq, {
                    name: newRow.name,
                    latitude: newRow.latitude,
                    longitude: newRow.longitude,
                    campusID: parseInt(newRow.campus.split('(')[1]?.split(')')[0] ?? '0', 10),
                    breakfastTime: newRow.breakfastTime.length > 0 ? newRow.breakfastTime : null,
                    lunchTime: newRow.lunchTime.length > 0 ? newRow.lunchTime : null,
                    dinnerTime: newRow.dinnerTime.length > 0 ? newRow.dinnerTime : null,
                })
                setSuccessSnackbarContent('데이터 저장에 성공했습니다.')
            } catch {
                setErrorSnackbarContent('데이터 저장에 실패했습니다.')
                return newRow
            }
        }
        const updatedRow = { ...newRow, isNew: false }
        rowStore.setRows(rowStore.rows.map((row) => row.id === newRow.id ? updatedRow : row))
        return updatedRow
    }
    const rowModesModelChanged = (newRowModesModel: GridRowModesModel) => {
        rowModesModelStore.setRowModesModel(newRowModesModel)
    }
    const columns = [
        ...props.columns,
        createCrudGridActionsColumn({
            rowModesModel: rowModesModelStore.rowModesModel,
            onEdit: editRowButtonClicked,
            onSave: saveRowButtonClicked,
            onCancel: cancelRowButtonClicked,
            onDelete: deleteRowButtonClicked,
        }),
    ]
    // Render
    return (
        <Box sx={{ height: '90vh', width: '100%' }}>
            <GridFeedback
                error={errorSnackbarContent}
                success={successSnackbarContent}
                onErrorClose={() => setErrorSnackbarContent('')}
                onSuccessClose={() => setSuccessSnackbarContent('')}
            />
            <DataGrid
                columns={columns}
                rows={rowStore.rows}
                rowModesModel={rowModesModelStore.rowModesModel}
                editMode="row"
                onRowModesModelChange={rowModesModelChanged}
                onRowEditStop={rowEditStopped}
                processRowUpdate={updateRowProcess}
                showToolbar={true}
                slots={{ toolbar: GridToolbar }}
                isCellEditable={(params) => params.colDef.field !== 'actions' && (params.colDef.field !== 'id' || params.row.isNew)}
            />
        </Box>
    )
}
