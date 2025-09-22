import { useEffect } from "react"
import { v4 as uuidv4 } from "uuid"
import { GridColDef } from "@mui/x-data-grid"
import { ShuttleRouteGrid } from "./grid.tsx"
import { useShuttleRouteStore, useShuttleStopStore } from "../../../../stores/shuttle.ts"
import {
    getShuttleRoute,
    getShuttleStop,
    ShuttleRouteResponse,
    ShuttleStopResponse
} from "../../../../service/network/shuttle.ts"

export default function ShuttleRoute() {
    // Get the store
    const shuttleRouteStore = useShuttleRouteStore()
    const shuttleStopStore = useShuttleStopStore()
    // Fetch shuttle period
    const fetchShuttleRoute = async () => {
        const response = await getShuttleRoute()
        if (response.status === 200) {
            const responseData = response.data
            shuttleRouteStore.setRows(responseData.result.map((item: ShuttleRouteResponse) => {
                return {
                    id: uuidv4(),
                    name: item.name,
                    tag: item.tag,
                    korean: item.descriptionKorean,
                    english: item.descriptionEnglish,
                    start: item.startStopID,
                    end: item.endStopID,
                }
            }))
        }
    }
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
        async function fetchData() {
            await fetchShuttleRoute()
            await fetchShuttleStop()
        }
        fetchData().then()
    }, [])
    // Configure DataGrid
    const columns: GridColDef[] = [
        {
            field: 'name',
            headerName: '노선 ID',
            width: 150,
            type: 'string',
            editable: true,
            headerAlign: 'center',
            align: 'center',
        },
        {
            field: 'tag',
            headerName: '노선 분류',
            width: 150,
            type: 'string',
            editable: true,
            headerAlign: 'center',
            align: 'center',
        },
        {
            field: 'korean',
            headerName: '한국어 이름',
            minWidth: 250,
            flex: 1,
            type: 'string',
            editable: true,
            headerAlign: 'center',
            align: 'center',
        },
        {
            field: 'english',
            headerName: '영어 이름',
            minWidth: 500,
            flex: 2,
            type: 'string',
            editable: true,
            headerAlign: 'center',
            align: 'center',
        },
        {
            field: 'start',
            headerName: '출발지',
            width: 200,
            type: 'singleSelect',
            valueOptions: shuttleStopStore.rows.map(stop => stop.name),
            editable: true,
            headerAlign: 'center',
            align: 'center',
        },
        {
            field: 'end',
            headerName: '도착지',
            width: 200,
            type: 'singleSelect',
            valueOptions: shuttleStopStore.rows.map(stop => stop.name),
            editable: true,
            headerAlign: 'center',
            align: 'center',
        },
    ]

    return (
        <ShuttleRouteGrid columns={columns} />
    )
}