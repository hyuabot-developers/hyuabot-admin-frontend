import { Alert, Box, Snackbar } from '@mui/material'
import {
    DataGrid,
    GridColDef,
    GridEventListener, GridRowId, GridRowModes,
    GridRowModesModel
} from '@mui/x-data-grid'
import { useState } from 'react'

import { GridToolbar } from './toolbar.tsx'
import {
    createNoticeCategory,
    deleteNoticeCategory,
    updateNoticeCategory
} from '../../../../service/network/notice.ts'
import {
    GridNoticeCategoryItem,
    useNoticeCategoryGridModelStore,
    useNoticeCategoryStore
} from '../../../../stores/notice.ts'
import { createCrudGridActionsColumn } from '../../../components/CrudGridActions.tsx'

interface GridProps {
    columns: GridColDef[]
}

export const NoticeCategoryGrid = (props: GridProps) => {
    const rowStore = useNoticeCategoryStore()
    const rowModesModelStore = useNoticeCategoryGridModelStore()
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
    const rowModesModelChanged = (newRowModesModel: GridRowModesModel) => {
        rowModesModelStore.setRowModesModel(newRowModesModel)
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
        const response = await deleteNoticeCategory(rowToDelete.seq)
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
    const updateRowProcess = async (newRow: GridNoticeCategoryItem) => {
        if (newRow.name === '') {
            setErrorSnackbarContent('올바른 데이터가 아닙니다.')
            if (newRow.isNew) {
                rowStore.setRows(rowStore.rows.filter((row) => row.id !== newRow.id))
            }
            return { ...newRow, _action: 'delete' }
        }
        if (newRow.isNew) {
            const response = await createNoticeCategory(newRow.name)
            if (response.status !== 201) {
                setErrorSnackbarContent('데이터 저장에 실패했습니다.')
                rowStore.setRows(rowStore.rows.filter((row) => row.id !== newRow.id))
                return { ...newRow, _action: 'delete' }
            }
            setSuccessSnackbarContent('데이터 저장에 성공했습니다.')
        } else if (newRow.seq !== null) {
            const response = await updateNoticeCategory(
                newRow.seq,
                newRow.name,
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
            <div style={{ width: '100%' }}>
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
                    isCellEditable={(params) => params.colDef.field !== 'actions' && (params.row.isNew || params.colDef.field !== 'seq')}
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
