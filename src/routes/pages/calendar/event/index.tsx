import { useEffect } from "react"
import { v4 as uuidv4 } from "uuid"
import { GridColDef } from "@mui/x-data-grid"
import { CalendarGrid } from "./grid.tsx"
import { GridCalendarCategoryItem, useCalendarCategoryStore, useCalendarStore } from "../../../../stores/calendar.ts"
import {
    CalendarCategoryResponse,
    CalendarResponse,
    getCalendarCategoryList,
    getCalendarList
} from "../../../../service/network/calendar.ts"
import dayjs from "dayjs"


export default function CalendarEventPage() {
    // Get the store
    const categoryStore = useCalendarCategoryStore()
    const calendarStore = useCalendarStore()
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
            calendarStore.setRows(responseData.data.map((item: CalendarResponse) => {
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
    const dateValueFormatter = (value: string) => {
        return dayjs(value).format('YYYY-MM-DD')
    }
    useEffect(() => {
        fetchCalendar().then()
    }, [])
    // Configure DataGrid
    const columns: GridColDef[] = [
        {
            field: 'eventID',
            headerName: '일정 ID',
            width: 150,
            type: 'string',
            editable: false,
            headerAlign: 'center',
            align: 'center',
        },
        {
            field: 'category',
            headerName: '카테고리',
            minWidth: 150,
            flex: 1,
            type: 'singleSelect',
            valueOptions: categoryStore.rows.map((item: GridCalendarCategoryItem) => {
                return `${item.name} (${item.categoryID})`
            }),
            editable: true,
            headerAlign: 'center',
            align: 'center',
        },
        {
            field: 'title',
            headerName: '제목',
            minWidth: 150,
            flex: 1,
            type: 'string',
            editable: true,
            headerAlign: 'center',
            align: 'center',
        },
        {
            field: 'description',
            headerName: '설명',
            minWidth: 150,
            flex: 1,
            type: 'string',
            editable: true,
            headerAlign: 'center',
            align: 'center',
        },
        {
            field: 'start',
            headerName: '시작일',
            minWidth: 150,
            flex: 1,
            type: 'date',
            editable: true,
            headerAlign: 'center',
            align: 'center',
            valueFormatter: dateValueFormatter,
        },
        {
            field: 'end',
            headerName: '종료일',
            minWidth: 150,
            flex: 1,
            type: 'date',
            editable: true,
            headerAlign: 'center',
            align: 'center',
            valueFormatter: dateValueFormatter,
        },
    ]

    return (
        <CalendarGrid columns={columns} />
    )
}