import { v4 as uuidv4 } from "uuid"
import { Button } from "@mui/material"
import {
    GridRowModes,
    GridToolbarContainer
} from "@mui/x-data-grid"


import AddIcon from "@mui/icons-material/Add"
import RefreshIcon from '@mui/icons-material/Refresh'
import { useSubwayStationNameGridModelStore, useSubwayStationNameStore } from "../../../../stores/subway.ts"
import { getSubwayStationNames, SubwayStationName } from "../../../../service/network/subway.ts"


export function Toolbar() {
    const rowStore = useSubwayStationNameStore()
    const rowModesModelStore = useSubwayStationNameGridModelStore()
    const fetchSubwayStationName = async () => {
        const response = await getSubwayStationNames()
        if (response.status === 200) {
            const responseData = response.data
            rowStore.setRows(responseData.data.map((item: SubwayStationName) => {
                return {
                    id: uuidv4(),
                    name: item.name,
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
                name: "",
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
            <Button color="primary" variant="outlined" startIcon={<RefreshIcon />} onClick={fetchSubwayStationName}>
                새로고침
            </Button>
            <Button color="primary" variant="contained" startIcon={<AddIcon />} onClick={addRowButtonClicked}>
                항목 추가
            </Button>
        </GridToolbarContainer>
    )
}