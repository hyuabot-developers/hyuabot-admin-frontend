import { v4 as uuidv4 } from "uuid"
import { Button } from "@mui/material"
import { GridRowModes, GridToolbarContainer } from "@mui/x-data-grid"
import AddIcon from "@mui/icons-material/Add"
import RefreshIcon from '@mui/icons-material/Refresh'
import { useCafeteriaItemGridModelStore, useCafeteriaItemStore } from "../../../../stores/cafeteria.ts"
import { useCampusStore } from "../../../../stores/campus.ts"
import { CampusResponse, getCampusList } from "../../../../service/network/campus.ts"
import { CafeteriaResponse, getCafeteriaList } from "../../../../service/network/cafeteria.ts"

export function Toolbar() {
    const campusStore = useCampusStore()
    const rowStore = useCafeteriaItemStore()
    const rowModesModelStore = useCafeteriaItemGridModelStore()
    let campusList: CampusResponse[] = []
    const fetchCafeteriaList = async () => {
        const campusResponse = await getCampusList()
        if (campusResponse.status === 200) {
            const campusResponseData = campusResponse.data
            campusList = campusResponseData.data.map((item: CampusResponse) => {
                return {
                    id: item.id,
                    name: item.name,
                }
            })
            campusStore.setRows(campusList)
        }
        const response = await getCafeteriaList()
        if (response.status === 200) {
            const responseData = response.data
            rowStore.setRows(responseData.data.map((item: CafeteriaResponse) => {
                const campus = campusList.find(campus => campus.id === item.campusID)
                return {
                    id: uuidv4(),
                    cafeteriaID: item.id,
                    name: item.name,
                    campus: `${campus?.name} (${campus?.id})`,
                    latitude: item.latitude,
                    longitude: item.longitude,
                    breakfastTime: item.runningTime.breakfast,
                    lunchTime: item.runningTime.lunch,
                    dinnerTime: item.runningTime.dinner,
                }
            }))
        }
    }
    // Add record button click event
    const addRowButtonClicked = () => {
        const id = uuidv4()
        const campus = campusStore.rows.at(0)
        rowStore.setRows([
            ...rowStore.rows,
            {
                id,
                cafeteriaID: 0,
                name: "",
                campus: `${campus?.name} (${campus?.id})`,
                latitude: 0,
                longitude: 0,
                breakfastTime: "",
                lunchTime: "",
                dinnerTime: "",
                isNew: true,
            },
        ])
        rowModesModelStore.setRowModesModel(({
            ...rowModesModelStore.rowModesModel,
            [id]: { mode: GridRowModes.Edit, fieldToFocus: "cafeteriaID" },
        }))
    }

    return (
        <GridToolbarContainer style={{ display: "flex", justifyContent: "flex-end", marginTop: "10px" }}>
            <Button color="primary" variant="outlined" startIcon={<RefreshIcon />} onClick={fetchCafeteriaList}>
                새로고침
            </Button>
            <Button color="primary" variant="contained" startIcon={<AddIcon />} onClick={addRowButtonClicked}>
                항목 추가
            </Button>
        </GridToolbarContainer>
    )
}