import { useEffect } from "react"
import { v4 as uuidv4 } from "uuid"
import { GridColDef } from "@mui/x-data-grid"
import { BusRouteGrid } from "./grid.tsx"
import { BusStop, useBusRouteStore, useBusStopStore } from "../../../../stores/bus.ts"
import { BusRouteResponse, BusStopResponse, getBusRoutes, getBusStops } from "../../../../service/network/bus.ts"

export default function BusRoute() {
    // Get the store
    const busRouteStore = useBusRouteStore()
    const busStopStore = useBusStopStore()
    // Fetch bus period
    const fetchBusRoute = async () => {
        // Fetch bus stop
        const stopResponse = await getBusStops()
        let stopData: BusStop[] = []
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
            busRouteStore.setRows(responseData.data.map((item: BusRouteResponse) => {
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
            }))
        }
    }
    const busTimeFormatter = (value: string) => {
        return value.split("+")[0]
    }
    const busStopFormatter = (value: string) => {
        return value.split(" ")[0]
    }
    useEffect(() => {
        async function fetchData() {
            await fetchBusRoute()
        }
        fetchData().then()
    }, [])
    // Configure DataGrid
    const columns: GridColDef[] = [
        {
            field: 'routeID',
            headerName: 'GBIS ID',
            width: 150,
            type: 'string',
            editable: true,
            headerAlign: 'center',
            align: 'center',
        },
        {
            field: 'name',
            headerName: '노선명',
            width: 150,
            type: 'string',
            editable: true,
            headerAlign: 'center',
            align: 'center',
        },
        {
            field: 'type',
            headerName: '노선 분류',
            width: 150,
            type: 'singleSelect',
            valueOptions: ['일반형시내버스', '직행좌석형시내버스'],
            editable: true,
            headerAlign: 'center',
            align: 'center',
        },
        {
            field: 'startStop',
            headerName: '출발지',
            width: 200,
            type: 'singleSelect',
            valueOptions: busStopStore.rows.map(stop => `${stop.name} (${stop.stopID})`),
            editable: true,
            valueFormatter: busStopFormatter,
            headerAlign: 'center',
            align: 'center',
        },
        {
            field: 'endStop',
            headerName: '도착지',
            width: 200,
            type: 'singleSelect',
            valueOptions: busStopStore.rows.map(stop => `${stop.name} (${stop.stopID})`),
            editable: true,
            valueFormatter: busStopFormatter,
            headerAlign: 'center',
            align: 'center',
        },
        {
            field: 'companyID',
            headerName: '운수사 ID',
            width: 150,
            type: 'string',
            editable: true,
            headerAlign: 'center',
            align: 'center',
        },
        {
            field: 'companyName',
            headerName: '운수사 이름',
            width: 150,
            type: 'string',
            editable: true,
            headerAlign: 'center',
            align: 'center',
        },
        {
            field: 'companyTelephone',
            headerName: '운수사 전화번호',
            width: 150,
            type: 'string',
            editable: true,
            headerAlign: 'center',
            align: 'center',
        },
        {
            field: 'upFirstTime',
            headerName: '상행 첫차',
            width: 150,
            type: 'string',
            editable: true,
            valueFormatter: busTimeFormatter,
            headerAlign: 'center',
            align: 'center',
        },
        {
            field: 'downFirstTime',
            headerName: '하행 첫차',
            width: 150,
            type: 'string',
            editable: true,
            valueFormatter: busTimeFormatter,
            headerAlign: 'center',
            align: 'center',
        },
        {
            field: 'upLastTime',
            headerName: '상행 막차',
            width: 150,
            type: 'string',
            editable: true,
            valueFormatter: busTimeFormatter,
            headerAlign: 'center',
            align: 'center',
        },
        {
            field: 'downLastTime',
            headerName: '하행 막차',
            width: 150,
            type: 'string',
            editable: true,
            valueFormatter: busTimeFormatter,
            headerAlign: 'center',
            align: 'center',
        }
    ]

    return (
        <BusRouteGrid columns={columns} />
    )
}