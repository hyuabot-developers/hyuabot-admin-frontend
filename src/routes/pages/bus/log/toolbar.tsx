import RefreshIcon from '@mui/icons-material/Refresh'
import { Autocomplete, TextField } from '@mui/material'
import { Toolbar, ToolbarButton } from '@mui/x-data-grid'
import { v4 as uuidv4 } from 'uuid'

import {
    BusDepartureLogResponse,
    BusRouteStopResponse,
    getBusDepartureLogs,
    getBusRouteStops
} from '../../../../service/network/bus.ts'
import { useBusDepartureLogStore } from '../../../../stores/bus.ts'

export const GridToolbar = () => {
    const rowStore = useBusDepartureLogStore()

    const fetchBusStops = async (routeID: number) => {
        const response = await getBusRouteStops(routeID)
        if (response.status === 200) {
            const responseData = response.data
            const { stops } = useBusDepartureLogStore.getState()
            rowStore.setRouteStops(responseData.result.map((item: BusRouteStopResponse) => {
                const stop = stops.find((s) => s.stopID === item.stopID)
                const startStop = stops.find((s) => s.stopID === item.startStopID)
                return {
                    id: uuidv4(),
                    seq: item.seq,
                    stop: `${stop?.name} (${stop?.stopID})`,
                    order: item.order,
                    startStop: `${startStop?.name} (${startStop?.stopID})`,
                    travelTime: item.travelTime,
                    isNew: false,
                }
            }))
        }
    }

    const fetchBusDepartureLog = async (routeID: number, stopSeq: number) => {
        const response = await getBusDepartureLogs(routeID, stopSeq)
        if (response.status === 200) {
            const responseData = response.data
            rowStore.setRows(responseData.result.map((item: BusDepartureLogResponse) => {
                return {
                    id: uuidv4(),
                    vehicleID: item.vehicleID,
                    timestamp: `${item.date} ${item.time}`,
                }
            }))
        }
    }

    const onChangeSelectedRoute = (routeID: number) => {
        if (routeID === 0) {
            rowStore.setSelectedRouteID(null)
            rowStore.setSelectedStopID(null)
            rowStore.setRows([])
            return
        }
        rowStore.setSelectedRouteID(routeID)
        fetchBusStops(routeID).then()
    }

    const onChangeSelectedStop = (stopSeq: number) => {
        if (stopSeq === 0) {
            rowStore.setSelectedStopID(null)
            rowStore.setRows([])
            return
        }
        rowStore.setSelectedStopID(stopSeq)
        fetchBusDepartureLog(rowStore.selectedRouteID || 0, stopSeq).then()
    }

    return (
        <Toolbar style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '10px' }}>
            <Autocomplete
                size="small"
                disablePortal={true}
                options={rowStore.routes.map((route) => route.name)}
                sx={{ width: 300, marginRight: 2 }}
                renderInput={(params) => <TextField {...params} label="버스 노선" />}
                onChange={(_, value) => onChangeSelectedRoute(
                    rowStore.routes.find((route) => route.name === value)?.routeID || 0
                )}
            />
            <Autocomplete
                size="small"
                disablePortal={true}
                options={rowStore.routeStops.map((stop) => stop.stop)}
                sx={{ width: 300, marginRight: 2 }}
                renderInput={(params) => <TextField {...params} label="버스 정류장" />}
                onChange={(_, value) => onChangeSelectedStop(
                    rowStore.routeStops.find((stop) => stop.stop === value)?.seq || 0
                )}
            />
            <ToolbarButton>
                <RefreshIcon />
            </ToolbarButton>
        </Toolbar>
    )
}