import RefreshIcon from '@mui/icons-material/Refresh'
import { Toolbar, ToolbarButton } from '@mui/x-data-grid'
import { v4 as uuidv4 } from 'uuid'

import {
    BusRealtimeResponse,
    BusRouteResponse,
    BusStopResponse,
    getBusRealtime,
    getBusRoutes,
    getBusStops
} from '../../../../service/network/bus.ts'
import {
    BusRoute,
    BusStop,
    useBusRealtimeStore,
} from '../../../../stores/bus.ts'

export const GridToolbar = () => {
    const rowStore = useBusRealtimeStore()
    const fetchBusRealtime = async () => {
        let stopData: BusStop[] = []
        let routeData: BusRoute[] = []
        // Fetch bus stop
        const stopResponse = await getBusStops()
        if (stopResponse.status === 200) {
            const responseData = stopResponse.data
            stopData = responseData.result.map((item: BusStopResponse) => {
                return {
                    id: uuidv4(),
                    stopID: item.id,
                    name: item.name,
                    latitude: item.latitude,
                    longitude: item.longitude,
                    districtCode: item.districtCode,
                    mobileNumber: item.mobileNumber,
                }
            })
            rowStore.setStops(stopData)
        }
        // Fetch bus route
        const routeResponse = await getBusRoutes()
        if (routeResponse.status === 200) {
            const responseData = routeResponse.data
            routeData = responseData.result.map((item: BusRouteResponse) => {
                const startStop = stopData.find((stop) => stop.stopID === item.startStopID)
                const endStop = stopData.find((stop) => stop.stopID === item.endStopID)
                return {
                    id: uuidv4(),
                    routeID: item.id,
                    name: item.name,
                    type: item.typeCode,
                    startStop: `${startStop?.name} (${startStop?.stopID})`,
                    endStop: `${endStop?.name} (${endStop?.stopID})`,
                    companyID: item.companyID,
                    companyName: item.companyName,
                    companyTelephone: item.companyPhone,
                    upFirstTime: item.upFirstTime,
                    upLastTime: item.upLastTime,
                    downFirstTime: item.downFirstTime,
                    downLastTime: item.downLastTime
                }
            })
            rowStore.setRoutes(routeData)
        }
        // Fetch bus realtime
        const realtimeResponse = await getBusRealtime()
        if (realtimeResponse.status === 200) {
            const responseData = realtimeResponse.data
            rowStore.setRows(responseData.result.map((item: BusRealtimeResponse) => {
                return {
                    id: uuidv4(),
                    route: routeData.find((route) => route.routeID === item.routeID)?.name || '',
                    stop: stopData.find((stop) => stop.stopID === item.stopID)?.name || '',
                    order: item.order,
                    remainingStop: item.stop,
                    remainingTime: item.time,
                    remainingSeat: item.seat,
                    lowFloor: item.isLowFloor,
                    updatedAt: item.updatedAt,
                }
            }))
        }
    }

    return (
        <Toolbar style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '10px' }}>
            <ToolbarButton onClick={fetchBusRealtime}>
                <RefreshIcon />
            </ToolbarButton>
        </Toolbar>
    )
}