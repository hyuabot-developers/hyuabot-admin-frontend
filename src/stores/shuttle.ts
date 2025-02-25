import { create } from "zustand/index"

type ShuttleTabStore = {
    route: string,
    setRoute: (route: string) => void,
}

type ShuttlePeriod = {
    id: number,
    type: string,
    start: string,
    end: string
}

type ShuttlePeriodStore = {
    periods: Array<ShuttlePeriod>,
    setPeriods: (periods: Array<ShuttlePeriod>) => void,
}

export const useShuttleTabStore = create<ShuttleTabStore>((set) => ({
    route: "period",
    setRoute: (route: string) => set({ route }),
}))

export const useShuttlePeriodStore = create<ShuttlePeriodStore>((set) => ({
    periods: [],
    setPeriods: (periods: Array<ShuttlePeriod>) => {
        periods.sort(function (a: ShuttlePeriod, b: ShuttlePeriod) {
            return a.start < b.start ? -1 : a.start > b.start ? 1 : 0
        })
        set({ periods })
    },
}))
