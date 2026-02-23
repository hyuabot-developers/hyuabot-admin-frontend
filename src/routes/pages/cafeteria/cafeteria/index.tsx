import { GridColDef } from '@mui/x-data-grid'
import { useEffect } from 'react'
import { v4 as uuidv4 } from 'uuid'

import { CafeteriaGrid } from './grid.tsx'
import { CafeteriaResponse, getCafeteriaList } from '../../../../service/network/cafeteria.ts'
import { CampusResponse, getCampusList } from '../../../../service/network/campus.ts'
import { useCafeteriaItemStore } from '../../../../stores/cafeteria.ts'

export default function CafeteriaPage() {
    // Get the store
    const rowStore = useCafeteriaItemStore()
    const fetchCafeteriaList = async () => {
        const campusResponse = await getCampusList()
        let campuses: CampusResponse[] = []
        if (campusResponse.status === 200) {
            const campusResponseData = campusResponse.data
            campuses = campusResponseData.result.map((item: CampusResponse) => {
                return {
                    seq: item.seq,
                    name: item.name,
                }
            })
        }
        rowStore.setCampuses(campuses)
        const response = await getCafeteriaList()
        if (response.status === 200) {
            const responseData = response.data
            rowStore.setRows(responseData.result.map((item: CafeteriaResponse) => {
                return {
                    id: uuidv4(),
                    seq: item.seq,
                    campus: `${campuses.find((campus) => campus.seq === item.campusID)?.name || ''} (${item.campusID})`,
                    name: item.name,
                    latitude: item.latitude,
                    longitude: item.longitude,
                    breakfastTime: item.breakfastTime,
                    lunchTime: item.lunchTime,
                    dinnerTime: item.dinnerTime,
                    isNew: false,
                }
            }))
        }
    }
    useEffect(() => {
        fetchCafeteriaList().then()
    }, [])
    // Configure DataGrid
    const columns: GridColDef[] = [
        {
            field: 'seq',
            headerName: '식당 ID',
            width: 150,
            type: 'string',
            editable: true,
            headerAlign: 'center',
            align: 'center',
        },
        {
            field: 'name',
            headerName: '식당 이름',
            width: 150,
            type: 'string',
            editable: true,
            headerAlign: 'center',
            align: 'center',
        },
        {
            field: 'campus',
            headerName: '캠퍼스',
            width: 150,
            type: 'singleSelect',
            valueOptions: rowStore.campuses.map((item: CampusResponse) => {
                return `${item.name} (${item.seq})`
            }),
            editable: true,
            headerAlign: 'center',
            align: 'center',
        },
        {
            field: 'breakfastTime',
            headerName: '조식 시간',
            minWidth: 150,
            flex: 1,
            type: 'string',
            editable: true,
            headerAlign: 'center',
            align: 'center',
        },
        {
            field: 'lunchTime',
            headerName: '중식 시간',
            minWidth: 150,
            flex: 1,
            type: 'string',
            editable: true,
            headerAlign: 'center',
            align: 'center',
        },
        {
            field: 'dinnerTime',
            headerName: '석식 시간',
            minWidth: 150,
            flex: 1,
            type: 'string',
            editable: true,
            headerAlign: 'center',
            align: 'center',
        },
        {
            field: 'latitude',
            headerName: '식당 위도',
            width: 150,
            type: 'number',
            editable: true,
            headerAlign: 'center',
            align: 'center',
        },
        {
            field: 'longitude',
            headerName: '식당 경도',
            width: 150,
            type: 'number',
            editable: true,
            headerAlign: 'center',
            align: 'center',
        },
    ]

    return (
        <CafeteriaGrid columns={columns} />
    )
}