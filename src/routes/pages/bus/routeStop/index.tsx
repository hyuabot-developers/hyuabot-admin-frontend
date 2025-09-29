import { GridColDef } from '@mui/x-data-grid'
import { useEffect } from 'react'
import { v4 as uuidv4 } from 'uuid'

import { BusRouteStopGrid } from './grid.tsx'
import {
    BusRouteResponse,
    BusStopResponse,
    getBusRoutes,
    getBusStops
} from '../../../../service/network/bus.ts'
import { BusRoute, BusStop, useBusRouteStopGridModelStore, useBusRouteStopStore } from '../../../../stores/bus.ts'

export default function BusRouteStop() {
    const rowStore = useBusRouteStopStore()
    const rowModesModelStore = useBusRouteStopGridModelStore()
    // Fetch bus data
    let stopData: BusStop[] = []
    let routeData: BusRoute[] = []
    const fetchBusRouteStop = async () => {
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
                    district: item.districtCode,
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
                    type: item.typeName,
                    startStop: `${startStop?.name} (${startStop?.stopID})`,
                    endStop: `${endStop?.name} (${endStop?.stopID})`,
                    companyID: item.companyID,
                    companyName: item.companyName,
                    companyTelephone: item.companyPhone,
                    upFirstTime: item.upFirstTime,
                    upLastTime: item.upLastTime,
                    downFirstTime: item.downFirstTime,
                    downLastTime: item.downLastTime,
                    isNew: false,
                }
            })
            rowStore.setRoutes(routeData)
        }
    }
    useEffect(() => {
        fetchBusRouteStop().then()
        rowStore.setRows([])
        rowModesModelStore.setRowModesModel({})
    }, [])
    const busRouteStopFormatter = (value: string) => {
        return value.split(' ')[0]
    }
    // Configure DataGrid
    const columns: GridColDef[] = [
        {
            field: 'stop',
            headerName: '정류장',
            minWidth: 250,
            flex: 1,
            type: 'singleSelect',
            valueOptions: rowStore.stops.map((stop) => `${stop.name} (${stop.stopID})`),
            editable: true,
            valueFormatter: busRouteStopFormatter,
            headerAlign: 'center',
            align: 'center',
        },
        {
            field: 'order',
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
            minWidth: 250,
            flex: 1,
            type: 'singleSelect',
            valueOptions: rowStore.stops.map((stop) => `${stop.name} (${stop.stopID})`),
            editable: true,
            valueFormatter: busRouteStopFormatter,
            headerAlign: 'center',
            align: 'center',
        },
        {
            field: 'travelTime',
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