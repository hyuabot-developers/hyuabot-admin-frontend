import { GridRowModesModel } from '@mui/x-data-grid'
import { create } from 'zustand'
import { devtools } from 'zustand/middleware'

import { GridModelStore } from './index.ts'
import { CampusResponse } from '../service/network/campus.ts'

type ReadingRoomTabStore = {
    route: string,
    setRoute: (route: string) => void,
}

export type GridReadingRoomItem = {
    id: string
    seq: number,
    name: string,
    campus: string,
    isActive: boolean,
    isReservable: boolean,
    total: number,
    active: number,
    available: number,
    occupied: number,
    updatedAt: string,
}


type ReadingRoomItemStore = {
    rows: Array<GridReadingRoomItem>,
    campuses: Array<CampusResponse>,
    setRows: (cafeteriaList: Array<GridReadingRoomItem>) => void,
    setCampuses: (campuses: Array<CampusResponse>) => void,
}


export const useReadingRoomTabStore = create(
    devtools<ReadingRoomTabStore>((set) => ({
        route: 'room',
        setRoute: (route: string) => set({ route }),
    }),
    { name: 'ReadingRoomTabStore' })
)

export const useReadingRoomItemGridModelStore = create(
    devtools<GridModelStore>((set) => ({
        rowModesModel: {} as GridRowModesModel,
        setRowModesModel: (model: GridRowModesModel) => set({ rowModesModel: model }),
    }),
    { name: 'ReadingRoomItemGridModelStore' })
)

export const useReadingRoomItemStore = create(
    devtools<ReadingRoomItemStore>((set) => ({
        rows: [],
        campuses: [],
        setRows: (readingRoomList: Array<GridReadingRoomItem>) => set({ rows: readingRoomList }),
        setCampuses: (campuses: Array<CampusResponse>) => set({ campuses }),
    }),
    { name: 'ReadingRoomItemStore' })
)