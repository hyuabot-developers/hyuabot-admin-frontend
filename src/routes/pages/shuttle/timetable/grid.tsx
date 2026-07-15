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
import {
    createShuttleTimetable,
    deleteShuttleTimetable,
    updateShuttleTimetable,
} from '../../../../service/network/shuttle.ts'
import {
    ShuttleTimetable,
    useShuttleTimetableStore,
    useShuttleTimetableGridModelStore,
} from '../../../../stores/shuttle.ts'
import { createCrudGridActionsColumn } from '../../../components/CrudGridActions.tsx'
import { DataGridPage } from '../../../components/DataGridPage.tsx'
import { GridFeedback } from '../../../components/GridFeedback.tsx'

interface GridProps {
    columns: GridColDef[]
}
export const ShuttleTimetableGrid = (props: GridProps) => {
    const rowStore = useShuttleTimetableStore()
    const rowModesModelStore = useShuttleTimetableGridModelStore()
    const [errorSnackbarContent, setErrorSnackbarContent] = useState<string>('')
    const [successSnackbarContent, setSuccessSnackbarContent] = useState<string>('')

    const rowEditStopped: GridEventListener<'rowEditStop'> = (params, event) => {
        if (event.defaultMuiPrevented) {
            return
        }
        const editedRow = rowStore.rows.find((row) => row.id === params.id)
        return editedRow
    }
    // Button click event
    const editRowButtonClicked = (id: GridRowId) => {
        rowModesModelStore.setRowModesModel({ ...rowModesModelStore.rowModesModel, [id]: { mode: GridRowModes.Edit } })
    }
    const saveRowButtonClicked = (id: GridRowId) => {
        rowModesModelStore.setRowModesModel({ ...rowModesModelStore.rowModesModel, [id]: { mode: GridRowModes.View } })
    }
    const deleteRowButtonClicked = async (id: GridRowId) => {
        const { rows, selectedRoute } = useShuttleTimetableStore.getState()
        const rowToDelete = rows.find((row) => row.id === id)
        if (rowToDelete === undefined || rowToDelete.seq === null || selectedRoute === null) {
            setErrorSnackbarContent('데이터 삭제에 실패했습니다.')
            return
        }
        const response = await deleteShuttleTimetable(selectedRoute, rowToDelete.seq)
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
        if (editedRow?.isNew) {
            rowStore.setRows(rowStore.rows.filter((row) => row.id !== id))
        }
    }
    const updateRowProcess = async (newRow: ShuttleTimetable) => {
        const selectedRoute = rowStore.selectedRoute
        if (newRow.period === '' || newRow.time === '' || selectedRoute === null) {
            setErrorSnackbarContent('올바른 데이터가 아닙니다.')
            rowStore.setRows(rowStore.rows.filter((row) => row.id !== newRow.id))
            return { ...newRow, _action: 'delete' }
        }
        if (newRow.isNew) {
            const response = await createShuttleTimetable(
                selectedRoute, {
                    period: newRow.period,
                    weekday: newRow.weekdays,
                    departureTime: newRow.time,
                }
            )
            if (response.status !== 201) {
                setErrorSnackbarContent('데이터 저장에 실패했습니다.')
                rowStore.setRows(rowStore.rows.filter((row) => row.id !== newRow.id))
                return { ...newRow, _action: 'delete' }
            }
            const responseData = response.data
            const updatedRow = { ...newRow, seq: responseData.seq, isNew: false }
            setSuccessSnackbarContent('데이터 저장에 성공했습니다.')
            rowStore.setRows(rowStore.rows.map((row) => row.id === newRow.id ? updatedRow : row))
            return updatedRow
        } else if (newRow.seq !== null) {
            const response = await updateShuttleTimetable(selectedRoute, newRow.seq, {
                period: newRow.period,
                weekday: newRow.weekdays,
                departureTime: newRow.time,
            })
            if (response.status !== 200) {
                setErrorSnackbarContent('데이터 저장에 실패했습니다.')
                return { ...newRow, _action: 'delete' }
            }
            setSuccessSnackbarContent('데이터 저장에 성공했습니다.')
            const updatedRow = { ...newRow, isNew: false }
            rowStore.setRows(rowStore.rows.map((row) => row.id === newRow.id ? updatedRow : row))
            return updatedRow
        } else {
            setErrorSnackbarContent('데이터 저장에 실패했습니다.')
            return { ...newRow, _action: 'delete' }
        }
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
        <DataGridPage>
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
                autoPageSize={true}
                isCellEditable={(params) => params.colDef.field !== 'actions' && (params.colDef.field !== 'name' || params.row.isNew)}
            />
        </DataGridPage>
    )
}
