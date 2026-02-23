import { GridColDef } from '@mui/x-data-grid'
import dayjs from 'dayjs'
import { useEffect } from 'react'
import { v4 as uuidv4 } from 'uuid'

import { CalendarGrid } from './grid.tsx'
import {
    CalendarCategoryResponse,
    CalendarResponse,
    getCalendarCategoryList,
    getCalendarList
} from '../../../../service/network/calendar.ts'
import { useCalendarStore } from '../../../../stores/calendar.ts'


export default function CalendarEventPage() {
    // Get the store
    const rowStore = useCalendarStore()
    const fetchCalendar = async () => {
        const categoryResponse = await getCalendarCategoryList()
        if (categoryResponse.status === 200) {
            const categoryResponseData = categoryResponse.data
            rowStore.setCategories(categoryResponseData.result)
        }
        const response = await getCalendarList()
        if (response.status === 200) {
            const responseData = response.data
            const { categories } = useCalendarStore.getState()
            rowStore.setRows(responseData.result.map((item: CalendarResponse) => {
                const category = categories.find((category) => category.seq === item.categoryID)
                return {
                    id: uuidv4(),
                    seq: item.seq,
                    category: `${category?.name} (${category?.seq})`,
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
            field: 'seq',
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
            valueOptions: rowStore.categories.map((item: CalendarCategoryResponse) => {
                return `${item.name} (${item.seq})`
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