import { GridColDef } from '@mui/x-data-grid'
import { useEffect } from 'react'
import { v4 as uuidv4 } from 'uuid'

import { ShuttleStopGrid } from './grid.tsx'
import {
    getShuttleStop,
    ShuttleStopResponse
} from '../../../../service/network/shuttle.ts'
import { useShuttleStopStore } from '../../../../stores/shuttle.ts'

export default function ShuttleStop() {
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
            field: 'name',
            headerName: '정류장 ID',
            width: 150,
            type: 'string',
            editable: true,
            headerAlign: 'center',
            align: 'center',
        },
        {
            field: 'latitude',
            headerName: '정류장 위도',
            minWidth: 150,
            flex: 1,
            type: 'number',
            editable: true,
            headerAlign: 'center',
            align: 'center',
        },
        {
            field: 'longitude',
            headerName: '정류장 경도',
            minWidth: 150,
            flex: 1,
            type: 'number',
            editable: true,
            headerAlign: 'center',
            align: 'center',
        },
    ]

    return (
        <ShuttleStopGrid columns={columns} />
    )
}