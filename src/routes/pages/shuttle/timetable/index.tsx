import { GridColDef } from '@mui/x-data-grid'

import { ShuttleTimetableGrid } from './grid.tsx'

export default function ShuttleTimetable() {
    // Configure DataGrid
    const periodTypeValueFormatter = (value: string) => {
        switch (value) {
        case 'semester': return '학기'
        case 'vacation': return '방학'
        case 'vacation_session': return '계절학기'
        default: return '기타'
        }
    }
    const columns: GridColDef[] = [
        {
            field: 'period',
            headerName: '운행 종류',
            minWidth: 200,
            flex: 1,
            valueFormatter: periodTypeValueFormatter,
            type: 'singleSelect',
            valueOptions: ['semester', 'vacation', 'vacation_session'],
            editable: true,
            headerAlign: 'center',
            align: 'center',
        },
        {
            field: 'weekdays',
            headerName: '평일/주말',
            minWidth: 150,
            flex: 1,
            type: 'boolean',
            editable: true,
            headerAlign: 'center',
            align: 'center',
        },
        {
            field: 'time',
            headerName: '운행 시간',
            minWidth: 150,
            flex: 1,
            type: 'string',
            editable: true,
            headerAlign: 'center',
            align: 'center',
        },
    ]

    return (
        <ShuttleTimetableGrid columns={columns} />
    )
}