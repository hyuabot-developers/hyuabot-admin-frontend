import { v4 as uuidv4 } from "uuid"
import { Button } from "@mui/material"
import { GridRowModes, GridToolbarContainer } from "@mui/x-data-grid"


import AddIcon from "@mui/icons-material/Add"
import RefreshIcon from '@mui/icons-material/Refresh'
import {
    GridSubwayRoute,
    useSubwayRouteStore, useSubwayStationGridModelStore,
    useSubwayStationNameStore,
    useSubwayStationStore
} from "../../../../stores/subway.ts"
import {
    getSubwayRoutes,
    getSubwayStationNames, getSubwayStations,
    SubwayRoute,
    SubwayStation
} from "../../../../service/network/subway.ts"

export function Toolbar() {
    // Get the store
    const subwayStationNameStore = useSubwayStationNameStore()
    const subwayRouteStore = useSubwayRouteStore()
    const rowStore = useSubwayStationStore()
    const rowModesModelStore = useSubwayStationGridModelStore()
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
            rowStore.setRows(stationData.data.map((item: SubwayStation) => {
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
    // Add record button click event
    const addRowButtonClicked = () => {
        const id = uuidv4()
        rowStore.setRows([
            {
                id,
                stationID: "",
                routeID: subwayRouteStore.rows[0].routeID,
                name: "",
                sequence: 0,
                cumulativeTime: "00:00:00",
                isNew: true,
            },
            ...rowStore.rows,
        ])
        rowModesModelStore.setRowModesModel(({
            ...rowModesModelStore.rowModesModel,
            [id]: { mode: GridRowModes.Edit, fieldToFocus: "stationID" },
        }))
    }

    return (
        <GridToolbarContainer style={{ display: "flex", justifyContent: "flex-end", marginTop: "10px" }}>
            <Button color="primary" variant="outlined" startIcon={<RefreshIcon />} onClick={fetchSubwayStation}>
                새로고침
            </Button>
            <Button color="primary" variant="contained" startIcon={<AddIcon />} onClick={addRowButtonClicked}>
                항목 추가
            </Button>
        </GridToolbarContainer>
    )
}