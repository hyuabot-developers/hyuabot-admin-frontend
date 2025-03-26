import { useEffect } from "react"
import { v4 as uuidv4 } from "uuid"
import { GridColDef } from "@mui/x-data-grid"
import { SubwayStationNameGrid } from "./grid.tsx"
import { useSubwayStationNameStore } from "../../../../stores/subway.ts"
import { SubwayStationName, getSubwayStationNames } from "../../../../service/network/subway.ts"

export default function SubwayStationNamePage() {
    // Get the store
    const busStationNameStore = useSubwayStationNameStore()
    const fetchSubwayStationName = async () => {
        const response = await getSubwayStationNames()
        if (response.status === 200) {
            const responseData = response.data
            busStationNameStore.setRows(responseData.data.map((item: SubwayStationName) => {
                return {
                    id: uuidv4(),
                    name: item.name,
                }
            }))
        }
    }
    useEffect(() => {
        fetchSubwayStationName().then()
    }, [])
    // Configure DataGrid
    const columns: GridColDef[] = [
        {
            field: 'name',
            headerName: '역 이름',
            minWidth: 250,
            flex: 1,
            type: 'string',
            editable: true,
            headerAlign: 'center',
            align: 'center',
        },
    ]

    return (
        <SubwayStationNameGrid columns={columns} />
    )
}