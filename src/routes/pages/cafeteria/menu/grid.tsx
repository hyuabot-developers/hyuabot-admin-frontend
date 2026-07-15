import {
    DataGrid,
    GridColDef,
    GridEventListener, GridRowId, GridRowModes,
    GridRowModesModel
} from '@mui/x-data-grid'
import { useState } from 'react'

import { GridToolbar } from './toolbar.tsx'
import { createCafeteriaMenu, deleteCafeteriaMenu, updateCafeteriaMenu } from '../../../../service/network/cafeteria.ts'
import {
    GridCafeteriaMenu,
    useCafeteriaMenuGridModelStore,
    useCafeteriaMenuStore
} from '../../../../stores/cafeteria.ts'
import { createCrudGridActionsColumn } from '../../../components/CrudGridActions.tsx'
import { DataGridPage } from '../../../components/DataGridPage.tsx'
import { GridFeedback } from '../../../components/GridFeedback.tsx'


interface GridProps {
    columns: GridColDef[]
}

export const CafeteriaMenuGrid = (props: GridProps) => {
    const rowStore = useCafeteriaMenuStore()
    const rowModesModelStore = useCafeteriaMenuGridModelStore()
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
        const { selectedCafeteriaID } = useCafeteriaMenuStore.getState()
        const response = await deleteCafeteriaMenu(selectedCafeteriaID!, rowToDelete.seq)
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
    const updateRowProcess = async (newRow: GridCafeteriaMenu) => {
        if (newRow.food === '' || newRow.cafeteria === '' || newRow.date === '' || newRow.type === '' || newRow.price === '') {
            setErrorSnackbarContent('올바른 데이터가 아닙니다.')
            rowStore.setRows(rowStore.rows.filter((row) => row.id !== newRow.id))
            return { ...newRow, _action: 'delete' }
        }
        const { selectedCafeteriaID } = useCafeteriaMenuStore.getState()
        if (newRow.isNew) {
            try {
                await createCafeteriaMenu(
                    selectedCafeteriaID!,
                    {
                        date: newRow.date,
                        type: newRow.type,
                        food: newRow.food,
                        price: newRow.price,
                    }
                )
                setSuccessSnackbarContent('데이터 저장에 성공했습니다.')
            } catch {
                setErrorSnackbarContent('데이터 저장에 실패했습니다.')
                rowStore.setRows(rowStore.rows.filter((row) => row.id !== newRow.id))
                return { ...newRow, _action: 'delete' }
            }
        } else if (newRow.seq != null) {
            try {
                await updateCafeteriaMenu(
                    selectedCafeteriaID!,
                    newRow.seq!,
                    {
                        date: newRow.date,
                        type: newRow.type,
                        food: newRow.food,
                        price: newRow.price,
                    }
                )
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
    // Button click event
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
            <div style={{ width: '100%', height: '100%' }}>
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
                    isCellEditable={(params) => params.colDef.field !== 'actions' && (params.colDef.field !== 'seq' || params.row.isNew)}
                    pageSizeOptions={[10]}
                    hideFooterPagination={false}
                    initialState={{
                        pagination: { paginationModel: { pageSize: 10 } },
                        sorting: {
                            sortModel: [
                                { field: 'date', sort: 'desc' },
                            ]
                        },
                    }}
                />
            </div>
        </DataGridPage>
    )
}
