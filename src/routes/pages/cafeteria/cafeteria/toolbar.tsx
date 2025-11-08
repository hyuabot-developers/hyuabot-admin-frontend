import AddIcon from '@mui/icons-material/Add'
import RefreshIcon from '@mui/icons-material/Refresh'
import { GridRowModes, Toolbar, ToolbarButton } from '@mui/x-data-grid'
import { v4 as uuidv4 } from 'uuid'

import { CafeteriaResponse, getCafeteriaList } from '../../../../service/network/cafeteria.ts'
import { CampusResponse, getCampusList } from '../../../../service/network/campus.ts'
import { useCafeteriaItemGridModelStore, useCafeteriaItemStore } from '../../../../stores/cafeteria.ts'

export const GridToolbar = () => {
    const rowStore = useCafeteriaItemStore()
    const rowModesModelStore = useCafeteriaItemGridModelStore()
    const fetchCafeteriaList = async () => {
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
        const response = await getCafeteriaList()
        if (response.status === 200) {
            const responseData = response.data
            rowStore.setRows(responseData.result.map((item: CafeteriaResponse) => {
                const campus = rowStore.campuses.find((campus) => campus.seq === item.campusID)
                return {
                    id: uuidv4(),
                    seq: item.seq,
                    campus: `${campus ? campus.name : ''} (${item.campusID})`,
                    name: item.name,
                    latitude: item.latitude,
                    longitude: item.longitude,
                    breakfastTime: item.breakfastTime,
                    lunchTime: item.lunchTime,
                    dinnerTime: item.dinnerTime,
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
                latitude: 0,
                longitude: 0,
                breakfastTime: '',
                lunchTime: '',
                dinnerTime: '',
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
            <ToolbarButton onClick={fetchCafeteriaList}>
                <RefreshIcon />
            </ToolbarButton>
            <ToolbarButton onClick={addRowButtonClicked}>
                <AddIcon />
            </ToolbarButton>
        </Toolbar>
    )
}