import { useEffect } from 'react'
import { v4 as uuidv4 } from 'uuid'
import { GridColDef } from '@mui/x-data-grid'
import { ContactCategoryGrid } from './grid.tsx'
import { useContactCategoryStore } from "../../../../stores/contact.ts"
import { ContactCategoryResponse, getContactCategoryList } from "../../../../service/network/contact.ts"


export default function ContactCategoryPage() {
    // Get the store
    const categoryStore = useContactCategoryStore()
    const fetchContactCategory = async () => {
        const response = await getContactCategoryList()
        if (response.status === 200) {
            const responseData = response.data
            categoryStore.setRows(responseData.data.map((item: ContactCategoryResponse) => {
                return {
                    id: uuidv4(),
                    categoryID: item.id,
                    name: item.name,
                    isNew: false,
                }
            }))
        }
    }
    useEffect(() => {
        fetchContactCategory().then()
    }, [])
    // Configure DataGrid
    const columns: GridColDef[] = [
        {
            field: 'categoryID',
            headerName: '카테고리 ID',
            width: 150,
            type: 'string',
            editable: true,
            headerAlign: 'center',
            align: 'center',
        },
        {
            field: 'name',
            headerName: '카테고리 이름',
            minWidth: 150,
            flex: 1,
            type: 'string',
            editable: true,
            headerAlign: 'center',
            align: 'center',
        },
    ]

    return (
        <ContactCategoryGrid columns={columns} />
    )
}