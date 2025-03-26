import { v4 as uuidv4 } from "uuid"
import { Button } from "@mui/material"
import { GridToolbarContainer } from "@mui/x-data-grid"

import RefreshIcon from '@mui/icons-material/Refresh'
import { getSubwayTimetables, SubwayTimetable } from "../../../../service/network/subway.ts"
import { useSubwayTimetableStore } from "../../../../stores/subway.ts"

export function Toolbar() {
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

    return (
        <GridToolbarContainer style={{ display: "flex", justifyContent: "flex-end", marginTop: "10px" }}>
            <Button color="primary" variant="outlined" startIcon={<RefreshIcon />} onClick={fetchSubwayTimetable}>
                새로고침
            </Button>
        </GridToolbarContainer>
    )
}