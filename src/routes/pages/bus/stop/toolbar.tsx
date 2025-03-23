import { v4 as uuidv4 } from "uuid"
import { Button } from "@mui/material"
import {
    GridRowModes,
    GridToolbarContainer
} from "@mui/x-data-grid"


import AddIcon from "@mui/icons-material/Add"
import RefreshIcon from '@mui/icons-material/Refresh'
import {
    useBusStopGridModelStore,
    useBusStopStore
} from "../../../../stores/bus.ts"
import { BusStopResponse, getBusStops } from "../../../../service/network/bus.ts"


export function Toolbar() {
    const rowStore = useBusStopStore()
    const rowModesModelStore = useBusStopGridModelStore()
    const fetchBusStop = async () => {
        const response = await getBusStops()
        if (response.status === 200) {
            const responseData = response.data
            rowStore.setRows(responseData.data.map((item: BusStopResponse) => {
                return {
                    id: uuidv4(),
                    stopID: item.id,
                    name: item.name,
                    latitude: item.latitude,
                    longitude: item.longitude,
                    district: item.district,
                    mobileNumber: item.mobileNumber,
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
                stopID: 0,
                name: "",
                latitude: 0,
                longitude: 0,
                district: 2,
                mobileNumber: "",
                isNew: true,
            },
            ...rowStore.rows,
        ])
        rowModesModelStore.setRowModesModel(({
            ...rowModesModelStore.rowModesModel,
            [id]: { mode: GridRowModes.Edit, fieldToFocus: "name" },
        }))
    }
    return (
        <GridToolbarContainer style={{ display: "flex", justifyContent: "flex-end", marginTop: "10px" }}>
            <Button color="primary" variant="outlined" startIcon={<RefreshIcon />} onClick={fetchBusStop}>
                새로고침
            </Button>
            <Button color="primary" variant="contained" startIcon={<AddIcon />} onClick={addRowButtonClicked}>
                항목 추가
            </Button>
        </GridToolbarContainer>
    )
}