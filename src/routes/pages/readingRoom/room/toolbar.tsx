import { v4 as uuidv4 } from "uuid"
import { Button } from "@mui/material"
import { GridToolbarContainer } from "@mui/x-data-grid"
import RefreshIcon from '@mui/icons-material/Refresh'
import { getReadingRoomList, ReadingRoomResponse } from "../../../../service/network/readingRoom.ts"
import { useReadingRoomItemStore } from "../../../../stores/readingRoom.ts"

export function Toolbar() {
    const rowStore = useReadingRoomItemStore()
    const fetchReadingRoom = async () => {
        const response = await getReadingRoomList()
        if (response.status === 200) {
            const responseData = response.data
            rowStore.setRows(responseData.data.map((item: ReadingRoomResponse) => {
                return {
                    id: uuidv4(),
                    readingRoomID: item.id,
                    name: item.name,
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
    return (
        <GridToolbarContainer style={{ display: "flex", justifyContent: "flex-end", marginTop: "10px" }}>
            <Button color="primary" variant="outlined" startIcon={<RefreshIcon />} onClick={fetchReadingRoom}>
                새로고침
            </Button>
        </GridToolbarContainer>
    )
}