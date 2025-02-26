import { useState } from "react"
import { Box } from "@mui/material"
import {
    DataGrid,
    GridActionsCellItem,
    GridColDef,
    GridEventListener,
    GridRowId,
    GridRowModes,
    GridRowModesModel
} from "@mui/x-data-grid"
import EditIcon from "@mui/icons-material/Edit"
import DeleteIcon from "@mui/icons-material/DeleteOutlined"
import SaveIcon from "@mui/icons-material/Save"
import CancelIcon from "@mui/icons-material/Close"

import { Toolbar } from "./Toolbar.tsx"
import { ShuttlePeriod } from "../../stores/shuttle.ts"

interface GridProps {
    columns: GridColDef[]
}

export function Grid(props: GridProps) {
    const [rows, setRows] = useState<ShuttlePeriod[]>([])
    const [rowModesModel, setRowModesModel] = useState<GridRowModesModel>({})
    const rowEditStopped: GridEventListener<"rowEditStop"> = (params, event) => {
        if (event.defaultMuiPrevented) {
            return
        }
        const editedRow = rows.find(row => row.id === params.id)
        if (editedRow!.isNew) {
            setRows(rows.map(row => {
                if (row.id === params.id) {
                    return {...row, isNew: false}
                }
                return row
            }))
        }
    }
    // Button click event
    const editRowButtonClicked = (id: GridRowId) => {
        setRowModesModel({...rowModesModel, [id]: {mode: GridRowModes.Edit}})
    }
    const saveRowButtonClicked = (id: GridRowId) => {
        setRowModesModel({...rowModesModel, [id]: {mode: GridRowModes.View}})
    }
    const deleteRowButtonClicked = (id: GridRowId) => {
        setRows(rows.filter(row => row.id !== id))
    }
    const cancelRowButtonClicked = (id: GridRowId) => {
        setRowModesModel({...rowModesModel, [id]: {mode: GridRowModes.View, ignoreModifications: true}})
        const editedRow = rows.find(row => row.id === id)
        if (editedRow!.isNew) {
            setRows(rows.filter(row => row.id !== id))
        }
    }
    const updateRowProcess = (newRow: ShuttlePeriod) => {
        const updatedRow = {...newRow, isNew: false}
        setRows(rows.map(row => row.id === newRow.id ? updatedRow : row))
        return updatedRow
    }
    const rowModesModelChanged = (newRowModesModel: GridRowModesModel) => {
        setRowModesModel(newRowModesModel)
    }
    // Add action column
    props.columns.push({
        field: "actions",
        headerName: "동작",
        type: "actions",
        width: 100,
        cellClassName: "actions",
        getActions: ({ id }) => {
            const isEditing = rowModesModel[id]?.mode === GridRowModes.Edit
            if (isEditing) {
                return [
                    <GridActionsCellItem label="save" key="save" icon={<SaveIcon />} onClick={() => saveRowButtonClicked(id)} />,
                    <GridActionsCellItem label="cancel" key="cancel" icon={<CancelIcon />} onClick={() => cancelRowButtonClicked(id)} />,
                ]
            }
            return [
                <GridActionsCellItem label="edit" key="edit" icon={<EditIcon />} onClick={() => editRowButtonClicked(id)} />,
                <GridActionsCellItem label="delete" key="delete" icon={<DeleteIcon />} onClick={() => deleteRowButtonClicked(id)} />,
            ]
        }
    })
    // Render
    return (
        <Box sx={{height: "100vh", width: "100%"}}>
            <DataGrid
                columns={props.columns}
                rows={rows}
                rowModesModel={rowModesModel}
                editMode="row"
                onRowModesModelChange={rowModesModelChanged}
                onRowEditStop={rowEditStopped}
                processRowUpdate={updateRowProcess}
                slots={{toolbar: Toolbar}}
                slotProps={{toolbar: {setRows, setRowModesModel}}}
            />
        </Box>
    )
}