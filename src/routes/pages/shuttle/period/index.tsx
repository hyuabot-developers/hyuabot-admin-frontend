import dayjs from "dayjs"
import { useEffect } from "react"
import { v4 as uuidv4 } from "uuid"
import { GridColDef, GridRowModes, GridRowModesModel } from "@mui/x-data-grid"
import { ShuttlePeriodGrid } from "./grid.tsx"
import { ShuttlePeriod, useShuttlePeriodGridModelStore, useShuttlePeriodStore } from "../../../../stores/shuttle.ts"
import { getShuttlePeriod, ShuttlePeriodResponse } from "../../../../service/network/shuttle.ts"

export default function Period() {
    // Get the store
    const rowStore = useShuttlePeriodStore()
    const rowModesModelStore = useShuttlePeriodGridModelStore()
    // Fetch shuttle period
    const fetchShuttlePeriod = async () => {
        const response = await getShuttlePeriod()
        if (response.status === 200) {
            const responseData = response.data
            const rows = responseData.result.map((period: ShuttlePeriodResponse) => {
                return {
                    id: uuidv4(),
                    seq: period.seq,
                    type: period.type,
                    start: dayjs(period.start),
                    end: dayjs(period.end),
                }
            })
            rowStore.setRows(rows as ShuttlePeriod[])
            rowModesModelStore.setRowModesModel(
                rows.reduce((acc: GridRowModesModel, row: ShuttlePeriod) => {
                    acc[row.id] = { mode: GridRowModes.View }
                    return acc
                }, {} as Record<string, { mode: GridRowModes }>)
            )
        }
    }
    useEffect(() => { fetchShuttlePeriod().then() }, [])
    // Configure DataGrid
    const startDateValueFormatter = (value: Date) => {
        return dayjs(value).format("YYYY-MM-DD HH:mm:ss")
    }
    const endDateValueFormatter = (value: Date) => {
        return dayjs(value).format("YYYY-MM-DD HH:mm:ss")
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
            minWidth: 250,
            flex: 1,
            valueFormatter: startDateValueFormatter,
            type: 'dateTime',
            editable: true,
            headerAlign: 'center',
            align: 'center',
        },
        {
            field: 'end',
            headerName: '종료 날짜',
            minWidth: 250,
            flex: 1,
            valueFormatter: endDateValueFormatter,
            type: 'dateTime',
            editable: true,
            headerAlign: 'center',
            align: 'center',
        },
    ]

    return (
        <ShuttlePeriodGrid columns={columns} />
    )
}