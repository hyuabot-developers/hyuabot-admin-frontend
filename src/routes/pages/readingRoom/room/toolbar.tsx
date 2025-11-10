import AddIcon from '@mui/icons-material/Add'
import RefreshIcon from '@mui/icons-material/Refresh'
import { GridRowModes, Toolbar, ToolbarButton } from '@mui/x-data-grid'
import { v4 as uuidv4 } from 'uuid'

import { CampusResponse, getCampusList } from '../../../../service/network/campus.ts'
import { getReadingRoomList, ReadingRoomResponse } from '../../../../service/network/readingRoom.ts'
import { useReadingRoomItemGridModelStore, useReadingRoomItemStore } from '../../../../stores/readingRoom.ts'

export const GridToolbar = () => {
    const rowStore = useReadingRoomItemStore()
    const rowModesModelStore = useReadingRoomItemGridModelStore()
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
    // Add record button click event
    const addRowButtonClicked = () => {
        const id = uuidv4()
        const campus = rowStore.campuses[0]
        rowStore.setRows([
            {
                id,
                seq: null,
                name: '',
                campus: campus ? `${campus.name} (${campus.seq})` : '',
                isActive: true,
                isReservable: true,
                total: 0,
                active: 0,
                available: 0,
                occupied: 0,
                updatedAt: Date(),
                isNew: true,
            },
            ...rowStore.rows,
        ])
        rowModesModelStore.setRowModesModel(({
            ...rowModesModelStore.rowModesModel,
            [id]: { mode: GridRowModes.Edit, fieldToFocus: 'seq' },
        }))
    }
    return (
        <Toolbar style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '10px' }}>
            <ToolbarButton onClick={fetchReadingRoom}>
                <RefreshIcon />
            </ToolbarButton>
            <ToolbarButton onClick={addRowButtonClicked}>
                <AddIcon />
            </ToolbarButton>
        </Toolbar>
    )
}