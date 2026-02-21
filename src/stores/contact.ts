import { GridRowModesModel } from '@mui/x-data-grid'
import { create } from 'zustand'

import { GridModelStore } from './index.ts'
import { ContactCategoryResponse } from '../service/network/contact.ts'

type ContactTabStore = {
    route: string,
    setRoute: (route: string) => void,
}

export type GridContactCategoryItem = {
    id: string
    seq: number | null
    name: string
    isNew: boolean
}

export type GridContactItem = {
    id: string
    seq: number | null
    name: string
    phone: string
    category: string
    isNew: boolean
}


type ContactCategoryStore = {
    rows: Array<GridContactCategoryItem>,
    setRows: (categoryList: Array<GridContactCategoryItem>) => void,
}

type ContactStore = {
    rows: Array<GridContactItem>,
    categories: Array<ContactCategoryResponse>,
    setRows: (menuList: Array<GridContactItem>) => void,
    setCategories: (categories: Array<ContactCategoryResponse>) => void,
}

export const useContactTabStore = create<ContactTabStore>((set) => ({
    route: 'category',
    setRoute: (route) => set({ route }),
}))

export const useContactCategoryGridModelStore = create<GridModelStore>((set) => ({
    rowModesModel: {},
    setRowModesModel: (rowModesModel: GridRowModesModel) => set({ rowModesModel }),
}))

export const useContactCategoryStore = create<ContactCategoryStore>((set) => ({
    rows: [],
    setRows: (categoryList) => set({ rows: categoryList }),
}))

export const useContactGridModelStore = create<GridModelStore>((set) => ({
    rowModesModel: {},
    setRowModesModel: (rowModesModel: GridRowModesModel) => set({ rowModesModel }),
}))

export const useContactStore = create<ContactStore>((set) => ({
    rows: [],
    categories: [],
    setRows: (contactList) => set({ rows: contactList }),
    setCategories: (categories) => set({ categories }),
}))
