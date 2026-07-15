import {
    DataGrid,
    GridColDef,
    GridEventListener,
    GridRowId,
    GridRowModes,
    GridRowModesModel,
} from '@mui/x-data-grid'
import dayjs from 'dayjs'
import { useState } from 'react'

import { GridToolbar } from './toolbar.tsx'
import {
    createPublicHoliday,
    deletePublicHoliday,
    updatePublicHoliday,
} from '../../../../service/network/publicHoliday.ts'
import {
    PublicHoliday,
    usePublicHolidayGridModelStore,
    usePublicHolidayStore,
} from '../../../../stores/publicHoliday.ts'
import { createCrudGridActionsColumn } from '../../../components/CrudGridActions.tsx'
import { DataGridPage } from '../../../components/DataGridPage.tsx'
import { GridFeedback } from '../../../components/GridFeedback.tsx'

interface GridProps {
    columns: GridColDef[]
}
export const PublicHolidayGrid = (props: GridProps) => {
    const rowStore = usePublicHolidayStore()
    const rowModesModelStore = usePublicHolidayGridModelStore()
    const [errorSnackbarContent, setErrorSnackbarContent] = useState<string>('')
    const [successSnackbarContent, setSuccessSnackbarContent] = useState<string>('')

    const rowEditStopped: GridEventListener<'rowEditStop'> = (params, event) => {
        if (event.defaultMuiPrevented) return
        const editedRow = rowStore.rows.find((row) => row.id === params.id)
        if (editedRow!.isNew) {
            rowStore.setRows(rowStore.rows.map((row) =>
                row.id === params.id ? { ...row, isNew: false } : row
            ))
        }
    }

    const editRowButtonClicked = (id: GridRowId) => {
        rowModesModelStore.setRowModesModel({ ...rowModesModelStore.rowModesModel, [id]: { mode: GridRowModes.Edit } })
    }
    const saveRowButtonClicked = (id: GridRowId) => {
        rowModesModelStore.setRowModesModel({ ...rowModesModelStore.rowModesModel, [id]: { mode: GridRowModes.View } })
    }
    const deleteRowButtonClicked = async (id: GridRowId) => {
        const rowToDelete = rowStore.rows.find((row) => row.id === id)
        if (rowToDelete === undefined) { setErrorSnackbarContent('데이터 삭제에 실패했습니다.'); return }
        const response = await deletePublicHoliday(rowToDelete.seq!)
        if (response.status !== 204) { setErrorSnackbarContent('데이터 삭제에 실패했습니다.'); return }
        setSuccessSnackbarContent('데이터 삭제에 성공했습니다.')
        rowStore.setRows(rowStore.rows.filter((row) => row.id !== id))
    }
    const cancelRowButtonClicked = (id: GridRowId) => {
        rowModesModelStore.setRowModesModel({
            ...rowModesModelStore.rowModesModel,
            [id]: { mode: GridRowModes.View, ignoreModifications: true },
        })
        const editedRow = rowStore.rows.find((row) => row.id === id)
        if (editedRow!.isNew) {
            rowStore.setRows(rowStore.rows.filter((row) => row.id !== id))
        }
    }
    const updateRowProcess = async (newRow: PublicHoliday) => {
        if (!newRow.name || !newRow.calendarType || !newRow.date) {
            setErrorSnackbarContent('올바른 데이터가 아닙니다.')
            rowStore.setRows(rowStore.rows.filter((row) => row.id !== newRow.id))
            return { ...newRow, _action: 'delete' }
        }
        if (!newRow.isNew && newRow.seq !== null) {
            const response = await updatePublicHoliday(newRow.seq, {
                name: newRow.name!,
                calendarType: newRow.calendarType!,
                date: dayjs(newRow.date).format('YYYY-MM-DD'),
            })
            if (response.status !== 200) { setErrorSnackbarContent('데이터 저장에 실패했습니다.'); return { ...newRow, _action: 'revert' } }
            setSuccessSnackbarContent('데이터 저장에 성공했습니다.')
            return newRow
        } else {
            const response = await createPublicHoliday({
                name: newRow.name!,
                calendarType: newRow.calendarType!,
                date: dayjs(newRow.date).format('YYYY-MM-DD'),
            })
            if (response.status !== 201) {
                setErrorSnackbarContent('데이터 저장에 실패했습니다.')
                rowStore.setRows(rowStore.rows.filter((row) => row.id !== newRow.id))
                return { ...newRow, _action: 'delete' }
            }
            setSuccessSnackbarContent('데이터 저장에 성공했습니다.')
            const updatedRow = { ...newRow, isNew: false, seq: response.data.seq }
            rowStore.setRows(rowStore.rows.map((row) => row.id === newRow.id ? updatedRow : row))
            return updatedRow
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
            />
        </DataGridPage>
    )
}
