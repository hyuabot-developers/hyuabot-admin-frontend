import { v4 as uuidv4 } from "uuid"
import { Button } from "@mui/material"
import { GridToolbarContainer } from "@mui/x-data-grid"
import RefreshIcon from '@mui/icons-material/Refresh'
import {
    GridCafeteriaItem,
    useCafeteriaItemStore, useCafeteriaMenuStore
} from "../../../../stores/cafeteria.ts"
import {
    CafeteriaMenuResponse,
    CafeteriaResponse,
    getCafeteriaList,
    getCafeteriaMenuList
} from "../../../../service/network/cafeteria.ts"

export function Toolbar() {
    const cafeteriaStore = useCafeteriaItemStore()
    const rowStore = useCafeteriaMenuStore()
    let cafeteriaList: Array<GridCafeteriaItem> = []
    const fetchCafeteriaMenu = async () => {
        const campusResponse = await getCafeteriaList()
        if (campusResponse.status === 200) {
            const campusResponseData = campusResponse.data
            cafeteriaList = campusResponseData.data.map((item: CafeteriaResponse) => {
                return {
                    id: uuidv4(),
                    cafeteriaID: item.id,
                    name: item.name,
                    campus: '',
                    latitude: item.latitude,
                    longitude: item.longitude,
                    breakfastTime: item.runningTime.breakfast,
                    lunchTime: item.runningTime.lunch,
                    dinnerTime: item.runningTime.dinner,
                }
            })
            cafeteriaStore.setRows(cafeteriaList)
        }
        const response = await getCafeteriaMenuList()
        if (response.status === 200) {
            const responseData = response.data
            rowStore.setRows(responseData.data.map((item: CafeteriaMenuResponse) => {
                const cafeteria = cafeteriaList.find(cafeteria => cafeteria.cafeteriaID === item.cafeteriaID)
                return {
                    id: uuidv4(),
                    date: item.date,
                    time: item.time,
                    cafeteria: `${cafeteria?.name} (${cafeteria?.cafeteriaID})`,
                    name: item.menu,
                    price: item.price,
                    isNew: false,
                }
            }))
        }
    }
    return (
        <GridToolbarContainer style={{ display: "flex", justifyContent: "flex-end", marginTop: "10px" }}>
            <Button color="primary" variant="outlined" startIcon={<RefreshIcon />} onClick={fetchCafeteriaMenu}>
                새로고침
            </Button>
        </GridToolbarContainer>
    )
}