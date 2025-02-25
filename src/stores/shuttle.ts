import { create } from "zustand/index"

type ShuttleTabStore = {
    route: string,
    setRoute: (route: string) => void,
}

export const useShuttleTabStore = create<ShuttleTabStore>((set) => ({
    route: "period",
    setRoute: (route: string) => set({ route }),
}))