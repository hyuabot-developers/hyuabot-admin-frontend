import { useEffect } from "react"
import { v4 as uuidv4 } from "uuid"
import { GridColDef } from "@mui/x-data-grid"
import { BusRouteStopGrid } from "./grid.tsx"
import { BusRoute, BusStop, useBusRouteStopStore, useBusRouteStore, useBusStopStore } from "../../../../stores/bus.ts"
import {
    BusRouteResponse, BusRouteStopResponse,
    BusStopResponse,
    getBusRoutes,
    getBusRouteStops,
    getBusStops
} from "../../../../service/network/bus.ts"

export default function BusRouteStop() {
    // Get the store
    const busRouteStore = useBusRouteStore()
    const busStopStore = useBusStopStore()
    const busRouteStopStore = useBusRouteStopStore()
    // Fetch bus data
    let stopData: BusStop[] = []
    let routeData: BusRoute[] = []
    const fetchBusRouteStop = async () => {
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
        const routeStopResponse = await getBusRouteStops()
        if (routeStopResponse.status === 200) {
            const responseData = routeStopResponse.data
            busRouteStopStore.setRows(responseData.data.map((item: BusRouteStopResponse) => {
                const route = routeData.find(route => route.routeID === item.routeID)
                const stop = stopData.find(stop => stop.stopID === item.stopID)
                const startStop = stopData.find(stop => stop.stopID === item.startStopID)
                return {
                    id: uuidv4(),
                    route: `${route?.name} (${route?.routeID})`,
                    stop: `${stop?.name} (${stop?.stopID})`,
                    sequence: item.sequence,
                    startStop: `${startStop?.name} (${startStop?.stopID})`,
                    minuteFromStart: item.minuteFromStart,
                }
            }))
        }
    }
    useEffect(() => {
        fetchBusRouteStop().then()
    }, [])
    const busRouteStopFormatter = (value: string) => {
        return value.split(" ")[0]
    }
    // Configure DataGrid
    const columns: GridColDef[] = [
        {
            field: 'route',
            headerName: '노선',
            width: 150,
            type: 'singleSelect',
            valueOptions: busRouteStore.rows.map(route => `${route.name} (${route.routeID})`),
            editable: true,
            valueFormatter: busRouteStopFormatter,
            headerAlign: 'center',
            align: 'center',
        },
        {
            field: 'stop',
            headerName: '정류장',
            width: 250,
            type: 'singleSelect',
            valueOptions: busStopStore.rows.map(stop => `${stop.name} (${stop.stopID})`),
            editable: true,
            valueFormatter: busRouteStopFormatter,
            headerAlign: 'center',
            align: 'center',
        },
        {
            field: 'sequence',
            headerName: '경유 순서',
            width: 150,
            type: 'number',
            editable: true,
            headerAlign: 'center',
            align: 'center',
        },
        {
            field: 'startStop',
            headerName: '출발 정류장',
            width: 250,
            type: 'singleSelect',
            valueOptions: busStopStore.rows.map(stop => `${stop.name} (${stop.stopID})`),
            editable: true,
            valueFormatter: busRouteStopFormatter,
            headerAlign: 'center',
            align: 'center',
        },
        {
            field: 'minuteFromStart',
            headerName: '출발지 기준 분',
            width: 200,
            type: 'number',
            editable: true,
            headerAlign: 'center',
            align: 'center',
        },
    ]

    return (
        <BusRouteStopGrid columns={columns} />
    )
}