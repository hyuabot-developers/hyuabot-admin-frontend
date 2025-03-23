import { v4 as uuidv4 } from "uuid"
import { Button } from "@mui/material"
import { GridToolbarContainer } from "@mui/x-data-grid"
import RefreshIcon from '@mui/icons-material/Refresh'
import {
    BusRoute,
    BusStop,
    useBusRealtimeStore,
    useBusRouteStore,
    useBusStopStore
} from "../../../../stores/bus.ts"
import {
    BusRealtimeResponse,
    BusRouteResponse,
    BusStopResponse,
    getBusRealtime,
    getBusRoutes,
    getBusStops
} from "../../../../service/network/bus.ts"

export function Toolbar() {
    const rowStore = useBusRealtimeStore()
    const busRouteStore = useBusRouteStore()
    const busStopStore = useBusStopStore()
    // Fetch bus realtime
    // Fetch bus realtime
    const fetchBusRealtime = async () => {
        let stopData: BusStop[] = []
        let routeData: BusRoute[] = []
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
            rowStore.setRows(responseData.data.map((item: BusRealtimeResponse) => {
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

    return (
        <GridToolbarContainer style={{ display: "flex", justifyContent: "flex-end", marginTop: "10px" }}>
            <Button color="primary" variant="outlined" startIcon={<RefreshIcon />} onClick={fetchBusRealtime}>
                새로고침
            </Button>
        </GridToolbarContainer>
    )
}