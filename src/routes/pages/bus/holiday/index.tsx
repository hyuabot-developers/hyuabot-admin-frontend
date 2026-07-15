import { GridColDef } from '@mui/x-data-grid'
import dayjs from 'dayjs'
import { useEffect } from 'react'
import { v4 as uuidv4 } from 'uuid'

import { PublicHolidayGrid } from './grid.tsx'
import { getPublicHoliday, PublicHolidayResponse } from '../../../../service/network/publicHoliday.ts'
import { usePublicHolidayStore } from '../../../../stores/publicHoliday.ts'
import { reportError } from '../../../../utility/reportError.ts'

export default function PublicHolidayPage() {
    const store = usePublicHolidayStore()
    const fetchData = async () => {
        const response = await getPublicHoliday()
        if (response.status === 200) {
            store.setRows(response.data.result.map((item: PublicHolidayResponse) => ({
                id: uuidv4(),
                seq: item.seq,
                name: item.name,
                calendarType: item.calendarType,
                date: dayjs(item.date).toDate(),
            })))
        }
    }
    useEffect(() => { fetchData().catch(reportError) }, [])

    const calendarTypeValueFormatter = (value: string) => {
        switch (value) {
        case 'solar': return '양력'
        case 'lunar': return '음력'
        default: return '기타'
        }
    }
    const columns: GridColDef[] = [
        {
            field: 'date',
            headerName: '날짜',
            minWidth: 200,
            flex: 1,
            valueFormatter: (value: Date) => dayjs(value).format('YYYY-MM-DD'),
            type: 'date',
            editable: true,
            headerAlign: 'center',
            align: 'center',
        },
        {
            field: 'calendarType',
            headerName: '음력/양력',
            minWidth: 150,
            flex: 1,
            valueFormatter: calendarTypeValueFormatter,
            type: 'singleSelect',
            valueOptions: ['solar', 'lunar'],
            editable: true,
            headerAlign: 'center',
            align: 'center',
        },
        {
            field: 'name',
            headerName: '공휴일 이름',
            minWidth: 200,
            flex: 2,
            editable: true,
            headerAlign: 'center',
            align: 'center',
        },
    ]

    return <PublicHolidayGrid columns={columns} />
}
