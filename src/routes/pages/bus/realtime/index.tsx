import { GridColDef } from '@mui/x-data-grid'
import { useEffect } from 'react'
import { v4 as uuidv4 } from 'uuid'

import { BusRealtimeGrid } from './grid.tsx'
import {
    BusRealtimeResponse,
    BusRouteResponse,
    BusStopResponse,
    getBusRealtime,
    getBusRoutes,
    getBusStops
} from '../../../../service/network/bus.ts'
import { BusRoute, BusStop, useBusRealtimeStore } from '../../../../stores/bus.ts'

export default function BusRealtime() {
    const rowStore = useBusRealtimeStore()
    let stopData: BusStop[] = []
    let routeData: BusRoute[] = []
    // Fetch bus realtime
    const fetchBusRealtime = async () => {
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
            field: 'route',
            headerName: '노선',
            minWidth: 150,
            flex: 1,
            type: 'string',
            editable: false,
            headerAlign: 'center',
            align: 'center',
        },
        {
            field: 'stop',
            headerName: '정류장',
            minWidth: 250,
            flex: 1,
            type: 'string',
            editable: false,
            headerAlign: 'center',
            align: 'center',
        },
        {
            field: 'order',
            headerName: '도착 순번',
            width: 150,
            type: 'number',
            editable: false,
            headerAlign: 'center',
            align: 'center',
        },
        {
            field: 'remainingStop',
            headerName: '남은 정류장',
            width: 150,
            type: 'number',
            editable: false,
            headerAlign: 'center',
            align: 'center',
        },
        {
            field: 'remainingTime',
            headerName: '남은 시간',
            width: 150,
            type: 'number',
            editable: false,
            headerAlign: 'center',
            align: 'center',
        },
        {
            field: 'remainingSeat',
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
            minWidth: 250,
            flex: 1,
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