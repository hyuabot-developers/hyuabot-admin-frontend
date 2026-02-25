import { GridColDef } from '@mui/x-data-grid'
import dayjs from 'dayjs'
import { useEffect } from 'react'
import { v4 as uuidv4 } from 'uuid'

import { NoticeGrid } from './grid.tsx'
import {
    NoticeCategoryResponse,
    NoticeResponse,
    getNoticeCategoryList,
    getNoticeList
} from '../../../../service/network/notice.ts'
import { useNoticeStore } from '../../../../stores/notice.ts'


export default function NoticePage() {
    // Get the store
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
                    isNew: false,
                }
            }))
        }
    }
    const dateValueFormatter = (value: string) => {
        return dayjs(value).format('YYYY-MM-DD HH:mm:ss')
    }
    useEffect(() => {
        fetchNotice().then()
    }, [])
    // Configure DataGrid
    const columns: GridColDef[] = [
        {
            field: 'seq',
            headerName: '공지사항 ID',
            width: 150,
            type: 'string',
            editable: false,
            headerAlign: 'center',
            align: 'center',
        },
        {
            field: 'category',
            headerName: '카테고리',
            minWidth: 150,
            flex: 1,
            type: 'singleSelect',
            valueOptions: rowStore.categories.map((item: NoticeCategoryResponse) => {
                return `${item.name} (${item.seq})`
            }),
            editable: true,
            headerAlign: 'center',
            align: 'center',
        },
        {
            field: 'title',
            headerName: '제목',
            minWidth: 150,
            flex: 1,
            type: 'string',
            editable: true,
            headerAlign: 'center',
            align: 'center',
        },
        {
            field: 'url',
            headerName: 'URL',
            minWidth: 150,
            flex: 1,
            type: 'string',
            editable: true,
            headerAlign: 'center',
            align: 'center',
        },
        {
            field: 'expiredAt',
            headerName: '만료일',
            minWidth: 150,
            flex: 1,
            type: 'dateTime',
            editable: true,
            headerAlign: 'center',
            align: 'center',
            valueFormatter: dateValueFormatter,
        },
        {
            field: 'language',
            headerName: '언어',
            minWidth: 150,
            flex: 1,
            type: 'singleSelect',
            valueOptions: ['KOREAN', 'ENGLISH'],
            editable: true,
            headerAlign: 'center',
            align: 'center',
        }
    ]

    return (
        <NoticeGrid columns={columns} />
    )
}