import { GridColDef } from '@mui/x-data-grid'
import { useEffect } from 'react'

import { SubwayTimetableGrid } from './grid.tsx'
import { getSubwayStations } from '../../../../service/network/subway.ts'
import { useSubwayTimetableStore } from '../../../../stores/subway.ts'

export default function SubwayTimetablePage() {
    // Get the store
    const rowStore = useSubwayTimetableStore()
    const fetchSubwayStations = async () => {
        const stationResponse = await getSubwayStations()
        if (stationResponse.status === 200) {
            const responseData = stationResponse.data.result
            rowStore.setStations(responseData)
        }
    }
    useEffect(() => {
        fetchSubwayStations().then()
    }, [])
    // Configure DataGrid
    const columns: GridColDef[] = [
        {
            field: 'startStation',
            headerName: '출발역',
            width: 250,
            type: 'singleSelect',
            valueOptions: rowStore.stations.map((station) => `${station.name} (${station.id})`),
            editable: true,
            headerAlign: 'center',
            align: 'center',
        },
        {
            field: 'terminalStation',
            headerName: '종착역',
            width: 250,
            type: 'singleSelect',
            valueOptions: rowStore.stations.map((station) => `${station.name} (${station.id})`),
            editable: true,
            headerAlign: 'center',
            align: 'center',
        },
        {
            field: 'departureTime',
            headerName: '출발 시간',
            minWidth: 150,
            flex: 1,
            type: 'string',
            editable: true,
            headerAlign: 'center',
            align: 'center',
        },
    ]

    return (
        <SubwayTimetableGrid columns={columns} />
    )
}