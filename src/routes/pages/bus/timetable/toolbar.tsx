import { v4 as uuidv4 } from "uuid"
import { Button } from "@mui/material"
import { GridRowModes, GridToolbarContainer } from "@mui/x-data-grid"


import AddIcon from "@mui/icons-material/Add"
import RefreshIcon from '@mui/icons-material/Refresh'
import {
    BusRoute,
    BusStop,
    useBusRouteStore,
    useBusStopStore, useBusTimetableGridModelStore, useBusTimetableStore
} from "../../../../stores/bus.ts"
import {
    BusRouteResponse,
    BusStopResponse,
    BusTimetableResponse,
    getBusRoutes,
    getBusStops,
    getBusTimetables
} from "../../../../service/network/bus.ts"

export function Toolbar() {
    const rowStore = useBusTimetableStore()
    const rowModesModelStore = useBusTimetableGridModelStore()
    const busRouteStore = useBusRouteStore()
    const busStopStore = useBusStopStore()
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
            rowStore.setRows(responseData.data.map((item: BusTimetableResponse) => {
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
    // Add record button click event
    const addRowButtonClicked = () => {
        const id = uuidv4()
        rowStore.setRows([
            {
                id,
                route: `${busRouteStore.rows[0].name} (${busRouteStore.rows[0].routeID})`,
                startStop: `${busStopStore.rows[0].name} (${busStopStore.rows[0].stopID})`,
                weekdays: "weekdays",
                departureTime: "00:00:00",
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
            <Button color="primary" variant="outlined" startIcon={<RefreshIcon />} onClick={fetchBusTimetable}>
                새로고침
            </Button>
            <Button color="primary" variant="contained" startIcon={<AddIcon />} onClick={addRowButtonClicked}>
                항목 추가
            </Button>
        </GridToolbarContainer>
    )
}