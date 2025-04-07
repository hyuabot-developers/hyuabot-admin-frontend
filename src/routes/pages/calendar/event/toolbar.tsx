import { v4 as uuidv4 } from "uuid"
import { Button } from "@mui/material"
import { GridRowModes, GridToolbarContainer } from "@mui/x-data-grid"
import AddIcon from "@mui/icons-material/Add"
import RefreshIcon from '@mui/icons-material/Refresh'
import {
    GridCalendarCategoryItem,
    useCalendarCategoryStore,
    useCalendarGridModelStore,
    useCalendarStore
} from "../../../../stores/calendar.ts"
import {
    CalendarCategoryResponse,
    CalendarResponse,
    getCalendarCategoryList,
    getCalendarList
} from "../../../../service/network/calendar.ts"


export function Toolbar() {
    // Get the store
    const rowModesModelStore = useCalendarGridModelStore()
    const categoryStore = useCalendarCategoryStore()
    const rowStore = useCalendarStore()
    let categoryList: GridCalendarCategoryItem[] = []
    const fetchCalendar = async () => {
        const categoryResponse = await getCalendarCategoryList()
        if (categoryResponse.status === 200) {
            const categoryResponseData = categoryResponse.data
            categoryList = categoryResponseData.data.map((item: CalendarCategoryResponse) => {
                return {
                    id: uuidv4(),
                    categoryID: item.id,
                    name: item.name,
                }
            })
            categoryStore.setRows(categoryList)
        }
        const response = await getCalendarList()
        if (response.status === 200) {
            const responseData = response.data
            rowStore.setRows(responseData.data.map((item: CalendarResponse) => {
                const category = categoryList.find(category => category.categoryID === item.categoryID)
                return {
                    id: uuidv4(),
                    eventID: item.id,
                    category: `${category?.name} (${category?.categoryID})`,
                    title: item.title,
                    description: item.description,
                    start: item.start,
                    end: item.end,
                }
            }))
        }
    }
    // Add record button click event
    const addRowButtonClicked = () => {
        const id = uuidv4()
        const category = categoryStore.rows.at(0)
        rowStore.setRows([
            {
                id,
                eventID: rowStore.rows.length ? rowStore.rows[rowStore.rows.length - 1].eventID + 1 : 1,
                category: `${category?.name} (${category?.categoryID})`,
                title: "",
                description: "",
                start: "2999-12-31",
                end: "2999-12-31",
                isNew: true,
            },
            ...rowStore.rows,
        ])
        rowModesModelStore.setRowModesModel(({
            ...rowModesModelStore.rowModesModel,
            [id]: { mode: GridRowModes.Edit, fieldToFocus: "title" },
        }))
    }

    return (
        <GridToolbarContainer style={{ display: "flex", justifyContent: "flex-end", marginTop: "10px" }}>
            <Button color="primary" variant="outlined" startIcon={<RefreshIcon />} onClick={fetchCalendar}>
                새로고침
            </Button>
            <Button color="primary" variant="contained" startIcon={<AddIcon />} onClick={addRowButtonClicked}>
                항목 추가
            </Button>
        </GridToolbarContainer>
    )
}