import { v4 as uuidv4 } from "uuid"
import { Button } from "@mui/material"
import { GridRowModes, GridToolbarContainer } from "@mui/x-data-grid"


import AddIcon from "@mui/icons-material/Add"
import RefreshIcon from '@mui/icons-material/Refresh'
import {
    BusRoute,
    BusStop,
    useBusRouteStopGridModelStore, useBusRouteStopStore,
    useBusRouteStore,
    useBusStopStore
} from "../../../../stores/bus.ts"
import {
    BusRouteResponse, BusRouteStopResponse,
    BusStopResponse,
    getBusRoutes,
    getBusRouteStops,
    getBusStops
} from "../../../../service/network/bus.ts"

export function Toolbar() {
    const rowStore = useBusRouteStopStore()
    const rowModesModelStore = useBusRouteStopGridModelStore()
    const busRouteStore = useBusRouteStore()
    const busStopStore = useBusStopStore()
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
            rowStore.setRows(responseData.data.map((item: BusRouteStopResponse) => {
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
    // Add record button click event
    const addRowButtonClicked = () => {
        const id = uuidv4()
        rowStore.setRows([
            {
                id,
                route: `${busRouteStore.rows[0].name} (${busRouteStore.rows[0].routeID})`,
                stop: `${busStopStore.rows[0].name} (${busStopStore.rows[0].stopID})`,
                startStop: `${busStopStore.rows[0].name} (${busStopStore.rows[0].stopID})`,
                sequence: 0,
                minuteFromStart: 0,
                isNew: true,
            },
            ...rowStore.rows,
        ])
        rowModesModelStore.setRowModesModel(({
            ...rowModesModelStore.rowModesModel,
            [id]: { mode: GridRowModes.Edit, fieldToFocus: "name" },
        }))
    }

    return (
        <GridToolbarContainer style={{ display: "flex", justifyContent: "flex-end", marginTop: "10px" }}>
            <Button color="primary" variant="outlined" startIcon={<RefreshIcon />} onClick={fetchBusRouteStop}>
                새로고침
            </Button>
            <Button color="primary" variant="contained" startIcon={<AddIcon />} onClick={addRowButtonClicked}>
                항목 추가
            </Button>
        </GridToolbarContainer>
    )
}