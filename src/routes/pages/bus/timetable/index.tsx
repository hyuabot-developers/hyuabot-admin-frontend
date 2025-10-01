import { GridColDef } from '@mui/x-data-grid'
import { useEffect } from 'react'
import { v4 as uuidv4 } from 'uuid'

import { BusTimetableGrid } from './grid.tsx'
import {
    BusRouteResponse,
    BusStopResponse,
    getBusRoutes,
    getBusStops,
} from '../../../../service/network/bus.ts'
import { useBusTimetableStore } from '../../../../stores/bus.ts'

export default function BusTimetable() {
    // Get the store
    const rowStore = useBusTimetableStore()
    // Fetch bus data
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
            const { stops } = useBusTimetableStore.getState()
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
    const busWeekdaysFormatter = (value: string) => {
        switch (value) {
        case 'weekdays' : return '평일'
        case 'saturday' : return '토요일'
        case 'sunday' : return '공휴일'
        default: return ''
        }
    }
    // Configure DataGrid
    const columns: GridColDef[] = [
        {
            field: 'dayType',
            headerName: '평일/토요일/공휴일',
            minWidth: 200,
            flex: 1,
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
            minWidth: 200,
            flex: 1,
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