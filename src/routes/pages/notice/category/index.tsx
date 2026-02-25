import { GridColDef } from '@mui/x-data-grid'
import { useEffect } from 'react'
import { v4 as uuidv4 } from 'uuid'

import { NoticeCategoryGrid } from './grid.tsx'
import { NoticeCategoryResponse, getNoticeCategoryList } from '../../../../service/network/notice.ts'
import { useNoticeCategoryStore } from '../../../../stores/notice.ts'


export default function NoticeCategoryPage() {
    // Get the store
    const rowStore = useNoticeCategoryStore()
    const fetchNoticeCategory = async () => {
        const response = await getNoticeCategoryList()
        if (response.status === 200) {
            const responseData = response.data
            rowStore.setRows(responseData.result.map((item: NoticeCategoryResponse) => {
                return {
                    id: uuidv4(),
                    seq: item.seq,
                    name: item.name,
                    isNew: false,
                }
            }))
        }
    }
    useEffect(() => {
        fetchNoticeCategory().then()
    }, [])
    // Configure DataGrid
    const columns: GridColDef[] = [
        {
            field: 'seq',
            headerName: '카테고리 ID',
            width: 150,
            type: 'string',
            editable: false,
            headerAlign: 'center',
            align: 'center',
        },
        {
            field: 'name',
            headerName: '카테고리 이름',
            minWidth: 150,
            flex: 1,
            type: 'string',
            editable: true,
            headerAlign: 'center',
            align: 'center',
        },
    ]

    return (
        <NoticeCategoryGrid columns={columns} />
    )
}