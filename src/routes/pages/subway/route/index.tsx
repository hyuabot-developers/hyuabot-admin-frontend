import { useEffect } from "react"
import { v4 as uuidv4 } from "uuid"
import { GridColDef } from "@mui/x-data-grid"
import { SubwayRouteGrid } from "./grid.tsx"
import { useSubwayRouteStore } from "../../../../stores/subway.ts"
import { SubwayRoute, getSubwayRoutes } from "../../../../service/network/subway.ts"

export default function SubwayRoutePage() {
    // Get the store
    const subwayRouteStore = useSubwayRouteStore()
    const fetchSubwayRoute = async () => {
        // Fetch subway route
        const routeResponse = await getSubwayRoutes()
        if (routeResponse.status === 200) {
            const responseData = routeResponse.data
            subwayRouteStore.setRows(responseData.data.map((item: SubwayRoute) => {
                return {
                    id: uuidv4(),
                    routeID: item.id,
                    name: item.name,
                }
            }))
        }
    }
    useEffect(() => {
        fetchSubwayRoute().then()
    }, [])
    // Configure DataGrid
    const columns: GridColDef[] = [
        {
            field: 'routeID',
            headerName: '노선 ID',
            type: 'string',
            editable: true,
            headerAlign: 'center',
            align: 'center',
            width: 100,
        },
        {
            field: 'name',
            headerName: '노선명',
            type: 'string',
            editable: true,
            headerAlign: 'left',
            align: 'left',
            minWidth: 150,
            flex: 1,
        },
    ]

    return (
        <SubwayRouteGrid columns={columns} />
    )
}