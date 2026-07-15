import CancelIcon from '@mui/icons-material/Close'
import DeleteIcon from '@mui/icons-material/DeleteOutlined'
import EditIcon from '@mui/icons-material/Edit'
import SaveIcon from '@mui/icons-material/Save'
import {
    GridActionsCellItem,
    GridColDef,
    GridRowId,
    GridRowModes,
    GridRowModesModel,
} from '@mui/x-data-grid'

type CrudGridActionsOptions = {
    rowModesModel: GridRowModesModel,
    onEdit: (id: GridRowId) => void,
    onSave: (id: GridRowId) => void,
    onCancel: (id: GridRowId) => void,
    onDelete: (id: GridRowId) => void,
}

export const createCrudGridActionsColumn = ({
    rowModesModel,
    onEdit,
    onSave,
    onCancel,
    onDelete,
}: CrudGridActionsOptions): GridColDef => ({
    field: 'actions',
    headerName: '동작',
    type: 'actions',
    width: 100,
    cellClassName: 'actions',
    getActions: ({ id }) => {
        const isEditing = rowModesModel[id]?.mode === GridRowModes.Edit
        if (isEditing) {
            return [
                <GridActionsCellItem
                    label='저장'
                    key='save'
                    icon={<SaveIcon />}
                    onClick={() => onSave(id)}
                />,
                <GridActionsCellItem
                    label='취소'
                    key='cancel'
                    icon={<CancelIcon />}
                    onClick={() => onCancel(id)}
                />,
            ]
        }
        return [
            <GridActionsCellItem
                label='수정'
                key='edit'
                icon={<EditIcon />}
                onClick={() => onEdit(id)}
            />,
            <GridActionsCellItem
                label='삭제'
                key='delete'
                icon={<DeleteIcon />}
                onClick={() => onDelete(id)}
            />,
        ]
    },
})
