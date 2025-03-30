import { create } from "zustand"
import { CampusResponse } from "../service/network/campus.ts"

type CampusStore = {
    rows: Array<CampusResponse>,
    setRows: (rows: Array<CampusResponse>) => void,
}

export const useCampusStore = create<CampusStore>((set) => ({
    rows: [],
    setRows: (cafeteriaList) => set({ rows: cafeteriaList }),
}))
