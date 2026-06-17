import AddIcon from '@mui/icons-material/Add'
import RefreshIcon from '@mui/icons-material/Refresh'
import SearchIcon from '@mui/icons-material/Search'
import { GridRowModes, Toolbar, ToolbarButton } from '@mui/x-data-grid'
import { useState } from 'react'
import { v4 as uuidv4 } from 'uuid'

import { GbisRouteDialog } from './GbisRouteDialog.tsx'
import { BusRouteResponse, BusStopResponse, getBusRoutes, getBusStops } from '../../../../service/network/bus.ts'
import { BusStop, useBusRouteGridModelStore, useBusRouteStore } from '../../../../stores/bus.ts'

export const GridToolbar = () => {
    const rowStore = useBusRouteStore()
    const rowModesModelStore = useBusRouteGridModelStore()
    const [dialogOpen, setDialogOpen] = useState(false)

    const fetchBusRoute = async () => {
        const stopResponse = await getBusStops()
        let stopData: BusStop[] = []
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
        const routeResponse = await getBusRoutes()
        if (routeResponse.status === 200) {
            const responseData = routeResponse.data
            rowStore.setRows(responseData.result.map((item: BusRouteResponse) => {
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
            }))
        }
    }

    const addRowButtonClicked = () => {
        const { stops } = useBusRouteStore.getState()
        if (!stops.length) return
        const id = uuidv4()
        rowStore.setRows([
            {
                id,
                routeID: 0,
                name: '',
                type: '',
                startStop: `${stops[0].name} (${stops[0].stopID})`,
                endStop: `${stops[0].name} (${stops[0].stopID})`,
                companyID: 0,
                companyName: '',
                companyTelephone: '',
                upFirstTime: '',
                upLastTime: '',
                downFirstTime: '',
                downLastTime: '',
                isNew: true,
            },
            ...rowStore.rows,
        ])
        rowModesModelStore.setRowModesModel(({
            ...rowModesModelStore.rowModesModel,
            [id]: { mode: GridRowModes.Edit, fieldToFocus: 'name' },
        }))
    }

    return (
        <Toolbar style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '10px' }}>
            <ToolbarButton onClick={() => setDialogOpen(true)}>
                <SearchIcon />
            </ToolbarButton>
            <ToolbarButton onClick={fetchBusRoute}>
                <RefreshIcon />
            </ToolbarButton>
            <ToolbarButton onClick={addRowButtonClicked}>
                <AddIcon />
            </ToolbarButton>
            <GbisRouteDialog
                open={dialogOpen}
                onClose={() => setDialogOpen(false)}
                onSuccess={fetchBusRoute}
                existingStopIDs={useBusRouteStore.getState().stops.map((s) => s.stopID)}
            />
        </Toolbar>
    )
}
