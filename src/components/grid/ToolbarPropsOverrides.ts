import { GridRowModesModel } from "@mui/x-data-grid"
import { ShuttlePeriod } from "../../stores/shuttle.ts"

declare module '@mui/x-data-grid' {
    interface ToolbarPropsOverrides {
        setRows: (newRows: (oldRows: ShuttlePeriod[]) => ShuttlePeriod[]) => void
        setRowModesModel: (newRowModesModel: (oldRowModesModel: GridRowModesModel) => GridRowModesModel) => void
    }
}