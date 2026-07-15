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
import { createCalendar, deleteCalendar, updateCalendar } from '../../../../service/network/calendar.ts'
import { GridCalendarEventItem, useCalendarGridModelStore, useCalendarStore } from '../../../../stores/calendar.ts'
import { createCrudGridActionsColumn } from '../../../components/CrudGridActions.tsx'
import { GridFeedback } from '../../../components/GridFeedback.tsx'

interface GridProps {
    columns: GridColDef[]
}

export const CalendarGrid = (props: GridProps) => {
    const rowStore = useCalendarStore()
    const rowModesModelStore = useCalendarGridModelStore()
    const [errorSnackbarContent, setErrorSnackbarContent] = useState<string>('')
    const [successSnackbarContent, setSuccessSnackbarContent] = useState<string>('')

    const toLocalDateString = (date: string | Date) => {
        if (typeof date === 'string') return date

        // 한국 시간대(Asia/Seoul) 기준으로 연-월-일 포맷팅
        return new Intl.DateTimeFormat('sv-SE', {
            timeZone: 'Asia/Seoul',
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
        }).format(date)
    }
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
        if (rowToDelete === undefined) { setErrorSnackbarContent('데이터 삭제에 실패했습니다.'); return }
        if (rowToDelete.seq === null) { setErrorSnackbarContent('데이터 삭제에 실패했습니다.'); return }
        const response = await deleteCalendar(rowToDelete.seq)
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
    const updateRowProcess = async (newRow: GridCalendarEventItem) => {
        if (newRow.title === '' || newRow.start === '' || newRow.end === '' || newRow.category === '') {
            setErrorSnackbarContent('올바른 데이터가 아닙니다.')
            rowStore.setRows(rowStore.rows.filter((row) => row.id !== newRow.id))
            return { ...newRow, _action: 'delete' }
        }
        const formattedStart = toLocalDateString(newRow.start)
        const formattedEnd = toLocalDateString(newRow.end)
        if (newRow.isNew) {
            const response = await createCalendar(
                {
                    title: newRow.title,
                    categoryID: parseInt(newRow.category.split('(')[1]?.split(')')[0] ?? '0', 10),
                    description: newRow.description,
                    start: formattedStart,
                    end: formattedEnd,
                }
            )
            if (response.status !== 201) {
                setErrorSnackbarContent('데이터 저장에 실패했습니다.')
                rowStore.setRows(rowStore.rows.filter((row) => row.id !== newRow.id))
                return { ...newRow, _action: 'delete' }
            }
            setSuccessSnackbarContent('데이터 저장에 성공했습니다.')
        } else if (newRow.seq !== null) {
            // Format start and end to YYYY-MM-DD if Date object is passed
            const response = await updateCalendar(
                newRow.seq,
                {
                    title: newRow.title,
                    categoryID: parseInt(newRow.category.split('(')[1]?.split(')')[0] ?? '0', 10),
                    description: newRow.description,
                    start: formattedStart,
                    end: formattedEnd,
                }
            )
            if (response.status !== 200) {
                setErrorSnackbarContent('데이터 저장에 실패했습니다.')
                return { ...newRow, _action: 'delete' }
            }
            setSuccessSnackbarContent('데이터 저장에 성공했습니다.')
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
        <Box sx={{ height: '100vh', width: '100%' }}>
            <GridFeedback
                error={errorSnackbarContent}
                success={successSnackbarContent}
                onErrorClose={() => setErrorSnackbarContent('')}
                onSuccessClose={() => setSuccessSnackbarContent('')}
            />
            <div style={{ width: '100%' }}>
                <DataGrid
                    columns={columns}
                    rows={rowStore.rows}
                    rowModesModel={rowModesModelStore.rowModesModel}
                    editMode="row"
                    onRowModesModelChange={rowModesModelChanged}
                    onRowEditStop={rowEditStopped}
                    processRowUpdate={updateRowProcess}
                    slots={{ toolbar: GridToolbar }}
                    showToolbar={true}
                    isCellEditable={(params) => params.colDef.field !== 'actions' && (params.row.isNew || (params.colDef.field !== 'eventID'))}
                    hideFooterPagination={false}
                    initialState={{
                        sorting: {
                            sortModel: [
                                { field: 'seq', sort: 'asc' },
                            ]
                        },
                    }}
                />
            </div>
        </Box>
    )
}
