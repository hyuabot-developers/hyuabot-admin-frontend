import { useEffect } from 'react'
import { v4 as uuidv4 } from 'uuid'
import { GridColDef } from '@mui/x-data-grid'
import { CalendarCategoryGrid } from './grid.tsx'
import { useCalendarCategoryStore } from "../../../../stores/calendar.ts"
import { CalendarCategoryResponse, getCalendarCategoryList } from "../../../../service/network/calendar.ts"


export default function CalendarCategoryPage() {
    // Get the store
    const categoryStore = useCalendarCategoryStore()
    const fetchCalendarCategory = async () => {
        const response = await getCalendarCategoryList()
        if (response.status === 200) {
            const responseData = response.data
            categoryStore.setRows(responseData.data.map((item: CalendarCategoryResponse) => {
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
        fetchCalendarCategory().then()
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
        <CalendarCategoryGrid columns={columns} />
    )
}