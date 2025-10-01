import AddIcon from '@mui/icons-material/Add'
import RefreshIcon from '@mui/icons-material/Refresh'
import { Autocomplete, TextField } from '@mui/material'
import { GridRowModes, Toolbar, ToolbarButton } from '@mui/x-data-grid'
import { v4 as uuidv4 } from 'uuid'

import { BusTimetableResponse, getBusTimetables } from '../../../../service/network/bus.ts'
import { useBusTimetableGridModelStore, useBusTimetableStore } from '../../../../stores/bus.ts'

export const GridToolbar = () => {
    const rowStore = useBusTimetableStore()
    const rowModesModelStore = useBusTimetableGridModelStore()

    const fetchBusTimetable = async (routeID: number, startStopID: number) => {
        const timetableResponse = await getBusTimetables(routeID, startStopID)
        if (timetableResponse.status === 200) {
            const responseData = timetableResponse.data
            rowStore.setRows(responseData.result.map((item: BusTimetableResponse) => {
                return {
                    id: uuidv4(),
                    seq: item.seq,
                    dayType: item.dayType,
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
                seq: null,
                dayType: 'weekdays',
                departureTime: '00:00:00',
                isNew: true,
            },
            ...rowStore.rows,
        ])
        rowModesModelStore.setRowModesModel(({
            ...rowModesModelStore.rowModesModel,
            [id]: { mode: GridRowModes.Edit, fieldToFocus: 'dayType' },
        }))
    }

    const onChangeSelectedRoute = (routeID: number) => {
        if (routeID === 0) {
            rowStore.setSelectedRouteID(null)
            rowStore.setSelectedStopID(null)
            rowStore.setRows([])
            return
        }
        rowStore.setSelectedRouteID(routeID)
        rowStore.setSelectedStopID(null)
        const route = rowStore.routes.find((r) => r.routeID === routeID)
        if (route) {
            rowStore.setRouteStops(
                rowStore.stops.filter((stop) => (
                    stop.stopID === parseInt(route.startStop.split('(')[1].split(')')[0]) ||
                    stop.stopID === parseInt(route.endStop.split('(')[1].split(')')[0])
                ))
            )
        }
    }

    const onChangeSelectedStop = (stopSeq: number) => {
        if (stopSeq === 0) {
            rowStore.setSelectedStopID(null)
            rowStore.setRows([])
            return
        }
        rowStore.setSelectedStopID(stopSeq)
        fetchBusTimetable(rowStore.selectedRouteID || 0, stopSeq).then()
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
                options={rowStore.routeStops.map((stop) => stop.name)}
                sx={{ width: 300, marginRight: 2 }}
                renderInput={(params) => <TextField {...params} label="버스 정류장" />}
                onChange={(_, value) => onChangeSelectedStop(
                    rowStore.routeStops.find((stop) => stop.name === value)?.stopID || 0
                )}
            />
            <ToolbarButton onClick={addRowButtonClicked}>
                <AddIcon />
            </ToolbarButton>
            <ToolbarButton onClick={() => {
                if (rowStore.selectedRouteID && rowStore.selectedStopID) {
                    fetchBusTimetable(rowStore.selectedRouteID, rowStore.selectedStopID).then()
                }
            }}>
                <RefreshIcon />
            </ToolbarButton>
        </Toolbar>
    )
}