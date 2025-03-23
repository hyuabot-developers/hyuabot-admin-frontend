import { useEffect } from "react"
import { v4 as uuidv4 } from "uuid"
import { GridColDef } from "@mui/x-data-grid"
import { BusRealtimeGrid } from "./grid.tsx"
import { BusRoute, BusStop, useBusRealtimeStore, useBusRouteStore, useBusStopStore } from "../../../../stores/bus.ts"
import {
    BusRealtimeResponse,
    BusRouteResponse,
    BusStopResponse,
    getBusRealtime,
    getBusRoutes,
    getBusStops
} from "../../../../service/network/bus.ts"

export default function BusRealtime() {
    // Get the store
    const busRealtimeStore = useBusRealtimeStore()
    const busRouteStore = useBusRouteStore()
    const busStopStore = useBusStopStore()
    let stopData: BusStop[] = []
    let routeData: BusRoute[] = []
    // Fetch bus realtime
    const fetchBusRealtime = async () => {
        // Fetch bus stop
        const stopResponse = await getBusStops()
        if (stopResponse.status === 200) {
            const responseData = stopResponse.data
            stopData = responseData.data.map((item: BusStopResponse) => {
                return {
                    id: uuidv4(),
                    stopID: item.id,
                    name: item.name,
                    latitude: item.latitude,
                    longitude: item.longitude,
                    district: item.district,
                    mobileNumber: item.mobileNumber,
                }
            })
            busStopStore.setRows(stopData)
        }
        // Fetch bus route
        const routeResponse = await getBusRoutes()
        if (routeResponse.status === 200) {
            const responseData = routeResponse.data
            routeData = responseData.data.map((item: BusRouteResponse) => {
                const startStop = stopData.find(stop => stop.stopID === item.start)
                const endStop = stopData.find(stop => stop.stopID === item.end)
                return {
                    id: uuidv4(),
                    routeID: item.id,
                    name: item.name,
                    type: item.type,
                    startStop: `${startStop?.name} (${startStop?.stopID})`,
                    endStop: `${endStop?.name} (${endStop?.stopID})`,
                    companyID: item.company.id,
                    companyName: item.company.name,
                    companyTelephone: item.company.telephone,
                    upFirstTime: item.up.first,
                    upLastTime: item.up.last,
                    downFirstTime: item.down.first,
                    downLastTime: item.down.last,
                }
            })
            busRouteStore.setRows(routeData)
        }
        // Fetch bus realtime
        const realtimeResponse = await getBusRealtime()
        if (realtimeResponse.status === 200) {
            const responseData = realtimeResponse.data
            busRealtimeStore.setRows(responseData.data.map((item: BusRealtimeResponse) => {
                return {
                    id: uuidv4(),
                    routeName: routeData.find(route => route.routeID === item.routeID)?.name || "",
                    stopName: stopData.find(stop => stop.stopID === item.stopID)?.name || "",
                    sequence: item.sequence,
                    stop: item.stop,
                    time: item.time,
                    seat: item.seat,
                    lowFloor: item.lowFloor,
                    updatedAt: item.updatedAt,
                }
            }))
        }
    }
    const remainSeatFormatter = (value: number) => {
        if (value < 0) {
            return '-'
        }
        return `${value} 석`
    }
    useEffect(() => {
        fetchBusRealtime().then()
    }, [])
    // Configure DataGrid
    const columns: GridColDef[] = [
        {
            field: 'routeName',
            headerName: '노선',
            width: 150,
            type: 'string',
            editable: false,
            headerAlign: 'center',
            align: 'center',
        },
        {
            field: 'stopName',
            headerName: '정류장',
            width: 250,
            type: 'string',
            editable: false,
            headerAlign: 'center',
            align: 'center',
        },
        {
            field: 'sequence',
            headerName: '도착 순번',
            width: 150,
            type: 'number',
            editable: false,
            headerAlign: 'center',
            align: 'center',
        },
        {
            field: 'stop',
            headerName: '남은 정류장',
            width: 150,
            type: 'number',
            editable: false,
            headerAlign: 'center',
            align: 'center',
        },
        {
            field: 'time',
            headerName: '남은 시간',
            width: 150,
            type: 'number',
            editable: false,
            headerAlign: 'center',
            align: 'center',
        },
        {
            field: 'seat',
            headerName: '잔여 좌석',
            width: 150,
            type: 'number',
            editable: false,
            headerAlign: 'center',
            align: 'center',
            valueFormatter: remainSeatFormatter,
        },
        {
            field: 'lowFloor',
            headerName: '저상 버스',
            width: 150,
            type: 'boolean',
            editable: false,
            headerAlign: 'center',
            align: 'center',
        },
        {
            field: 'updatedAt',
            headerName: '업데이트 시간',
            width: 250,
            type: 'number',
            editable: false,
            headerAlign: 'center',
            align: 'center',
        },
    ]

    return (
        <BusRealtimeGrid columns={columns} />
    )
}