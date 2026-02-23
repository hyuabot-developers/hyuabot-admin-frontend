import RefreshIcon from '@mui/icons-material/Refresh'
import { Toolbar, ToolbarButton } from '@mui/x-data-grid'
import { v4 as uuidv4 } from 'uuid'

import {
    SubwayRealtime,
    SubwayRoute,
    SubwayStation,
    getSubwayRealtime,
    getSubwayRoutes,
    getSubwayStations
} from '../../../../service/network/subway.ts'
import {
    useSubwayRealtimeStore,
} from '../../../../stores/subway.ts'


export const GridToolbar = () => {
    // Get the store
    const rowStore = useSubwayRealtimeStore()
    // Fetch Subway realtime
    const fetchSubwayRealtime = async () => {
        // Fetch Subway station
        const stationResponse = await getSubwayStations()
        if (stationResponse.status === 200) {
            const responseData = stationResponse.data
            rowStore.setStations(responseData.result.map((item: SubwayStation) => {
                return {
                    id: item.id,
                    routeID: item.routeID,
                    name: item.name,
                    order: item.order,
                    cumulativeTime: item.cumulativeTime,
                }
            }))
        }
        // Fetch Subway route
        const routeResponse = await getSubwayRoutes()
        if (routeResponse.status === 200) {
            const responseData = routeResponse.data
            rowStore.setRoutes(responseData.result.map((item: SubwayRoute) => {
                return {
                    id: item.id,
                    name: item.name,
                }
            }))
        }
        // Fetch Subway realtime
        const realtimeResponse = await getSubwayRealtime()
        if (realtimeResponse.status === 200) {
            const responseData = realtimeResponse.data
            rowStore.setRows(responseData.result.map((item: SubwayRealtime) => {
                const { stations } = useSubwayRealtimeStore.getState()
                const departureStation = stations.find((station) => station.id === item.stationID)
                const terminalStation = stations.find((station) => station.id === item.terminalStationID)
                return {
                    id: uuidv4(),
                    sortableId: `${departureStation ? departureStation.id : ''}-${item.direction}-${item.time}`,
                    station: departureStation ? `${departureStation.name} (${departureStation.id})` : '',
                    direction: item.direction,
                    order: item.order,
                    location: item.location,
                    stop: item.stop,
                    time: item.time,
                    terminalStation: terminalStation ? `${terminalStation.name} (${terminalStation.id})` : '',
                    trainNumber: item.trainNumber,
                    updateTime: item.updateTime,
                    isExpress: item.isExpress,
                    isLast: item.isLast,
                    status: item.status,
                    isNew: false,
                }
            }))
        }
    }
    return (
        <Toolbar style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '10px' }}>
            <ToolbarButton onClick={fetchSubwayRealtime}>
                <RefreshIcon />
            </ToolbarButton>
        </Toolbar>
    )
}