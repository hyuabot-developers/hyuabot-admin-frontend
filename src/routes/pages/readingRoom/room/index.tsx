import { GridColDef } from '@mui/x-data-grid'
import dayjs from 'dayjs'
import { useEffect } from 'react'
import { v4 as uuidv4 } from 'uuid'

import { ReadingRoomGrid } from './grid.tsx'
import { CampusResponse, getCampusList } from '../../../../service/network/campus.ts'
import { getReadingRoomList, ReadingRoomResponse } from '../../../../service/network/readingRoom.ts'
import { useReadingRoomItemStore } from '../../../../stores/readingRoom.ts'


export default function ReadingRoomPage() {
    // Get the store
    const rowStore = useReadingRoomItemStore()
    const fetchReadingRoom = async () => {
        const campusResponse = await getCampusList()
        if (campusResponse.status === 200) {
            const campusResponseData = campusResponse.data
            rowStore.setCampuses(campusResponseData.result.map((item: CampusResponse) => {
                return {
                    seq: item.seq,
                    name: item.name,
                }
            }))
        }
        const response = await getReadingRoomList()
        if (response.status === 200) {
            const responseData = response.data
            const { campuses } = useReadingRoomItemStore.getState()
            rowStore.setRows(responseData.result.map((item: ReadingRoomResponse) => {
                return {
                    id: uuidv4(),
                    seq: item.seq,
                    name: item.name,
                    campus: `${campuses.find((campus) => campus.seq === item.campusID)?.name || ''} (${item.campusID})`,
                    isActive: item.isActive,
                    isReservable: item.isReservable,
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
            field: 'seq',
            headerName: '열람실 ID',
            width: 150,
            type: 'number',
            editable: true,
            headerAlign: 'center',
            align: 'center',
        },
        {
            field: 'name',
            headerName: '열람실 이름',
            minWidth: 250,
            flex: 1,
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
            field: 'total',
            headerName: '총 좌석',
            width: 150,
            type: 'number',
            editable: true,
            headerAlign: 'center',
            align: 'center',
        },
        {
            field: 'active',
            headerName: '활성 좌석',
            width: 150,
            type: 'number',
            editable: true,
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
            editable: true,
            headerAlign: 'center',
            align: 'center',
        },
        {
            field: 'isActive',
            headerName: '활성화 여부',
            width: 150,
            type: 'boolean',
            editable: true,
            headerAlign: 'center',
            align: 'center',
        },
        {
            field: 'isReservable',
            headerName: '예약 가능 여부',
            width: 150,
            type: 'boolean',
            editable: true,
            headerAlign: 'center',
            align: 'center',
        },
        {
            field: 'updatedAt',
            headerName: '갱신 시간',
            width: 250,
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