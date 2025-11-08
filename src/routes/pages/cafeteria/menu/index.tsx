import { GridColDef } from '@mui/x-data-grid'
import dayjs from 'dayjs'
import { useEffect } from 'react'

import { CafeteriaMenuGrid } from './grid.tsx'
import { getCafeteriaList } from '../../../../service/network/cafeteria.ts'
import { useCafeteriaMenuStore } from '../../../../stores/cafeteria.ts'


export default function CafeteriaMenuPage() {
    // Get the store
    const rowStore = useCafeteriaMenuStore()
    const fetchCafeteriaMenu = async () => {
        const cafeteriaResponse = await getCafeteriaList()
        if (cafeteriaResponse.status === 200) {
            const responseData = cafeteriaResponse.data
            rowStore.setCafeterias(responseData.result)
        }
    }
    const getMenuDate = (value: string) => {
        return dayjs(value).format('YYYY-MM-DD')
    }

    useEffect(() => {
        fetchCafeteriaMenu().then()
    }, [])
    // Configure DataGrid
    const columns: GridColDef[] = [
        {
            field: 'seq',
            headerName: '메뉴 ID',
            width: 150,
            type: 'number',
            editable: true,
            headerAlign: 'center',
            align: 'center',
        },
        {
            field: 'date',
            headerName: '날짜',
            width: 150,
            type: 'date',
            editable: true,
            headerAlign: 'center',
            align: 'center',
            valueFormatter: getMenuDate,
        },
        {
            field: 'type',
            headerName: '배식 시간',
            width: 150,
            type: 'string',
            editable: true,
            headerAlign: 'center',
            align: 'center',
        },
        {
            field: 'food',
            headerName: '메뉴',
            minWidth: 200,
            flex: 1,
            type: 'string',
            editable: true,
            headerAlign: 'center',
            align: 'center',
        },
        {
            field: 'price',
            headerName: '가격',
            width: 250,
            type: 'string',
            editable: true,
            headerAlign: 'center',
            align: 'center',
        }
    ]

    return (
        <CafeteriaMenuGrid columns={columns} />
    )
}