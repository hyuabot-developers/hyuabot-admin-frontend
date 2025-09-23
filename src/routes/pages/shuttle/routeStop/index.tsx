import { useEffect } from "react"
import { v4 as uuidv4 } from "uuid"
import { GridColDef } from "@mui/x-data-grid"
import { ShuttleRouteStopGrid } from "./grid.tsx"
import { useShuttleStopStore } from "../../../../stores/shuttle.ts"
import { getShuttleStop, ShuttleStopResponse } from "../../../../service/network/shuttle.ts"

export default function ShuttleRouteStop() {
    // Get the store
    const shuttleStopStore = useShuttleStopStore()
    const fetchShuttleStop = async () => {
        const response = await getShuttleStop()
        if (response.status === 200) {
            const responseData = response.data
            shuttleStopStore.setRows(responseData.result.map((item: ShuttleStopResponse) => {
                return {
                    id: uuidv4(),
                    name: item.name,
                    latitude: item.latitude,
                    longitude: item.longitude,
                }
            }))
        }
    }
    useEffect(() => {
        fetchShuttleStop().then()
    }, [])
    // Configure DataGrid
    const columns: GridColDef[] = [
        {
            field: 'stop',
            headerName: '정류장 ID',
            minWidth: 150,
            flex: 1,
            type: 'singleSelect',
            valueOptions: shuttleStopStore.rows.map(stop => stop.name),
            editable: true,
            headerAlign: 'center',
            align: 'center',
        },
        {
            field: 'order',
            headerName: '정차 순서',
            minWidth: 250,
            flex: 1,
            type: 'number',
            editable: true,
            headerAlign: 'center',
            align: 'center',
        },
        {
            field: 'cumulativeTime',
            headerName: '누적 시간 (분)',
            minWidth: 250,
            flex: 1,
            type: 'string',
            editable: true,
            headerAlign: 'center',
            align: 'center',
        },
    ]

    return (
        <ShuttleRouteStopGrid columns={columns} />
    )
}