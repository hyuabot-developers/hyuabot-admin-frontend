import { v4 as uuidv4 } from "uuid"
import { Button } from "@mui/material"
import { GridToolbarContainer } from "@mui/x-data-grid"
import RefreshIcon from '@mui/icons-material/Refresh'
import {
    GridSubwayRoute,
    GridSubwayStation,
    useSubwayRealtimeStore,
    useSubwayRouteStore,
    useSubwayStationStore
} from "../../../../stores/subway.ts"
import {
    SubwayRealtime,
    SubwayRoute,
    SubwayStation,
    getSubwayRealtime,
    getSubwayRoutes,
    getSubwayStations
} from "../../../../service/network/subway.ts"


export function Toolbar() {
    const rowStore = useSubwayRealtimeStore()
    const subwayRouteStore = useSubwayRouteStore()
    const subwayStationStore = useSubwayStationStore()
    let stationData: GridSubwayStation[] = []
    let routeData: GridSubwayRoute[]
    // Fetch Subway realtime
    const fetchSubwayRealtime = async () => {
        // Fetch Subway station
        const stationResponse = await getSubwayStations()
        if (stationResponse.status === 200) {
            const responseData = stationResponse.data
            stationData = responseData.data.map((item: SubwayStation) => {
                return {
                    id: uuidv4(),
                    stationID: item.id,
                    routeID: item.routeID,
                    name: item.name,
                    sequence: item.sequence,
                    cumulativeTime: item.cumulativeTime,
                }
            })
            subwayStationStore.setRows(stationData)
        }
        // Fetch Subway route
        const routeResponse = await getSubwayRoutes()
        if (routeResponse.status === 200) {
            const responseData = routeResponse.data
            routeData = responseData.data.map((item: SubwayRoute) => {
                return {
                    id: uuidv4(),
                    routeID: item.id,
                    name: item.name,
                }
            })
            subwayRouteStore.setRows(routeData)
        }
        // Fetch Subway realtime
        const realtimeResponse = await getSubwayRealtime()
        if (realtimeResponse.status === 200) {
            const responseData = realtimeResponse.data
            rowStore.setRows(responseData.data.map((item: SubwayRealtime) => {
                const departureStation = stationData.find(station => station.stationID === item.stationID)
                const terminalStation = stationData.find(station => station.stationID === item.terminalStationID)
                const routeName = routeData.find(route => route.routeID === departureStation?.routeID)?.name
                return {
                    id: uuidv4(),
                    sortID: `${item.stationID}-${headingSortFormatter(item.heading)}-${item.sequence}`,
                    stationName: departureStation?.name,
                    routeName: routeName,
                    sequence: item.sequence,
                    current: item.current,
                    heading: item.heading,
                    station: item.station,
                    time: item.time,
                    trainNumber: item.trainNumber,
                    express: item.express,
                    last: item.last,
                    terminalStationName: terminalStation?.name,
                    status: item.status,
                }
            }))
        }
    }
    const headingSortFormatter = (value: string) => {
        if (value == 'true') { return 1 }
        else if (value == 'false') { return 2 }
        else { return -1 }
    }
    return (
        <GridToolbarContainer style={{ display: "flex", justifyContent: "flex-end", marginTop: "10px" }}>
            <Button color="primary" variant="outlined" startIcon={<RefreshIcon />} onClick={fetchSubwayRealtime}>
                새로고침
            </Button>
        </GridToolbarContainer>
    )
}