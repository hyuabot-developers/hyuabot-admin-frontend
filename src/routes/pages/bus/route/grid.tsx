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
import { createBusRoute, deleteBusRoute, updateBusRoute } from '../../../../service/network/bus.ts'
import { BusRoute, useBusRouteGridModelStore, useBusRouteStore } from '../../../../stores/bus.ts'
import { createCrudGridActionsColumn } from '../../../components/CrudGridActions.tsx'
import { DataGridPage } from '../../../components/DataGridPage.tsx'
import { GridFeedback } from '../../../components/GridFeedback.tsx'


interface GridProps {
    columns: GridColDef[]
}

export const BusRouteGrid = (props: GridProps) => {
    const rowStore = useBusRouteStore()
    const rowModesModelStore = useBusRouteGridModelStore()
    const [errorSnackbarContent, setErrorSnackbarContent] = useState<string>('')
    const [successSnackbarContent, setSuccessSnackbarContent] = useState<string>('')

    const rowEditStopped: GridEventListener<'rowEditStop'> = (params, event) => {
        if (event.defaultMuiPrevented) {
            return
        }
        const editedRow = rowStore.rows.find((row) => row.id === params.id)
        return editedRow
    }
    const routeTypeCode = (routeType: string) => {
        switch (routeType) {
        case '직행좌석형시내버스': return 11
        case '일반형시내버스': return 13
        }
        return 0
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
        const response = await deleteBusRoute(rowToDelete.routeID)
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
    const updateRowProcess = async (newRow: BusRoute) => {
        if (
            newRow.name === '' || newRow.routeID <= 0 || newRow.type === '' ||
            newRow.companyID <= 0 || newRow.companyName === '' || newRow.companyTelephone === '' ||
            newRow.upFirstTime === '' || newRow.upLastTime === '' || newRow.downFirstTime === '' || newRow.downLastTime === ''
        ) {
            setErrorSnackbarContent('올바른 데이터가 아닙니다.')
            rowStore.setRows(rowStore.rows.filter((row) => row.id !== newRow.id))
            return { ...newRow, _action: 'delete' }
        }
        if (newRow.isNew) {
            const response = await createBusRoute({
                id: newRow.routeID,
                name: newRow.name,
                typeCode: routeTypeCode(newRow.type).toString(),
                typeName: newRow.type,
                startStopID: parseInt(newRow.startStop.split('(')[1]?.split(')')[0] ?? '0', 10),
                endStopID: parseInt(newRow.endStop.split('(')[1]?.split(')')[0] ?? '0', 10),
                upFirstTime: newRow.upFirstTime,
                upLastTime: newRow.upLastTime,
                downFirstTime: newRow.downFirstTime,
                downLastTime: newRow.downLastTime,
                companyID: newRow.companyID,
                companyName: newRow.companyName,
                companyPhone: newRow.companyTelephone,
                districtCode: 2,
            })
            if (response.status !== 201) {
                setErrorSnackbarContent('데이터 저장에 실패했습니다.')
                rowStore.setRows(rowStore.rows.filter((row) => row.id !== newRow.id))
                return { ...newRow, _action: 'delete' }
            }
            setSuccessSnackbarContent('데이터 저장에 성공했습니다.')
        } else {
            const response = await updateBusRoute(newRow.routeID, {
                name: newRow.name,
                typeCode: routeTypeCode(newRow.type).toString(),
                typeName: newRow.type,
                startStopID: parseInt(newRow.startStop.split('(')[1]?.split(')')[0] ?? '0', 10),
                endStopID: parseInt(newRow.endStop.split('(')[1]?.split(')')[0] ?? '0', 10),
                upFirstTime: newRow.upFirstTime,
                upLastTime: newRow.upLastTime,
                downFirstTime: newRow.downFirstTime,
                downLastTime: newRow.downLastTime,
                companyID: newRow.companyID,
                companyName: newRow.companyName,
                companyPhone: newRow.companyTelephone,
                districtCode: 2,
            })
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
                isCellEditable={(params) => params.colDef.field !== 'actions' && (params.colDef.field !== 'routeID' || params.row.isNew)}
            />
        </DataGridPage>
    )
}
