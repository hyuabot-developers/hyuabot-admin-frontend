import { GridColDef } from '@mui/x-data-grid'
import { useEffect } from 'react'
import { v4 as uuidv4 } from 'uuid'

import { SubwayRealtimeGrid } from './grid.tsx'
import {
    SubwayRealtime,
    SubwayRoute,
    SubwayStation,
    getSubwayRealtime,
    getSubwayRoutes,
    getSubwayStations
} from '../../../../service/network/subway.ts'
import { useSubwayRealtimeStore } from '../../../../stores/subway.ts'

export default function SubwayRealtimePage() {
    // Get the store
    const rowStore = useSubwayRealtimeStore()
    // Fetch Subway realtime
    const fetchSubwayRealtime = async () => {
        // Fetch Subway station
        const stationResponse = await getSubwayStations()
        if (stationResponse.status === 200) {
            const responseData = stationResponse.data
            rowStore.setStations(responseData.result.map((item: SubwayStation) => {
                return {
                    id: item.id,
                    routeID: item.routeID,
                    name: item.name,
                    order: item.order,
                    cumulativeTime: item.cumulativeTime,
                }
            }))
        }
        // Fetch Subway route
        const routeResponse = await getSubwayRoutes()
        if (routeResponse.status === 200) {
            const responseData = routeResponse.data
            rowStore.setRoutes(responseData.result.map((item: SubwayRoute) => {
                return {
                    id: item.id,
                    name: item.name,
                }
            }))
        }
        // Fetch Subway realtime
        const realtimeResponse = await getSubwayRealtime()
        if (realtimeResponse.status === 200) {
            const responseData = realtimeResponse.data
            rowStore.setRows(responseData.result.map((item: SubwayRealtime) => {
                const { stations } = useSubwayRealtimeStore.getState()
                const departureStation = stations.find((station) => station.id === item.stationID)
                const terminalStation = stations.find((station) => station.id === item.terminalStationID)
                return {
                    id: uuidv4(),
                    sortableId: `${departureStation ? departureStation.id : ''}-${item.direction}-${item.time}`,
                    station: departureStation ? `${departureStation.name} (${departureStation.id})` : '',
                    direction: item.direction,
                    order: item.order,
                    location: item.location,
                    stop: item.stop,
                    time: item.time,
                    terminalStation: terminalStation ? `${terminalStation.name} (${terminalStation.id})` : '',
                    trainNumber: item.trainNumber,
                    updateTime: item.updateTime,
                    isExpress: item.isExpress,
                    isLast: item.isLast,
                    status: item.status,
                    isNew: false,
                }
            }))
        }
    }
    const headingFormatter = (value: string) => {
        if (value == 'true') { return '상행' }
        else if (value == 'false') { return '하행' }
        else { return '' }
    }
    const statusFormatter = (value: number) => {
        switch (value) {
        case 0: return '진입'
        case 1: return '도착'
        case 2: return '출발'
        case 3: return '전역 출발'
        case 4: return '전역 도착'
        case 99: return '운행중'
        }
        return ''
    }
    useEffect(() => {
        fetchSubwayRealtime().then()
    }, [])
    // Configure DataGrid
    const columns: GridColDef[] = [
        {
            field: 'sortableId',
            headerName: '정렬 ID',
            width: 200,
            type: 'string',
            editable: false,
            headerAlign: 'center',
            align: 'center',
        },
        {
            field: 'station',
            headerName: '역명',
            width: 150,
            type: 'string',
            editable: false,
            headerAlign: 'center',
            align: 'center',
        },
        {
            field: 'direction',
            headerName: '방향',
            width: 30,
            type: 'string',
            valueFormatter: headingFormatter,
            editable: false,
            headerAlign: 'center',
            align: 'center',
        },
        {
            field: 'terminalStation',
            headerName: '종착역',
            width: 150,
            type: 'string',
            editable: false,
            headerAlign: 'center',
            align: 'center',
        },
        {
            field: 'trainNumber',
            headerName: '열차 번호',
            width: 75,
            type: 'string',
            editable: false,
            headerAlign: 'center',
            align: 'center',
        },
        {
            field: 'order',
            headerName: '순서',
            width: 100,
            type: 'number',
            editable: false,
            headerAlign: 'center',
            align: 'center',
        },
        {
            field: 'location',
            headerName: '위치',
            width: 150,
            type: 'string',
            editable: false,
            headerAlign: 'center',
            align: 'center',
        },
        {
            field: 'status',
            headerName: '상태',
            width: 30,
            type: 'string',
            valueFormatter: statusFormatter,
            editable: false,
            headerAlign: 'center',
            align: 'center',
        },
        {
            field: 'stop',
            headerName: '정차역 수',
            width: 100,
            type: 'string',
            editable: false,
            headerAlign: 'center',
            align: 'center',
        },
        {
            field: 'time',
            headerName: '도착 예정 시간',
            width: 120,
            type: 'string',
            editable: false,
            headerAlign: 'center',
            align: 'center',
        },
        {
            field: 'isExpress',
            headerName: '급행',
            width: 30,
            type: 'boolean',
            editable: false,
            headerAlign: 'center',
            align: 'center',
        },
        {
            field: 'isLast',
            headerName: '막차',
            width: 30,
            type: 'boolean',
            editable: false,
            headerAlign: 'center',
            align: 'center',
        },
        {
            field: 'updateTime',
            headerName: '갱신 시간',
            minWidth: 200,
            flex: 1,
            type: 'string',
            editable: false,
            headerAlign: 'center',
            align: 'center',
        },
    ]

    return (
        <SubwayRealtimeGrid columns={columns} />
    )
}