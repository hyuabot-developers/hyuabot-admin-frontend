import AddIcon from '@mui/icons-material/Add'
import SearchIcon from '@mui/icons-material/Search'
import { Autocomplete, TextField } from '@mui/material'
import { GridRowModes, Toolbar, ToolbarButton } from '@mui/x-data-grid'
import { useEffect, useState } from 'react'
import { v4 as uuidv4 } from 'uuid'

import { GbisRouteStopDialog } from './GbisRouteStopDialog.tsx'
import {
    BusRouteResponse, BusRouteStopResponse,
    BusStopResponse,
    getBusRoutes,
    getBusRouteStops,
    getBusStops
} from '../../../../service/network/bus.ts'
import {
    BusRoute,
    BusStop,
    useBusRouteStopGridModelStore,
    useBusRouteStopStore,
} from '../../../../stores/bus.ts'
import { reportError } from '../../../../utility/reportError.ts'

export const GridToolbar = () => {
    const rowStore = useBusRouteStopStore()
    const rowModesModelStore = useBusRouteStopGridModelStore()
    const [dialogOpen, setDialogOpen] = useState(false)
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
                const { stops } = useBusRouteStopStore.getState()
                const startStop = stops.find((stop) => stop.stopID === item.startStopID)
                const endStop = stops.find((stop) => stop.stopID === item.endStopID)
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

    const fetchStopsByRoute = async (routeID: number) => {
        const response = await getBusRouteStops(routeID)
        if (response.status === 200) {
            const responseData = response.data
            const { stops } = useBusRouteStopStore.getState()
            rowStore.setRows(responseData.result.map((item: BusRouteStopResponse) => {
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
    const onChangeSelectedRoute = (value: number) => {
        if (value) {
            rowStore.setSelectedRouteID(value)
            fetchStopsByRoute(value).catch(reportError)
        }
    }
    // Add record button click event
    const addRowButtonClicked = () => {
        const { stops } = useBusRouteStopStore.getState()
        if (!stops.length) return
        const id = uuidv4()
        rowStore.setRows([
            {
                id,
                seq: null,
                stop: `${stops[0].name} (${stops[0].stopID})`,
                order: 1,
                startStop: `${stops[0].name} (${stops[0].stopID})`,
                travelTime: 0,
                isNew: true,
            },
            ...rowStore.rows,
        ])
        rowModesModelStore.setRowModesModel(({
            ...rowModesModelStore.rowModesModel,
            [id]: { mode: GridRowModes.Edit, fieldToFocus: 'name' },
        }))
    }
    useEffect(() => {
        fetchBusRouteStop().catch(reportError)
    }, [])
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
            <ToolbarButton
                onClick={() => setDialogOpen(true)}
                disabled={!rowStore.selectedRouteID}
            >
                <SearchIcon />
            </ToolbarButton>
            <ToolbarButton onClick={addRowButtonClicked}>
                <AddIcon />
            </ToolbarButton>
            <GbisRouteStopDialog
                open={dialogOpen}
                onClose={() => setDialogOpen(false)}
                onSuccess={() => rowStore.selectedRouteID && fetchStopsByRoute(rowStore.selectedRouteID)}
                routeID={rowStore.selectedRouteID ?? 0}
            />
        </Toolbar>
    )
}
