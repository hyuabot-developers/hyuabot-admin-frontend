import AddIcon from '@mui/icons-material/Add'
import RefreshIcon from '@mui/icons-material/Refresh'
import { Autocomplete, TextField } from '@mui/material'
import { GridRowModes, Toolbar, ToolbarButton } from '@mui/x-data-grid'
import { v4 as uuidv4 } from 'uuid'

import { getCafeteriaMenuList, MenuResponse } from '../../../../service/network/cafeteria.ts'
import { useCafeteriaMenuGridModelStore, useCafeteriaMenuStore } from '../../../../stores/cafeteria.ts'

export const GridToolbar = () => {
    const rowStore = useCafeteriaMenuStore()
    const rowModesModelStore = useCafeteriaMenuGridModelStore()
    const addRowButtonClicked = () => {
        const id = uuidv4()
        const cafeteria = rowStore.cafeterias[0]
        rowStore.setRows([
            {
                id,
                seq: null,
                cafeteria: cafeteria ? `${cafeteria.name} (${cafeteria.seq})` : '',
                date: '',
                type: '',
                food: '',
                price: '',
                isNew: true,
            },
            ...rowStore.rows,
        ])
        rowModesModelStore.setRowModesModel(({
            ...rowModesModelStore.rowModesModel,
            [id]: { mode: GridRowModes.Edit, fieldToFocus: 'date' },
        }))
    }
    const fetchMenuByCafeteria = async (cafeteriaID: number) => {
        const response = await getCafeteriaMenuList(cafeteriaID)
        if (response.status === 200) {
            const responseData = response.data
            const { cafeterias } = useCafeteriaMenuStore.getState()
            rowStore.setRows(responseData.result.map((item: MenuResponse) => {
                const cafeteria = cafeterias.find((cafeteria) => cafeteria.seq === item.cafeteriaID)
                return {
                    id: uuidv4(),
                    seq: item.seq,
                    cafeteria: cafeteria ? `${cafeteria.name} (${cafeteria.seq})` : '',
                    date: item.date,
                    type: item.type,
                    food: item.food,
                    price: item.price,
                    isNew: false,
                }
            }))
        }
    }
    const refreshMenu = () => {
        const { selectedCafeteriaID } = useCafeteriaMenuStore.getState()
        if (selectedCafeteriaID) {
            fetchMenuByCafeteria(selectedCafeteriaID).then()
        }
    }

    const onChangeSelectedCafeteria = (value: number) => {
        if (value) {
            rowStore.setSelectedCafeteriaID(value)
            fetchMenuByCafeteria(value).then()
        }
    }

    return (
        <Toolbar style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '10px' }}>
            <Autocomplete
                size="small"
                disablePortal={true}
                options={rowStore.cafeterias.map((cafeteria) => `${cafeteria.name} (${cafeteria.seq})`)}
                sx={{ width: 300, marginRight: 2 }}
                renderInput={(params) => <TextField {...params} label="식당" />}
                onChange={(_, value) => onChangeSelectedCafeteria(
                    parseInt(value ? value.match(/\(([^)]+)\)/)?.[1] || '0' : '0', 10)
                )}
            />
            <ToolbarButton onClick={refreshMenu}>
                <RefreshIcon />
            </ToolbarButton>
            <ToolbarButton onClick={addRowButtonClicked}>
                <AddIcon />
            </ToolbarButton>
        </Toolbar>
    )
}