import { GridRowModesModel } from '@mui/x-data-grid'
import { create } from 'zustand'

import { GridModelStore } from './index.ts'
import { NoticeCategoryResponse } from '../service/network/notice.ts'

type NoticeTabStore = {
    route: string,
    setRoute: (route: string) => void,
}

export type GridNoticeCategoryItem = {
    id: string
    seq: number | null
    name: string
    isNew: boolean
}

export type GridNoticeItem = {
    id: string
    seq: number | null
    category: string
    title: string
    url: string
    expiredAt: string | Date
    userID: string
    language: string
    isNew: boolean
}


type NoticeCategoryStore = {
    rows: Array<GridNoticeCategoryItem>,
    setRows: (categoryList: Array<GridNoticeCategoryItem>) => void,
}

type NoticeStore = {
    rows: Array<GridNoticeItem>,
    categories: Array<NoticeCategoryResponse>,
    setRows: (menuList: Array<GridNoticeItem>) => void,
    setCategories: (categories: Array<NoticeCategoryResponse>) => void,
}

export const useNoticeTabStore = create<NoticeTabStore>((set) => ({
    route: 'category',
    setRoute: (route) => set({ route }),
}))

export const useNoticeCategoryGridModelStore = create<GridModelStore>((set) => ({
    rowModesModel: {},
    setRowModesModel: (rowModesModel: GridRowModesModel) => set({ rowModesModel }),
}))

export const useNoticeCategoryStore = create<NoticeCategoryStore>((set) => ({
    rows: [],
    setRows: (categoryList) => set({ rows: categoryList }),
}))

export const useNoticeGridModelStore = create<GridModelStore>((set) => ({
    rowModesModel: {},
    setRowModesModel: (rowModesModel: GridRowModesModel) => set({ rowModesModel }),
}))

export const useNoticeStore = create<NoticeStore>((set) => ({
    rows: [],
    categories: [],
    setRows: (events) => set({ rows: events }),
    setCategories: (categories) => set({ categories }),
}))
