import dayjs from "dayjs"
import { useEffect } from "react"
import { v4 as uuidv4 } from "uuid"
import { GridColDef } from "@mui/x-data-grid"
import { ShuttleHolidayGrid } from "./grid.tsx"
import { useShuttleHolidayStore } from "../../../../stores/shuttle.ts"
import { getShuttleHoliday, ShuttleHolidayResponse } from "../../../../service/network/shuttle.ts"

export default function Holiday() {
    // Get the store
    const shuttleHolidayStore = useShuttleHolidayStore()
    // Fetch shuttle period
    const fetchShuttleHoliday = async () => {
        const response = await getShuttleHoliday()
        if (response.status === 200) {
            const responseData = response.data
            shuttleHolidayStore.setRows(responseData.data.map((period: ShuttleHolidayResponse) => {
                return {
                    id: uuidv4(),
                    type: period.type,
                    calendar: period.calendar,
                    date: period.date,
                }
            }))
        }
    }
    useEffect(() => { fetchShuttleHoliday().then() }, [])
    // Configure DataGrid
    const dateValueFormatter = (value: string) => {
        return dayjs(value).format('YYYY-MM-DD')
    }
    const holidayTypeValueFormatter = (value: string) => {
        switch (value) {
        case "weekends": return "주말/공휴일"
        case "halt": return "운행 중지"
        default: return "기타"
        }
    }
    const calendarTypeValueFormatter = (value: string) => {
        switch (value) {
        case "solar": return "양력"
        case "lunar": return "음력"
        default: return "기타"
        }
    }
    const columns: GridColDef[] = [
        {
            field: 'date',
            headerName: '날짜',
            width: 250,
            valueFormatter: dateValueFormatter,
            type: 'date',
            editable: true,
            headerAlign: 'center',
            align: 'center',
        },
        {
            field: 'calendar',
            headerName: '음력/양력',
            width: 200,
            valueFormatter: calendarTypeValueFormatter,
            type: 'singleSelect',
            valueOptions: ['solar', 'lunar'],
            editable: true,
            headerAlign: 'center',
            align: 'center',
        },
        {
            field: 'type',
            headerName: '시간표 종류',
            width: 200,
            valueFormatter: holidayTypeValueFormatter,
            type: 'singleSelect',
            valueOptions: ['weekends', 'halt'],
            editable: true,
            headerAlign: 'center',
            align: 'center',
        },
    ]

    return (
        <ShuttleHolidayGrid columns={columns} />
    )
}