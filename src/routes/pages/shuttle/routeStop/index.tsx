import { useEffect } from "react"
import { v4 as uuidv4 } from "uuid"
import { GridColDef } from "@mui/x-data-grid"
import { ShuttleRouteStopGrid } from "./grid.tsx"
import { useShuttleRouteStopStore, useShuttleRouteStore, useShuttleStopStore } from "../../../../stores/shuttle.ts"
import {
    getShuttleRoute,
    getShuttleRouteStop, getShuttleStop,
    ShuttleRouteResponse,
    ShuttleRouteStopResponse, ShuttleStopResponse
} from "../../../../service/network/shuttle.ts"

export default function ShuttleRouteStop() {
    // Get the store
    const shuttleRouteStore = useShuttleRouteStore()
    const shuttleStopStore = useShuttleStopStore()
    const shuttleRouteStopStore = useShuttleRouteStopStore()
    // Fetch shuttle period
    const fetchShuttleRoute = async () => {
        const response = await getShuttleRoute()
        if (response.status === 200) {
            const responseData = response.data
            shuttleRouteStore.setRows(responseData.data.map((item: ShuttleRouteResponse) => {
                return {
                    id: uuidv4(),
                    name: item.name,
                    tag: item.tag,
                    korean: item.korean,
                    english: item.english,
                    start: item.start,
                    end: item.end,
                }
            }))
        }
    }
    const fetchShuttleStop = async () => {
        const response = await getShuttleStop()
        if (response.status === 200) {
            const responseData = response.data
            shuttleStopStore.setRows(responseData.data.map((item: ShuttleStopResponse) => {
                return {
                    id: uuidv4(),
                    name: item.name,
                    latitude: item.latitude,
                    longitude: item.longitude,
                }
            }))
        }
    }
    const fetchShuttleRouteStop = async () => {
        const response = await getShuttleRouteStop()
        if (response.status === 200) {
            const responseData = response.data
            shuttleRouteStopStore.setRows(responseData.data.map((item: ShuttleRouteStopResponse) => {
                return {
                    id: uuidv4(),
                    route: item.route,
                    stop: item.stop,
                    sequence: item.sequence,
                    cumulativeTime: item.cumulativeTime,
                }
            }))
        }
    }
    useEffect(() => {
        fetchShuttleRoute().then()
        fetchShuttleStop().then()
        fetchShuttleRouteStop().then()
    }, [])
    // Configure DataGrid
    const columns: GridColDef[] = [
        {
            field: 'route',
            headerName: '노선 ID',
            width: 150,
            type: 'singleSelect',
            valueOptions: shuttleRouteStore.rows.map(route => route.name),
            editable: true,
            headerAlign: 'center',
            align: 'center',
        },
        {
            field: 'stop',
            headerName: '정류장 ID',
            width: 150,
            type: 'singleSelect',
            valueOptions: shuttleStopStore.rows.map(stop => stop.name),
            editable: true,
            headerAlign: 'center',
            align: 'center',
        },
        {
            field: 'sequence',
            headerName: '정차 순서',
            width: 250,
            type: 'number',
            editable: true,
            headerAlign: 'center',
            align: 'center',
        },
        {
            field: 'cumulativeTime',
            headerName: '누적 시간 (분)',
            width: 250,
            type: 'number',
            editable: true,
            headerAlign: 'center',
            align: 'center',
            valueFormatter: (value: string) => {
                return parseInt(String(parseInt(value) / 60))
            }
        },
    ]

    return (
        <ShuttleRouteStopGrid columns={columns} />
    )
}