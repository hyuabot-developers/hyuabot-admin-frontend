import { create } from "zustand"
import { GridModelStore } from "./index.ts"
import { GridRowModesModel } from "@mui/x-data-grid"

type ContactTabStore = {
    route: string,
    setRoute: (route: string) => void,
}

export type GridContactCategoryItem = {
    id: string
    categoryID: number
    name: string
    isNew: boolean
}

export type GridContactItem = {
    id: string
    contactID: number
    name: string
    phone: string
    category: string
    campus: string
}


type ContactCategoryStore = {
    rows: Array<GridContactCategoryItem>,
    setRows: (categoryList: Array<GridContactCategoryItem>) => void,
}

type ContactStore = {
    rows: Array<GridContactItem>,
    setRows: (menuList: Array<GridContactItem>) => void,
}

export const useContactTabStore = create<ContactTabStore>((set) => ({
    route: "category",
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
    setRows: (contactList) => set({ rows: contactList }),
}))
