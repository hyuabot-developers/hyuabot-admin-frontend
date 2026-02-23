import { GridColDef } from '@mui/x-data-grid'
import { useEffect } from 'react'
import { v4 as uuidv4 } from 'uuid'

import { ContactGrid } from './grid.tsx'
import {
    ContactCategoryResponse,
    ContactResponse,
    getContactCategoryList,
    getContactList
} from '../../../../service/network/contact.ts'
import { useContactStore } from '../../../../stores/contact.ts'


export default function ERICAContactPage() {
    // Get the store
    const rowStore = useContactStore()
    const fetchContact = async () => {
        const categoryResponse = await getContactCategoryList()
        if (categoryResponse.status === 200) {
            const categoryResponseData = categoryResponse.data
            rowStore.setCategories(categoryResponseData.result)
        }
        const response = await getContactList(2)
        if (response.status === 200) {
            const responseData = response.data
            rowStore.setRows(responseData.result.map((item: ContactResponse) => {
                const { categories } = useContactStore.getState()
                const category = categories.find((category) => category.seq === item.categoryID)
                return {
                    id: uuidv4(),
                    seq: item.seq,
                    name: item.name,
                    phone: item.phone,
                    category: `${category?.name} (${category?.seq})`,
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
            field: 'seq',
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
            valueOptions: rowStore.categories.map((item: ContactCategoryResponse) => {
                return `${item.name} (${item.seq})`
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