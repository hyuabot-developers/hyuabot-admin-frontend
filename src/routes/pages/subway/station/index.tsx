import { useEffect } from "react"
import { v4 as uuidv4 } from "uuid"
import { GridColDef } from "@mui/x-data-grid"
import { SubwayStationGrid } from "./grid.tsx"
import {
    GridSubwayRoute,
    useSubwayRouteStore,
    useSubwayStationNameStore,
    useSubwayStationStore
} from "../../../../stores/subway.ts"
import {
    getSubwayRoutes,
    getSubwayStationNames,
    getSubwayStations,
    SubwayRoute,
    SubwayStation
} from "../../../../service/network/subway.ts"

export default function SubwayStationPage() {
    // Get the store
    const subwayStationNameStore = useSubwayStationNameStore()
    const subwayRouteStore = useSubwayRouteStore()
    const subwayStationStore = useSubwayStationStore()
    let routeData: GridSubwayRoute[] = []
    const fetchSubwayStation = async () => {
        // Fetch subway station name
        const stationNameResponse = await getSubwayStationNames()
        if (stationNameResponse.status === 200) {
            const responseData = stationNameResponse.data
            subwayStationNameStore.setRows(responseData.data.map((item: SubwayStation) => {
                return {
                    id: uuidv4(),
                    name: item.name,
                }
            }))
        }
        // Fetch subway route
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
        // Fetch subway station
        const stationResponse = await getSubwayStations()
        if (stationResponse.status === 200) {
            const stationData = stationResponse.data
            subwayStationStore.setRows(stationData.data.map((item: SubwayStation) => {
                return {
                    id: uuidv4(),
                    stationID: item.id,
                    routeID: item.routeID,
                    name: item.name,
                    sequence: item.sequence,
                    cumulativeTime: item.cumulativeTime,
                }
            }))
        }
    }
    useEffect(() => {
        fetchSubwayStation().then()
    }, [])
    // Configure DataGrid
    const columns: GridColDef[] = [
        {
            field: 'stationID',
            headerName: '역 ID',
            width: 150,
            type: 'string',
            editable: true,
            headerAlign: 'center',
            align: 'center',
        },
        {
            field: 'routeID',
            headerName: '노선 ID',
            width: 150,
            type: 'singleSelect',
            valueOptions: subwayRouteStore.rows.map(route => route.routeID),
            editable: true,
            headerAlign: 'center',
            align: 'center',
        },
        {
            field: 'sequence',
            headerName: '순서',
            width: 150,
            type: 'number',
            editable: true,
            headerAlign: 'center',
            align: 'center',
        },
        {
            field: 'name',
            headerName: '역 이름',
            minWidth: 250,
            flex: 1,
            type: 'singleSelect',
            valueOptions: subwayStationNameStore.rows.map(station => station.name),
            editable: true,
            headerAlign: 'center',
            align: 'center',
        },
        {
            field: 'cumulativeTime',
            headerName: '출발지 기준 분',
            width: 200,
            type: 'string',
            editable: true,
            headerAlign: 'center',
            align: 'center',
        },
    ]

    return (
        <SubwayStationGrid columns={columns} />
    )
}