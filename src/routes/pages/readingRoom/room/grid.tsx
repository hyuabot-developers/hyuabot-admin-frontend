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
import { createReadingRoom, deleteReadingRoom, updateReadingRoom } from '../../../../service/network/readingRoom.ts'
import {
    GridReadingRoomItem,
    useReadingRoomItemGridModelStore,
    useReadingRoomItemStore
} from '../../../../stores/readingRoom.ts'
import { createCrudGridActionsColumn } from '../../../components/CrudGridActions.tsx'
import { DataGridPage } from '../../../components/DataGridPage.tsx'
import { GridFeedback } from '../../../components/GridFeedback.tsx'


interface GridProps {
    columns: GridColDef[]
}

export const ReadingRoomGrid = (props: GridProps) => {
    const rowStore = useReadingRoomItemStore()
    const rowModesModelStore = useReadingRoomItemGridModelStore()
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
        const response = await deleteReadingRoom(rowToDelete.seq)
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
    const updateRowProcess = async (newRow: GridReadingRoomItem) => {
        if (newRow.name === '' || newRow.seq === 0 || newRow.seq == null || newRow.campus === '' || newRow.total === 0 || newRow.total < newRow.active) {
            setErrorSnackbarContent('올바른 데이터가 아닙니다.')
            rowStore.setRows(rowStore.rows.filter((row) => row.id !== newRow.id))
            if (newRow.isNew) {
                return { ...newRow, _action: 'delete' }
            } else {
                return newRow
            }
        }
        if (newRow.isNew) {
            try {
                await createReadingRoom({
                    id: newRow.seq,
                    name: newRow.name,
                    campusID: parseInt(newRow.campus.split('(')[1]?.split(')')[0] ?? '0', 10),
                    total: newRow.total,
                })
                setSuccessSnackbarContent('데이터 저장에 성공했습니다.')
            } catch {
                setErrorSnackbarContent('데이터 저장에 실패했습니다.')
                rowStore.setRows(rowStore.rows.filter((row) => row.id !== newRow.id))
                return { ...newRow, _action: 'delete' }
            }
        } else {
            try {
                await updateReadingRoom(newRow.seq, {
                    name: newRow.name,
                    campusID: parseInt(newRow.campus.split('(')[1]?.split(')')[0] ?? '0', 10),
                    total: newRow.total,
                    active: newRow.active,
                    isActive: newRow.isActive,
                    isReservable: newRow.isReservable,
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
        <DataGridPage>
            <GridFeedback
                error={errorSnackbarContent}
                success={successSnackbarContent}
                onErrorClose={() => setErrorSnackbarContent('')}
                onSuccessClose={() => setSuccessSnackbarContent('')}
            />
            <div style={{ minHeight: '100%', width: '100%' }}>
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
                    isCellEditable={(params) => {
                        const newRowFields = ['seq', 'name', 'campus', 'total']
                        const existingRowFields = ['name', 'campus', 'total', 'active', 'occupied', 'isActive', 'isReservable']

                        const allowedFields = params.row.isNew ? newRowFields : existingRowFields
                        return allowedFields.includes(params.colDef.field)
                    }}
                    pageSizeOptions={[10]}
                    hideFooterPagination={false}
                    initialState={{
                        pagination: { paginationModel: { pageSize: 10 } },
                        sorting: {
                            sortModel: [
                                { field: 'seq', sort: 'asc' },
                            ]
                        },
                    }}
                />
            </div>
        </DataGridPage>
    )
}
