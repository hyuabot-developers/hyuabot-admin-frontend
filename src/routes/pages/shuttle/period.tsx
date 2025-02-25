import { getShuttlePeriod, ShuttlePeriodResponse } from "../../../service/network/shuttle.ts"
import { useEffect } from "react"
import { useShuttlePeriodStore } from "../../../stores/shuttle.ts"
import { DataGrid, GridColDef } from "@mui/x-data-grid"
import dayjs from "dayjs"

export default function Period() {
    // Get the store
    const shuttlePeriodStore = useShuttlePeriodStore()
    // Fetch shuttle period
    const fetchShuttlePeriod = async () => {
        const response = await getShuttlePeriod()
        if (response.status === 200) {
            const responseData = response.data
            shuttlePeriodStore.setPeriods(responseData.data.map((period: ShuttlePeriodResponse, index: number) => {
                return {
                    id: index,
                    type: period.type,
                    start: period.start,
                    end: period.end,
                }
            }))
        }
    }
    useEffect(() => { fetchShuttlePeriod().then() }, [])
    // Configure DataGrid
    const dateValueFormatter = (value: string) => dayjs(value).format('YYYY-MM-DD HH:mm:ss Z')
    const periodTypeValueFormatter = (value: string) => {
        switch (value) {
        case "semester": return "학기"
        case "vacation": return "방학"
        case "vacation_session": return "계절학기"
        default: return "기타"
        }
    }
    const columns: GridColDef[] = [
        { field: 'type', headerName: '운행 종류', width: 200, valueFormatter: periodTypeValueFormatter },
        { field: 'start', headerName: '시작 날짜', width: 250, valueFormatter: dateValueFormatter },
        { field: 'end', headerName: '종료 날짜', width: 250, valueFormatter: dateValueFormatter },
    ]

    return (
        <div style={{ height: '100vh', width: '100%' }}>
            <DataGrid columns={columns} rows={shuttlePeriodStore.periods} />
        </div>
    )
}