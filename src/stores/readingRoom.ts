import { create } from 'zustand'
import { GridModelStore } from './index.ts'
import { GridRowModesModel } from '@mui/x-data-grid'

type ReadingRoomTabStore = {
    route: string,
    setRoute: (route: string) => void,
}

export type GridReadingRoomItem = {
    id: string
    readingRoomID: number,
    name: string,
    total: number,
    active: number,
    available: number,
    occupied: number,
    updatedAt: string,
}


type ReadingRoomItemStore = {
    rows: Array<GridReadingRoomItem>,
    setRows: (cafeteriaList: Array<GridReadingRoomItem>) => void,
}


export const useReadingRoomTabStore = create<ReadingRoomTabStore>((set) => ({
    route: 'room',
    setRoute: (route) => set({ route }),
}))

export const useReadingRoomItemGridModelStore = create<GridModelStore>((set) => ({
    rowModesModel: {},
    setRowModesModel: (rowModesModel: GridRowModesModel) => set({ rowModesModel }),
}))

export const useReadingRoomItemStore = create<ReadingRoomItemStore>((set) => ({
    rows: [],
    setRows: (readingRoomList) => set({ rows: readingRoomList }),
}))
