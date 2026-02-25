import AddIcon from '@mui/icons-material/Add'
import RefreshIcon from '@mui/icons-material/Refresh'
import { GridRowModes, Toolbar, ToolbarButton } from '@mui/x-data-grid'
import { v4 as uuidv4 } from 'uuid'

import {
    NoticeResponse,
    getNoticeCategoryList,
    getNoticeList
} from '../../../../service/network/notice.ts'
import {
    useNoticeGridModelStore,
    useNoticeStore
} from '../../../../stores/notice.ts'


export const GridToolbar = () => {
    // Get the store
    const rowModesModelStore = useNoticeGridModelStore()
    const rowStore = useNoticeStore()
    const fetchNotice = async () => {
        const categoryResponse = await getNoticeCategoryList()
        if (categoryResponse.status === 200) {
            const categoryResponseData = categoryResponse.data
            rowStore.setCategories(categoryResponseData.result)
        }
        const response = await getNoticeList()
        if (response.status === 200) {
            const responseData = response.data
            const { categories } = useNoticeStore.getState()
            rowStore.setRows(responseData.result.map((item: NoticeResponse) => {
                const category = categories.find((category) => category.seq === item.categoryID)
                return {
                    id: uuidv4(),
                    seq: item.seq,
                    category: `${category?.name} (${category?.seq})`,
                    title: item.title,
                    url: item.url,
                    expiredAt: item.expiredAt,
                    userID: item.userID,
                    language: item.language,
                }
            }))
        }
    }
    // Add record button click event
    const addRowButtonClicked = () => {
        const id = uuidv4()
        const { categories } = useNoticeStore.getState()
        const category = categories[0]
        rowStore.setRows([
            {
                id,
                seq: null,
                category: `${category?.name} (${category?.seq})`,
                title: '',
                url: '',
                expiredAt: '',
                userID: '',
                language: 'KOREAN',
                isNew: true,
            },
            ...rowStore.rows,
        ])
        rowModesModelStore.setRowModesModel(({
            ...rowModesModelStore.rowModesModel,
            [id]: { mode: GridRowModes.Edit, fieldToFocus: 'title' },
        }))
    }

    return (
        <Toolbar style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '10px' }}>
            <ToolbarButton onClick={fetchNotice}>
                <RefreshIcon />
            </ToolbarButton>
            <ToolbarButton onClick={addRowButtonClicked}>
                <AddIcon />
            </ToolbarButton>
        </Toolbar>
    )
}