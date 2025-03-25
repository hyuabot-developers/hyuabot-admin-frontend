import { useEffect } from "react"
import { v4 as uuidv4 } from "uuid"
import { GridColDef } from "@mui/x-data-grid"
import { SubwayRealtimeGrid } from "./grid.tsx"
import { GridSubwayStation, GridSubwayRoute, useSubwayRealtimeStore, useSubwayRouteStore, useSubwayStationStore } from "../../../../stores/subway.ts"
import {
    SubwayRealtime,
    SubwayRoute,
    SubwayStation,
    getSubwayRealtime,
    getSubwayRoutes,
    getSubwayStations
} from "../../../../service/network/subway.ts"

export default function SubwayRealtimePage() {
    // Get the store
    const subwayRealtimeStore = useSubwayRealtimeStore()
    const subwayRouteStore = useSubwayRouteStore()
    const subwayStationStore = useSubwayStationStore()
    let stationData: GridSubwayStation[] = []
    let routeData: GridSubwayRoute[] = []
    // Fetch Subway realtime
    const fetchSubwayRealtime = async () => {
        // Fetch Subway station
        const stationResponse = await getSubwayStations()
        if (stationResponse.status === 200) {
            const responseData = stationResponse.data
            stationData = responseData.data.map((item: SubwayStation) => {
                return {
                    id: uuidv4(),
                    stationID: item.id,
                    routeID: item.routeID,
                    name: item.name,
                    sequence: item.sequence,
                    cumulativeTime: item.cumulativeTime,
                }
            })
            subwayStationStore.setRows(stationData)
        }
        // Fetch Subway route
        const routeResponse = await getSubwayRoutes()
        if (routeResponse.status === 200) {
            const responseData = routeResponse.data
            routeData = responseData.data.map((item: SubwayRoute) => {
                return {
                    id: uuidv4(),
                    routeID: item.id,
                    name: item.name,
                }
            })
            subwayRouteStore.setRows(routeData)
        }
        // Fetch Subway realtime
        const realtimeResponse = await getSubwayRealtime()
        if (realtimeResponse.status === 200) {
            const responseData = realtimeResponse.data
            subwayRealtimeStore.setRows(responseData.data.map((item: SubwayRealtime) => {
                const departureStation = stationData.find(station => station.stationID === item.stationID)
                const terminalStation = stationData.find(station => station.stationID === item.terminalStationID)
                const routeName = routeData.find(route => route.routeID === departureStation?.routeID)?.name
                return {
                    id: uuidv4(),
                    sortID: `${item.stationID}-${headingSortFormatter(item.heading)}-${item.sequence}`,
                    stationName: departureStation?.name,
                    routeName: routeName,
                    sequence: item.sequence,
                    current: item.current,
                    heading: item.heading,
                    station: item.station,
                    time: item.time,
                    trainNumber: item.trainNumber,
                    express: item.express,
                    last: item.last,
                    terminalStationName: terminalStation?.name,
                    status: item.status,
                }
            }))
        }
    }
    const headingSortFormatter = (value: string) => {
        if (value == 'true') { return 1 }
        else if (value == 'false') { return 2 }
        else { return -1 }
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
            field: 'sortID',
            headerName: 'ID',
            width: 150,
            type: 'string',
            editable: false,
            headerAlign: 'center',
            align: 'center',
        },
        {
            field: 'stationName',
            headerName: '역명',
            width: 150,
            type: 'string',
            editable: false,
            headerAlign: 'center',
            align: 'center',
        },
        {
            field: 'routeName',
            headerName: '노선명',
            width: 100,
            type: 'string',
            editable: false,
            headerAlign: 'center',
            align: 'center',
        },
        {
            field: 'heading',
            headerName: '행선',
            width: 50,
            type: 'string',
            editable: false,
            headerAlign: 'center',
            align: 'center',
            valueFormatter: headingFormatter,
        },
        {
            field: 'sequence',
            headerName: '순서',
            width: 50,
            type: 'number',
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
            field: 'time',
            headerName: '남은 시간',
            width: 100,
            type: 'string',
            editable: false,
            headerAlign: 'center',
            align: 'center',
        },
        {
            field: 'terminalStationName',
            headerName: '종착역',
            width: 150,
            type: 'string',
            editable: false,
            headerAlign: 'center',
            align: 'center',
        },
        {
            field: 'current',
            headerName: '현재 위치',
            width: 150,
            type: 'string',
            editable: false,
            headerAlign: 'center',
            align: 'center',
        },
        {
            field: 'status',
            headerName: '상태',
            width: 100,
            type: 'string',
            editable: false,
            headerAlign: 'center',
            align: 'center',
            valueFormatter: statusFormatter,
        },
        {
            field: 'express',
            headerName: '급행',
            width: 50,
            type: 'boolean',
            editable: false,
            headerAlign: 'center',
            align: 'center',
        },
        {
            field: 'last',
            headerName: '막차',
            width: 50,
            type: 'boolean',
            editable: false,
            headerAlign: 'center',
            align: 'center',
        }
    ]

    return (
        <SubwayRealtimeGrid columns={columns} />
    )
}