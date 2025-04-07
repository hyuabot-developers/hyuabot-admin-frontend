import { useEffect } from 'react'
import { v4 as uuidv4 } from 'uuid'
import { GridColDef } from '@mui/x-data-grid'
import { ReadingRoomGrid } from './grid.tsx'
import dayjs from "dayjs"
import { useReadingRoomItemStore } from "../../../../stores/readingRoom.ts"
import { getReadingRoomList, ReadingRoomResponse } from "../../../../service/network/readingRoom.ts"


export default function ReadingRoomPage() {
    // Get the store
    const readingRoomStore = useReadingRoomItemStore()
    const fetchReadingRoom = async () => {
        const response = await getReadingRoomList()
        if (response.status === 200) {
            const responseData = response.data
            readingRoomStore.setRows(responseData.data.map((item: ReadingRoomResponse) => {
                return {
                    id: uuidv4(),
                    readingRoomID: item.id,
                    name: item.name,
                    total: item.total,
                    active: item.active,
                    available: item.available,
                    occupied: item.occupied,
                    updatedAt: item.updatedAt,
                    isNew: false,
                }
            }))
        }
    }
    const getUpdateDate = (value: string) => {
        return dayjs(value).format('YYYY-MM-DD HH:mm:ss')
    }

    useEffect(() => {
        fetchReadingRoom().then()
    }, [])
    // Configure DataGrid
    const columns: GridColDef[] = [
        {
            field: 'readingRoomID',
            headerName: '열람실 ID',
            width: 150,
            type: 'number',
            editable: false,
            headerAlign: 'center',
            align: 'center',
        },
        {
            field: 'name',
            headerName: '열람실 이름',
            width: 250,
            type: 'string',
            editable: false,
            headerAlign: 'center',
            align: 'center',
        },
        {
            field: 'total',
            headerName: '총 좌석',
            width: 150,
            type: 'number',
            editable: false,
            headerAlign: 'center',
            align: 'center',
        },
        {
            field: 'active',
            headerName: '활성 좌석',
            width: 150,
            type: 'number',
            editable: false,
            headerAlign: 'center',
            align: 'center',
        },
        {
            field: 'available',
            headerName: '가용 좌석',
            width: 150,
            type: 'number',
            editable: false,
            headerAlign: 'center',
            align: 'center',
        },
        {
            field: 'occupied',
            headerName: '점유 좌석',
            width: 150,
            type: 'number',
            editable: false,
            headerAlign: 'center',
            align: 'center',
        },
        {
            field: 'updatedAt',
            headerName: '갱신 시간',
            minWidth: 150,
            flex: 1,
            type: 'dateTime',
            editable: false,
            headerAlign: 'center',
            align: 'center',
            valueFormatter: getUpdateDate
        }
    ]

    return (
        <ReadingRoomGrid columns={columns} />
    )
}