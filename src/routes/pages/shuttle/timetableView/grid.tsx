
import {
    DataGrid,
    GridColDef,
} from '@mui/x-data-grid'
import { useEffect } from 'react'
import { v4 as uuidv4 } from 'uuid'

import { getShuttleAllTimetable, ShuttleTimetableViewResponse } from '../../../../service/network/shuttle.ts'
import { useShuttleTimetableViewStore } from '../../../../stores/shuttle.ts'
import { DataGridPage } from '../../../components/DataGridPage.tsx'


interface GridProps {
    columns: GridColDef[]
}

export const ShuttleTimetableGrid = (props: GridProps) => {
    const rowStore = useShuttleTimetableViewStore()
    const fetchTimetable = async () => {
        const response = await getShuttleAllTimetable()
        if (response.status === 200) {
            const responseData = response.data
            rowStore.setRows(responseData.result.map((item: ShuttleTimetableViewResponse) => {
                return {
                    id: uuidv4(),
                    seq: item.seq,
                    period: item.period,
                    weekdays: item.isWeekdays,
                    route: item.routeName,
                    stop: item.stopName,
                    time: item.departureTime,
                    tag: item.routeTag,
                    group: item.destinationGroup
                }
            }))
        }
    }
    useEffect(() => {
        fetchTimetable().catch(console.error)
    }, [])    // Render
    return (
        <DataGridPage>
            <DataGrid
                columns={props.columns}
                rows={rowStore.rows}
                editMode="row"
                autoPageSize={true}
            />
        </DataGridPage>
    )
}
