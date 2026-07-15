import { GridRowModesModel } from '@mui/x-data-grid'
import { create } from 'zustand'
import { devtools } from 'zustand/middleware'

import { GridModelStore } from './index.ts'

export type PublicHoliday = {
    id: string,
    seq: number | null,
    name: string | null,
    calendarType: string | null,
    date: Date | null,
    isNew: boolean,
}

type PublicHolidayStore = {
    rows: Array<PublicHoliday>,
    setRows: (rows: Array<PublicHoliday>) => void,
}

export const usePublicHolidayStore = create(
    devtools<PublicHolidayStore>(
        (set) => ({
            rows: [],
            setRows: (rows: Array<PublicHoliday>) => {
                rows.sort((a, b) => (a.date?.valueOf() ?? Infinity) - (b.date?.valueOf() ?? Infinity))
                set({ rows })
            },
        }),
        { name: 'PublicHolidayStore' }
    )
)

export const usePublicHolidayGridModelStore = create(
    devtools<GridModelStore>(
        (set) => ({
            rowModesModel: {},
            setRowModesModel: (rowModesModel: GridRowModesModel) => set({ rowModesModel }),
        }),
        { name: 'PublicHolidayGridModelStore' }
    )
)
