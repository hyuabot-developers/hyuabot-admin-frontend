import { useEffect } from "react"
import { v4 as uuidv4 } from "uuid"
import { GridColDef } from "@mui/x-data-grid"
import { BusStopGrid } from "./grid.tsx"
import { useBusStopStore } from "../../../../stores/bus.ts"
import { BusStopResponse, getBusStops } from "../../../../service/network/bus.ts"

export default function BusStop() {
    // Get the store
    const busStopStore = useBusStopStore()
    // Fetch bus stop
    const fetchBusStop = async () => {
        const response = await getBusStops()
        if (response.status === 200) {
            const responseData = response.data
            busStopStore.setRows(responseData.data.map((item: BusStopResponse) => {
                return {
                    id: uuidv4(),
                    stopID: item.id,
                    name: item.name,
                    latitude: item.latitude,
                    longitude: item.longitude,
                    district: item.district,
                    mobileNumber: item.mobileNumber,
                }
            }))
        }
    }
    useEffect(() => {
        fetchBusStop().then()
    }, [])
    // Configure DataGrid
    const columns: GridColDef[] = [
        {
            field: 'stopID',
            headerName: 'GBIS ID',
            width: 150,
            type: 'string',
            editable: true,
            headerAlign: 'center',
            align: 'center',
        },
        {
            field: 'name',
            headerName: '정류장 이름',
            width: 250,
            type: 'string',
            editable: true,
            headerAlign: 'center',
            align: 'center',
        },
        {
            field: 'latitude',
            headerName: '위도',
            width: 150,
            type: 'number',
            editable: true,
            headerAlign: 'center',
            align: 'center',
        },
        {
            field: 'longitude',
            headerName: '경도',
            width: 150,
            type: 'number',
            editable: true,
            headerAlign: 'center',
            align: 'center',
        },
        {
            field: 'mobileNumber',
            headerName: 'GBIS 전화 정류장 ID',
            width: 200,
            type: 'string',
            editable: true,
            headerAlign: 'center',
            align: 'center',
        },
    ]

    return (
        <BusStopGrid columns={columns} />
    )
}