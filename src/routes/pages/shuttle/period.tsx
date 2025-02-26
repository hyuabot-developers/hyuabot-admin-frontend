import dayjs from "dayjs"
import { useEffect } from "react"
import { v4 as uuidv4 } from "uuid"
import { GridColDef } from "@mui/x-data-grid"
import { useShuttlePeriodStore } from "../../../stores/shuttle.ts"
import { getShuttlePeriod, ShuttlePeriodResponse } from "../../../service/network/shuttle.ts"
import { Grid } from "../../../components/grid/Grid.tsx"

export default function Period() {
    // Get the store
    const shuttlePeriodStore = useShuttlePeriodStore()
    // Fetch shuttle period
    const fetchShuttlePeriod = async () => {
        const response = await getShuttlePeriod()
        if (response.status === 200) {
            const responseData = response.data
            shuttlePeriodStore.setPeriods(responseData.data.map((period: ShuttlePeriodResponse) => {
                return {
                    id: uuidv4(),
                    type: period.type,
                    start: period.start,
                    end: period.end,
                }
            }))
        }
    }
    useEffect(() => { fetchShuttlePeriod().then() }, [])
    // Configure DataGrid
    const startDateValueFormatter = (value: string) => {
        return dayjs(value).set('hour', 0).set('minute', 0).set('second', 0).set('millisecond', 0).format('YYYY-MM-DD HH:mm:ss Z')
    }
    const endDateValueFormatter = (value: string) => {
        return dayjs(value).set('hour', 23).set('minute', 59).set('second', 59).set('millisecond', 0).format('YYYY-MM-DD HH:mm:ss Z')
    }
    const periodTypeValueFormatter = (value: string) => {
        switch (value) {
        case "semester": return "학기"
        case "vacation": return "방학"
        case "vacation_session": return "계절학기"
        default: return "기타"
        }
    }
    const columns: GridColDef[] = [
        {
            field: 'type',
            headerName: '운행 종류',
            width: 200,
            valueFormatter: periodTypeValueFormatter,
            type: 'singleSelect',
            valueOptions: ['semester', 'vacation', 'vacation_session'],
            editable: true,
            headerAlign: 'center',
            align: 'center',
        },
        {
            field: 'start',
            headerName: '시작 날짜',
            width: 250,
            valueFormatter: startDateValueFormatter,
            type: 'date',
            editable: true,
            headerAlign: 'center',
            align: 'center',
        },
        {
            field: 'end',
            headerName: '종료 날짜',
            width: 250,
            valueFormatter: endDateValueFormatter,
            type: 'date',
            editable: true,
            headerAlign: 'center',
            align: 'center',
        },
    ]

    return (
        <Grid columns={columns} />
    )
}