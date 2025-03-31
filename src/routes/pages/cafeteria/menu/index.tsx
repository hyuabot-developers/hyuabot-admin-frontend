import { useEffect } from 'react'
import { v4 as uuidv4 } from 'uuid'
import { GridColDef } from '@mui/x-data-grid'
import { CafeteriaMenuGrid } from './grid.tsx'
import { GridCafeteriaItem, useCafeteriaItemStore, useCafeteriaMenuStore } from '../../../../stores/cafeteria.ts'
import {
    CafeteriaMenuResponse,
    CafeteriaResponse,
    getCafeteriaList,
    getCafeteriaMenuList
} from '../../../../service/network/cafeteria.ts'
import dayjs from "dayjs"


export default function CafeteriaMenuPage() {
    // Get the store
    const cafeteriaStore = useCafeteriaItemStore()
    const menuStore = useCafeteriaMenuStore()
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
            menuStore.setRows(responseData.data.map((item: CafeteriaMenuResponse) => {
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
    const getMenuDate = (value: string) => {
        return dayjs(value).format('YYYY-MM-DD')
    }

    useEffect(() => {
        fetchCafeteriaMenu().then()
    }, [])
    // Configure DataGrid
    const columns: GridColDef[] = [
        {
            field: 'cafeteria',
            headerName: '식당',
            width: 150,
            type: 'singleSelect',
            valueOptions: cafeteriaStore.rows.map((item: GridCafeteriaItem) => {
                return `${item.name} (${item.cafeteriaID})`
            }),
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
            field: 'time',
            headerName: '배식 시간',
            width: 150,
            type: 'string',
            editable: true,
            headerAlign: 'center',
            align: 'center',
        },
        {
            field: 'name',
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