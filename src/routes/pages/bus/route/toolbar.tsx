import { v4 as uuidv4 } from "uuid"
import { Button } from "@mui/material"
import { GridRowModes, GridToolbarContainer } from "@mui/x-data-grid"


import AddIcon from "@mui/icons-material/Add"
import RefreshIcon from '@mui/icons-material/Refresh'
import { useBusRouteGridModelStore, useBusRouteStore, useBusStopStore } from "../../../../stores/bus.ts"
import { BusRouteResponse, getBusRoutes } from "../../../../service/network/bus.ts"

export function Toolbar() {
    const rowStore = useBusRouteStore()
    const rowModesModelStore = useBusRouteGridModelStore()
    const busStopStore = useBusStopStore()
    const fetchShuttleRoute = async () => {
        const response = await getBusRoutes()
        if (response.status === 200) {
            const responseData = response.data
            rowStore.setRows(responseData.data.map((item: BusRouteResponse) => {
                return {
                    id: uuidv4(),
                    routeID: item.id,
                    name: item.name,
                    type: item.type,
                    startStopID: item.start,
                    endStopID: item.end,
                    companyID: item.company.id,
                    companyName: item.company.name,
                    companyTelephone: item.company.telephone,
                    upFirstTime: item.up.first,
                    upLastTime: item.up.last,
                    downFirstTime: item.down.first,
                    downLastTime: item.down.last,
                }
            }))
        }
    }
    // Add record button click event
    const addRowButtonClicked = () => {
        const id = uuidv4()
        rowStore.setRows([
            ...rowStore.rows,
            {
                id,
                routeID: 0,
                name: "",
                type: "",
                startStopID: busStopStore.rows[0].stopID,
                endStopID: busStopStore.rows[0].stopID,
                companyID: 0,
                companyName: "",
                companyTelephone: "",
                upFirstTime: "",
                upLastTime: "",
                downFirstTime: "",
                downLastTime: "",
                isNew: true,
            },
        ])
        rowModesModelStore.setRowModesModel(({
            ...rowModesModelStore.rowModesModel,
            [id]: { mode: GridRowModes.Edit, fieldToFocus: "name" },
        }))
    }

    return (
        <GridToolbarContainer style={{ display: "flex", justifyContent: "flex-end", marginTop: "10px" }}>
            <Button color="primary" variant="outlined" startIcon={<RefreshIcon />} onClick={fetchShuttleRoute}>
                새로고침
            </Button>
            <Button color="primary" variant="contained" startIcon={<AddIcon />} onClick={addRowButtonClicked}>
                항목 추가
            </Button>
        </GridToolbarContainer>
    )
}