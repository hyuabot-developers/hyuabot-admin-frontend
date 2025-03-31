import { useEffect } from "react"
import { v4 as uuidv4 } from "uuid"
import { GridColDef } from "@mui/x-data-grid"
import { CafeteriaGrid } from "./grid.tsx"
import { useCafeteriaItemStore } from "../../../../stores/cafeteria.ts"
import { CafeteriaResponse, getCafeteriaList } from "../../../../service/network/cafeteria.ts"
import { CampusResponse, getCampusList } from "../../../../service/network/campus.ts"
import { useCampusStore } from "../../../../stores/campus.ts"

export default function CafeteriaPage() {
    // Get the store
    const campusStore = useCampusStore()
    const cafeteriaStore = useCafeteriaItemStore()
    let campusList: CampusResponse[] = []
    const fetchCafeteriaList = async () => {
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
        const response = await getCafeteriaList()
        if (response.status === 200) {
            const responseData = response.data
            cafeteriaStore.setRows(responseData.data.map((item: CafeteriaResponse) => {
                const campus = campusList.find(campus => campus.id === item.campusID)
                return {
                    id: uuidv4(),
                    cafeteriaID: item.id,
                    name: item.name,
                    campus: `${campus?.name} (${campus?.id})`,
                    latitude: item.latitude,
                    longitude: item.longitude,
                    breakfastTime: item.runningTime.breakfast,
                    lunchTime: item.runningTime.lunch,
                    dinnerTime: item.runningTime.dinner,
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
            field: 'cafeteriaID',
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
            valueOptions: campusStore.rows.map((item: CampusResponse) => {
                return `${item.name} (${item.id})`
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