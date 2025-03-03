import { create } from "zustand/index"

type BusTabStore = {
    route: string,
    setRoute: (route: string) => void,
}

export const useBusTabStore = create<BusTabStore>((set) => ({
    route: "route",
    setRoute: (route: string) => set({ route }),
}))
