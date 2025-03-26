import { useEffect } from "react"
import { v4 as uuidv4 } from "uuid"
import { GridColDef } from "@mui/x-data-grid"
import { SubwayTimetableGrid } from "./grid.tsx"
import { useSubwayTimetableStore } from "../../../../stores/subway.ts"
import { getSubwayTimetables, SubwayTimetable } from "../../../../service/network/subway.ts"

export default function SubwayTimetablePage() {
    // Get the store
    const rowStore = useSubwayTimetableStore()
    const fetchSubwayTimetable = async () => {
        const timetableResponse = await getSubwayTimetables()
        if (timetableResponse.status === 200) {
            const responseData = timetableResponse.data
            rowStore.setRows(responseData.data.map((item: SubwayTimetable) => {
                return {
                    id: uuidv4(),
                    stationID: item.stationID,
                    startStationID: item.startStationID,
                    terminalStationID: item.terminalStationID,
                    departureTime: item.departureTime,
                    weekday: item.weekday,
                    heading: item.heading,
                }
            }))
        }
    }
    useEffect(() => {
        fetchSubwayTimetable().then()
    }, [])
    // Configure DataGrid
    const columns: GridColDef[] = [
        {
            field: 'stationID',
            headerName: '역 ID',
            width: 150,
            type: 'string',
            editable: false,
            headerAlign: 'center',
            align: 'center',
        },
        {
            field: 'startStationID',
            headerName: '출발역 ID',
            width: 150,
            type: 'string',
            editable: false,
            headerAlign: 'center',
            align: 'center',
        },
        {
            field: 'terminalStationID',
            headerName: '종착역 ID',
            width: 150,
            type: 'string',
            editable: false,
            headerAlign: 'center',
            align: 'center',
        },
        {
            field: 'departureTime',
            headerName: '출발 시간',
            width: 150,
            type: 'string',
            editable: false,
            headerAlign: 'center',
            align: 'center',
        },
        {
            field: 'weekday',
            headerName: '요일',
            width: 150,
            type: 'string',
            editable: false,
            headerAlign: 'center',
            align: 'center',
        },
        {
            field: 'heading',
            headerName: '방향',
            width: 150,
            type: 'string',
            editable: false,
            headerAlign: 'center',
            align: 'center',
        }
    ]

    return (
        <SubwayTimetableGrid columns={columns} />
    )
}