import { useEffect } from "react"
import { v4 as uuidv4 } from "uuid"
import { GridColDef } from "@mui/x-data-grid"
import { ContactGrid } from "./grid.tsx"
import { CampusResponse, getCampusList } from "../../../../service/network/campus.ts"
import { useCampusStore } from "../../../../stores/campus.ts"
import { GridContactCategoryItem, useContactCategoryStore, useContactStore } from "../../../../stores/contact.ts"
import {
    ContactCategoryResponse,
    ContactResponse,
    getContactCategoryList,
    getContactList
} from "../../../../service/network/contact.ts"


export default function CalendarEventPage() {
    // Get the store
    const campusStore = useCampusStore()
    const categoryStore = useContactCategoryStore()
    const contactStore = useContactStore()
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
        const response = await getContactList(2)
        if (response.status === 200) {
            const responseData = response.data
            contactStore.setRows(responseData.data.map((item: ContactResponse) => {
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
    useEffect(() => {
        fetchContact().then()
    }, [])
    // Configure DataGrid
    const columns: GridColDef[] = [
        {
            field: 'contactID',
            headerName: '연락처 ID',
            width: 150,
            type: 'string',
            editable: false,
            headerAlign: 'center',
            align: 'center',
        },
        {
            field: 'name',
            headerName: '연락처 이름',
            minWidth: 150,
            flex: 1,
            type: 'string',
            editable: true,
            headerAlign: 'center',
            align: 'center',
        },
        {
            field: 'phone',
            headerName: '전화번호',
            minWidth: 150,
            flex: 1,
            type: 'string',
            editable: true,
            headerAlign: 'center',
            align: 'center',
        },
        {
            field: 'category',
            headerName: '카테고리',
            minWidth: 150,
            flex: 1,
            type: 'singleSelect',
            valueOptions: categoryStore.rows.map((item: GridContactCategoryItem) => {
                return `${item.name} (${item.categoryID})`
            }),
            editable: true,
            headerAlign: 'center',
            align: 'center',
        },
        {
            field: 'campus',
            headerName: '캠퍼스',
            minWidth: 150,
            flex: 1,
            type: 'singleSelect',
            valueOptions: campusStore.rows.filter((item) => item.id === 1).map((item) => {
                return `${item.name} (${item.id})`
            }),
            editable: true,
            headerAlign: 'center',
            align: 'center',
        }
    ]

    return (
        <ContactGrid columns={columns} />
    )
}