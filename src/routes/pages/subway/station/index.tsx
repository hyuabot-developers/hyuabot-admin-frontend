import { GridColDef } from '@mui/x-data-grid'
import { useEffect } from 'react'
import { v4 as uuidv4 } from 'uuid'

import { SubwayStationGrid } from './grid.tsx'
import {
    getSubwayRoutes,
    getSubwayStations,
    SubwayStation
} from '../../../../service/network/subway.ts'
import { useSubwayStationStore } from '../../../../stores/subway.ts'

export default function SubwayStationPage() {
    // Get the store
    const rowStore = useSubwayStationStore()
    const fetchSubwayStation = async () => {
        // Fetch subway route
        const routeResponse = await getSubwayRoutes()
        if (routeResponse.status === 200) {
            const responseData = routeResponse.data
            rowStore.setRoutes(responseData.result)
        }
        // Fetch subway station
        const stationResponse = await getSubwayStations()
        if (stationResponse.status === 200) {
            const stationData = stationResponse.data
            rowStore.setRows(stationData.result.map((item: SubwayStation) => {
                return {
                    id: uuidv4(),
                    stationID: item.id,
                    routeID: item.routeID,
                    name: item.name,
                    order: item.order,
                    cumulativeTime: item.cumulativeTime,
                }
            }))
        }
    }
    useEffect(() => {
        fetchSubwayStation().then()
    }, [])
    // Configure DataGrid
    const columns: GridColDef[] = [
        {
            field: 'stationID',
            headerName: '역 ID',
            width: 150,
            type: 'string',
            editable: true,
            headerAlign: 'center',
            align: 'center',
        },
        {
            field: 'routeID',
            headerName: '노선 ID',
            width: 150,
            type: 'singleSelect',
            valueOptions: rowStore.routes.map((route) => route.id),
            editable: true,
            headerAlign: 'center',
            align: 'center',
        },
        {
            field: 'order',
            headerName: '순서',
            width: 150,
            type: 'number',
            editable: true,
            headerAlign: 'center',
            align: 'center',
        },
        {
            field: 'name',
            headerName: '역 이름',
            minWidth: 250,
            flex: 1,
            type: 'string',
            editable: true,
            headerAlign: 'center',
            align: 'center',
        },
        {
            field: 'cumulativeTime',
            headerName: '출발지 기준 분',
            width: 200,
            type: 'string',
            editable: true,
            headerAlign: 'center',
            align: 'center',
        },
    ]

    return (
        <SubwayStationGrid columns={columns} />
    )
}