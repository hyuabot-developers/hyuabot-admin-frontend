import { GridColDef } from '@mui/x-data-grid'
import { useEffect } from 'react'
import { v4 as uuidv4 } from 'uuid'

import { BusStopGrid } from './grid.tsx'
import { BusStopResponse, getBusStops } from '../../../../service/network/bus.ts'
import { useBusStopStore } from '../../../../stores/bus.ts'

export default function BusStop() {
    // Get the store
    const busStopStore = useBusStopStore()
    // Fetch bus stop
    const fetchBusStop = async () => {
        const response = await getBusStops()
        if (response.status === 200) {
            const responseData = response.data
            busStopStore.setRows(responseData.result.map((item: BusStopResponse) => {
                return {
                    id: uuidv4(),
                    stopID: item.id,
                    name: item.name,
                    latitude: item.latitude,
                    longitude: item.longitude,
                    districtCode: item.districtCode,
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
            minWidth: 250,
            flex: 1,
            type: 'string',
            editable: true,
            headerAlign: 'center',
            align: 'center',
        },
        {
            field: 'latitude',
            headerName: '위도',
            minWidth: 150,
            flex: 1,
            type: 'number',
            editable: true,
            headerAlign: 'center',
            align: 'center',
        },
        {
            field: 'longitude',
            headerName: '경도',
            minWidth: 150,
            flex: 1,
            type: 'number',
            editable: true,
            headerAlign: 'center',
            align: 'center',
        },
        {
            field: 'mobileNumber',
            headerName: '검색용 ID',
            minWidth: 150,
            flex: 1,
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