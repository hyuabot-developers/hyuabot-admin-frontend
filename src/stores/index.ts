import { GridRowModesModel } from "@mui/x-data-grid"

export type GridModelStore = {
    rowModesModel: GridRowModesModel
    setRowModesModel: (rowModesModel: GridRowModesModel) => void
}
