import { useEffect } from "react"
import { v4 as uuidv4 } from "uuid"
import { GridColDef } from "@mui/x-data-grid"
import { ShuttleTimetableGrid } from "./grid.tsx"
import { useShuttleTimetableStore } from "../../../../stores/shuttle.ts"
import {
    getShuttleTimetable,
    ShuttleTimetableResponse
} from "../../../../service/network/shuttle.ts"

export default function ShuttleTimetable() {
    // Get the store
    const shuttleTimetableStore = useShuttleTimetableStore()
    const fetchShuttleTimetable = async () => {
        const response = await getShuttleTimetable()
        if (response.status === 200) {
            const responseData = response.data
            shuttleTimetableStore.setRows(responseData.data.map((item: ShuttleTimetableResponse) => {
                return {
                    id: uuidv4(),
                    sequence: item.sequence,
                    period: item.period,
                    weekdays: item.weekdays,
                    route: item.route,
                    time: item.time,
                }
            }))
        }
    }
    useEffect(() => {
        fetchShuttleTimetable().then()
    }, [])
    // Configure DataGrid
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
            field: 'period',
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
            field: 'weekdays',
            headerName: '평일/주말',
            width: 150,
            type: 'boolean',
            editable: true,
            headerAlign: 'center',
            align: 'center',
        },
        {
            field: 'route',
            headerName: '노선 ID',
            width: 150,
            type: 'string',
            editable: true,
            headerAlign: 'center',
            align: 'center',
        },
        {
            field: 'time',
            headerName: '운행 시간',
            width: 150,
            type: 'string',
            editable: true,
            headerAlign: 'center',
            align: 'center',
        },
    ]

    return (
        <ShuttleTimetableGrid columns={columns} />
    )
}