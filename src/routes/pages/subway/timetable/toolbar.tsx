import AddIcon from '@mui/icons-material/Add'
import RefreshIcon from '@mui/icons-material/Refresh'
import { Autocomplete, TextField } from '@mui/material'
import { GridRowModes, Toolbar, ToolbarButton } from '@mui/x-data-grid'
import { v4 as uuidv4 } from 'uuid'

import { getSubwayTimetableByStation, SubwayTimetable } from '../../../../service/network/subway.ts'
import { useSubwayTimetableGridModelStore, useSubwayTimetableStore } from '../../../../stores/subway.ts'

export const GridToolbar = () => {
    const rowStore = useSubwayTimetableStore()
    const rowModesModelStore = useSubwayTimetableGridModelStore()
    const fetchSubwayTimetable = async (stationID: string, direction: string, weekday: string) => {
        const timetableResponse = await getSubwayTimetableByStation(stationID, direction, weekday)
        if (timetableResponse.status === 200) {
            const responseData = timetableResponse.data
            const { stations } = useSubwayTimetableStore.getState()
            rowStore.setRows(responseData.result.map((item: SubwayTimetable) => {
                return {
                    id: uuidv4(),
                    seq: item.seq,
                    startStation: stations.find((station) => station.id === item.startStationID)
                        ? `${stations.find((station) => station.id === item.startStationID)?.name} (${item.startStationID})`
                        : item.startStationID,
                    terminalStation: stations.find((station) => station.id === item.terminalStationID)
                        ? `${stations.find((station) => station.id === item.terminalStationID)?.name} (${item.terminalStationID})`
                        : item.terminalStationID,
                    departureTime: item.departureTime,
                    weekday: item.weekday,
                    direction: item.direction,
                    isNew: false,
                }
            }))
        }
    }

    const addRowButtonClicked = () => {
        const { selectedStationID, selectedWeekday, selectedDirection } = useSubwayTimetableStore.getState()
        const id = uuidv4()
        if (!selectedStationID || !selectedWeekday || !selectedDirection) {
            return
        }
        rowStore.setRows([
            {
                id,
                seq: null,
                startStation: '',
                terminalStation: '',
                departureTime: '00:00:00',
                isNew: true,
            },
            ...rowStore.rows,
        ])
        rowModesModelStore.setRowModesModel(({
            ...rowModesModelStore.rowModesModel,
            [id]: { mode: GridRowModes.Edit, fieldToFocus: 'departureTime' },
        }))
    }

    const onChangeSelectedStationID = (stationID: string) => {
        if (stationID === '') {
            rowStore.setSelectedStationID(null)
            rowStore.setRows([])
            return
        }
        rowStore.setSelectedStationID(stationID)
        if (rowStore.selectedDirection && rowStore.selectedWeekday) {
            fetchSubwayTimetable(stationID, rowStore.selectedDirection, rowStore.selectedWeekday).then()
        }
    }

    const onChangeSelectedDirection = (direction: string) => {
        if (direction === '') {
            rowStore.setSelectedDirection(null)
            rowStore.setRows([])
            return
        }
        rowStore.setSelectedDirection(direction == '상행' ? 'up' : 'down')
        if (rowStore.selectedStationID && rowStore.selectedWeekday) {
            fetchSubwayTimetable(rowStore.selectedStationID, direction == '상행' ? 'up' : 'down', rowStore.selectedWeekday).then()
        }
    }

    const onChangeSelectedWeekday = (weekday: string) => {
        if (weekday === '') {
            rowStore.setSelectedWeekday(null)
            rowStore.setRows([])
            return
        }
        rowStore.setSelectedWeekday(weekday == '평일' ? 'weekdays' : 'weekends')
        if (rowStore.selectedStationID && rowStore.selectedDirection) {
            fetchSubwayTimetable(rowStore.selectedStationID, rowStore.selectedDirection, weekday == '평일' ? 'weekdays' : 'weekends').then()
        }
    }

    return (
        <Toolbar style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '10px' }}>
            <Autocomplete
                size="small"
                disablePortal={true}
                options={rowStore.stations.map((station) => `${station.name} (${station.id})`)}
                sx={{ width: 300, marginRight: 2 }}
                renderInput={(params) => <TextField {...params} label="전철역" />}
                onChange={(_, value) => onChangeSelectedStationID(
                    rowStore.stations.find((station) => `${station.name} (${station.id})` === value)?.id || ''
                )}
            />
            <Autocomplete
                size="small"
                disablePortal={true}
                options={['상행', '하행']}
                sx={{ width: 300, marginRight: 2 }}
                renderInput={(params) => <TextField {...params} label="행선" />}
                onChange={(_, value) => onChangeSelectedDirection(
                    value || ''
                )}
            />
            <Autocomplete
                size="small"
                disablePortal={true}
                options={['평일', '주말']}
                sx={{ width: 300, marginRight: 2 }}
                renderInput={(params) => <TextField {...params} label="요일" />}
                onChange={(_, value) => onChangeSelectedWeekday(
                    value || ''
                )}
            />
            <ToolbarButton onClick={addRowButtonClicked}>
                <AddIcon />
            </ToolbarButton>
            <ToolbarButton onClick={() => {
                if (rowStore.selectedStationID && rowStore.selectedDirection && rowStore.selectedWeekday) {
                    fetchSubwayTimetable(rowStore.selectedStationID, rowStore.selectedDirection, rowStore.selectedWeekday).then()
                }
            }}>
                <RefreshIcon />
            </ToolbarButton>
        </Toolbar>
    )
}