import AddIcon from '@mui/icons-material/Add'
import { Autocomplete, TextField } from '@mui/material'
import { GridRowModes, Toolbar, ToolbarButton } from '@mui/x-data-grid'
import { useEffect } from 'react'
import { v4 as uuidv4 } from 'uuid'

import {
    getShuttleRoute,
    getShuttleTimetable,
    ShuttleRouteResponse,
    ShuttleTimetableResponse
} from '../../../../service/network/shuttle.ts'
import {
    useShuttleTimetableStore,
    useShuttleTimetableGridModelStore,
    useShuttleRouteStore, useSelectedShuttleRouteStore
} from '../../../../stores/shuttle.ts'


export const GridToolbar = () => {
    const routeStore = useShuttleRouteStore()
    const rowStore = useShuttleTimetableStore()
    const rowModesModelStore = useShuttleTimetableGridModelStore()
    const selectedRouteStore = useSelectedShuttleRouteStore()
    const fetchShuttleRoute = async () => {
        const response = await getShuttleRoute()
        if (response.status === 200) {
            const responseData = response.data
            routeStore.setRows(responseData.result.map((item: ShuttleRouteResponse) => {
                return {
                    id: uuidv4(),
                    name: item.name,
                    tag: item.tag,
                    korean: item.descriptionKorean,
                    english: item.descriptionEnglish,
                    start: item.startStopID,
                    end: item.endStopID,
                }
            }))
        }
    }
    const fetchShuttleTimetable = async (routeName: string) => {
        const response = await getShuttleTimetable(routeName)
        if (response.status === 200) {
            const responseData = response.data
            rowStore.setRows(responseData.result.map((item: ShuttleTimetableResponse) => {
                return {
                    id: uuidv4(),
                    seq: item.seq,
                    period: item.period,
                    weekdays: item.weekdays,
                    time: item.departureTime,
                }
            }))
        }
    }
    const onChangeSelectedRoute = (value: string | null) => {
        if (value) {
            selectedRouteStore.setSelectedRoute(value)
            fetchShuttleTimetable(value).then()
        }
    }
    // Add record button click event
    const addRowButtonClicked = () => {
        const id = uuidv4()
        rowStore.setRows([
            {
                id,
                seq: null,
                period: '',
                weekdays: true,
                time: '00:00:00',
                isNew: true,
            },
            ...rowStore.rows,
        ])
        rowModesModelStore.setRowModesModel(({
            ...rowModesModelStore.rowModesModel,
            [id]: { mode: GridRowModes.Edit, fieldToFocus: 'period' },
        }))
    }
    useEffect(() => {
        fetchShuttleRoute().then()
    }, [])
    return (
        <Toolbar style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '10px' }}>
            <Autocomplete
                size="small"
                disablePortal={true}
                options={routeStore.rows.map((route) => route.name)}
                sx={{ width: 300, marginRight: 2 }}
                renderInput={(params) => <TextField {...params} label="셔틀버스 노선" />}
                onChange={(_, value) => onChangeSelectedRoute(value)}
            />
            <ToolbarButton onClick={addRowButtonClicked}>
                <AddIcon />
            </ToolbarButton>
        </Toolbar>
    )
}