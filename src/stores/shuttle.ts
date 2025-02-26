import { create } from "zustand/index"
import { GridRowModesModel } from "@mui/x-data-grid"

type ShuttleTabStore = {
    route: string,
    setRoute: (route: string) => void,
}

export type ShuttlePeriod = {
    id: string,
    type: string,
    start: string,
    end: string,
    isNew: boolean,
}

type ShuttlePeriodStore = {
    rows: Array<ShuttlePeriod>,
    setRows: (periods: Array<ShuttlePeriod>) => void,
}

type ShuttlePeriodGridModelStore = {
    rowModesModel: GridRowModesModel
    setRowModesModel: (rowModesModel: GridRowModesModel) => void
}

export const useShuttleTabStore = create<ShuttleTabStore>((set) => ({
    route: "period",
    setRoute: (route: string) => set({ route }),
}))

export const useShuttlePeriodStore = create<ShuttlePeriodStore>((set) => ({
    rows: [],
    setRows: (rows: Array<ShuttlePeriod>) => {
        rows.sort(function (a: ShuttlePeriod, b: ShuttlePeriod) {
            return a.start < b.start ? -1 : a.start > b.start ? 1 : 0
        })
        set({ rows })
    },
}))

export const useShuttlePeriodGridModelStore = create<ShuttlePeriodGridModelStore>((set) => ({
    rowModesModel: {},
    setRowModesModel: (rowModesModel: GridRowModesModel) => set({ rowModesModel }),
}))