import { useEffect } from "react"
import { v4 as uuidv4 } from "uuid"
import { GridColDef } from "@mui/x-data-grid"
import { BusTimetableGrid } from "./grid.tsx"
import {
    BusRoute,
    BusStop,
    useBusRouteStore,
    useBusStopStore,
    useBusTimetableStore
} from "../../../../stores/bus.ts"
import {
    BusRouteResponse,
    BusStopResponse,
    BusTimetableResponse,
    getBusRoutes,
    getBusStops,
    getBusTimetables
} from "../../../../service/network/bus.ts"

export default function BusTimetable() {
    // Get the store
    const busRouteStore = useBusRouteStore()
    const busStopStore = useBusStopStore()
    const busTimetableStore = useBusTimetableStore()
    // Fetch bus data
    let stopData: BusStop[] = []
    let routeData: BusRoute[] = []
    const fetchBusTimetable = async () => {
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
        const timetableResponse = await getBusTimetables()
        if (timetableResponse.status === 200) {
            const responseData = timetableResponse.data
            busTimetableStore.setRows(responseData.data.map((item: BusTimetableResponse) => {
                const route = routeData.find(route => route.routeID === item.routeID)
                const startStop = stopData.find(stop => stop.stopID === item.start)
                return {
                    id: uuidv4(),
                    route: `${route?.name} (${route?.routeID})`,
                    startStop: `${startStop?.name} (${startStop?.stopID})`,
                    weekdays: item.weekdays,
                    departureTime: item.departureTime,
                }
            }))
        }
    }
    useEffect(() => {
        fetchBusTimetable().then()
    }, [])
    const busRouteStopFormatter = (value: string) => {
        return value.split(" ")[0]
    }
    const busWeekdaysFormatter = (value: string) => {
        switch (value) {
        case "weekdays" : return "평일"
        case "saturday" : return "토요일"
        case "sunday" : return "공휴일"
        default: return ""
        }
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
            field: 'weekdays',
            headerName: '평일/토요일/공휴일',
            width: 200,
            type: 'singleSelect',
            valueOptions: ['weekdays', 'saturday', 'sunday'],
            valueFormatter: busWeekdaysFormatter,
            editable: true,
            headerAlign: 'center',
            align: 'center',
        },
        {
            field: 'departureTime',
            headerName: '출발 시간',
            width: 200,
            type: 'string',
            editable: true,
            headerAlign: 'center',
            align: 'center',
        },
    ]

    return (
        <BusTimetableGrid columns={columns} />
    )
}