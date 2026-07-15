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
import { createBusTimetable, deleteBusTimetable, updateBusTimetable } from '../../../../service/network/bus.ts'
import {
    BusTimetable,
    useBusTimetableGridModelStore,
    useBusTimetableStore,
} from '../../../../stores/bus.ts'
import { createCrudGridActionsColumn } from '../../../components/CrudGridActions.tsx'
import { GridFeedback } from '../../../components/GridFeedback.tsx'


interface GridProps {
    columns: GridColDef[]
}

export const BusTimetableGrid = (props: GridProps) => {
    const rowStore = useBusTimetableStore()
    const rowModesModelStore = useBusTimetableGridModelStore()
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
        const response = await deleteBusTimetable(rowToDelete.seq)
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
    const updateRowProcess = async (newRow: BusTimetable) => {
        if (
            newRow.dayType === '' || newRow.departureTime === ''
        ) {
            setErrorSnackbarContent('올바른 데이터가 아닙니다.')
            rowStore.setRows(rowStore.rows.filter((row) => row.id !== newRow.id))
            return { ...newRow, _action: 'delete' }
        }
        if (newRow.isNew) {
            const response = await createBusTimetable(
                {
                    routeID: rowStore.selectedRouteID!,
                    startStopID: rowStore.selectedStopID!,
                    dayType: newRow.dayType,
                    departureTime: newRow.departureTime,
                }
            )
            if (response.status !== 201) {
                setErrorSnackbarContent('데이터 저장에 실패했습니다.')
                rowStore.setRows(rowStore.rows.filter((row) => row.id !== newRow.id))
                return { ...newRow, _action: 'delete' }
            }
        } else {
            const response = await updateBusTimetable(
                newRow.seq!,
                {
                    routeID: rowStore.selectedRouteID!,
                    startStopID: rowStore.selectedStopID!,
                    dayType: newRow.dayType,
                    departureTime: newRow.departureTime,
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
                showToolbar={true}
                columns={columns}
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
                            { field: 'time', sort: 'asc' }
                        ]
                    },
                }}
                autoPageSize={true}
                hideFooterPagination={false}
            />
        </Box>
    )
}
