import { GridColDef } from '@mui/x-data-grid'
import { useEffect } from 'react'
import { v4 as uuidv4 } from 'uuid'

import { BusDepartureGrid } from './grid.tsx'
import {
    BusRouteResponse,
    BusStopResponse,
    getBusRoutes,
    getBusStops
} from '../../../../service/network/bus.ts'
import { useBusDepartureLogStore } from '../../../../stores/bus.ts'

export default function BusDepartureLog() {
    const rowStore = useBusDepartureLogStore()
    const fetchBusRouteStops = async () => {
        // Fetch bus stop
        const stopResponse = await getBusStops()
        if (stopResponse.status === 200) {
            const responseData = stopResponse.data
            rowStore.setStops(responseData.result.map((item: BusStopResponse) => {
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
        // Fetch bus route
        const routeResponse = await getBusRoutes()
        if (routeResponse.status === 200) {
            const responseData = routeResponse.data
            const { stops } = useBusDepartureLogStore.getState()
            rowStore.setRoutes(responseData.result.map((item: BusRouteResponse) => {
                const startStop = stops.find((stop) => stop.stopID === item.startStopID)
                const endStop = stops.find((stop) => stop.stopID === item.endStopID)
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
            }))
        }
    }
    useEffect(() => {
        fetchBusRouteStops().then()
    }, [])
    // Configure DataGrid
    const columns: GridColDef[] = [
        {
            field: 'timestamp',
            headerName: '출발 시간',
            minWidth: 150,
            flex: 1,
            type: 'string',
            editable: false,
            headerAlign: 'center',
            align: 'center',
        },
        {
            field: 'vehicleID',
            headerName: '차량 ID',
            minWidth: 250,
            flex: 1,
            type: 'string',
            editable: false,
            headerAlign: 'center',
            align: 'center',
        },
    ]

    return (
        <BusDepartureGrid columns={columns} />
    )
}