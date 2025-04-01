import { v4 as uuidv4 } from "uuid"
import { Button } from "@mui/material"
import { GridRowModes, GridToolbarContainer } from "@mui/x-data-grid"
import AddIcon from "@mui/icons-material/Add"
import RefreshIcon from '@mui/icons-material/Refresh'
import { useCampusStore } from "../../../../stores/campus.ts"
import { CampusResponse, getCampusList } from "../../../../service/network/campus.ts"
import {
    GridContactCategoryItem,
    useContactCategoryStore,
    useContactGridModelStore,
    useContactStore
} from "../../../../stores/contact.ts"
import {
    ContactCategoryResponse,
    ContactResponse,
    getContactCategoryList,
    getContactList
} from "../../../../service/network/contact.ts"

export function Toolbar() {
    // Get the store
    const rowModesModelStore = useContactGridModelStore()
    const campusStore = useCampusStore()
    const categoryStore = useContactCategoryStore()
    const rowStore = useContactStore()
    let campusList: CampusResponse[] = []
    let categoryList: GridContactCategoryItem[] = []
    const fetchContact = async () => {
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
        const categoryResponse = await getContactCategoryList()
        if (categoryResponse.status === 200) {
            const categoryResponseData = categoryResponse.data
            categoryList = categoryResponseData.data.map((item: ContactCategoryResponse) => {
                return {
                    id: uuidv4(),
                    categoryID: item.id,
                    name: item.name,
                }
            })
            categoryStore.setRows(categoryList)
        }
        const response = await getContactList(1)
        if (response.status === 200) {
            const responseData = response.data
            rowStore.setRows(responseData.data.map((item: ContactResponse) => {
                const campus = campusList.find(campus => campus.id === item.campusID)
                const category = categoryList.find(category => category.categoryID === item.categoryID)
                return {
                    id: uuidv4(),
                    contactID: item.id,
                    name: item.name,
                    phone: item.phone,
                    category: `${category?.name} (${category?.categoryID})`,
                    campus: `${campus?.name} (${campus?.id})`,
                }
            }))
        }
    }
    // Add record button click event
    const addRowButtonClicked = () => {
        const id = uuidv4()
        const campus = campusStore.rows.at(0)
        const category = categoryStore.rows.at(0)
        rowStore.setRows([
            ...rowStore.rows,
            {
                id,
                contactID: 0,
                name: "",
                phone: "",
                category: `${category?.name} (${category?.categoryID})`,
                campus: `${campus?.name} (${campus?.id})`,
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
            <Button color="primary" variant="outlined" startIcon={<RefreshIcon />} onClick={fetchContact}>
                새로고침
            </Button>
            <Button color="primary" variant="contained" startIcon={<AddIcon />} onClick={addRowButtonClicked}>
                항목 추가
            </Button>
        </GridToolbarContainer>
    )
}