import axios from 'axios'

const getGbisApiKey = () => {
    const raw = localStorage.getItem('hyuabot.gbisApiKey') ?? import.meta.env.VITE_APP_GBIS_API_KEY ?? ''
    try { return decodeURIComponent(raw) } catch { return raw }
}

export type GbisRoute = {
    routeId: string
    routeName: string
    routeTypeCd: string
    routeTypeName: string
    districtCd: string
    companyId: string
    companyName: string
    startStationId: string
    endStationId: string
    startStationName: string
    endStationName: string
    upFirstTime: string
    upLastTime: string
    downFirstTime: string
    downLastTime: string
}

export type GbisRouteDetail = GbisRoute & {
    companyTel: string
}

export type GbisStop = {
    stationId: string
    stationName: string
    mobileNo: string
    regionName: string
    districtCd: string
    gpsLati: string
    gpsLong: string
}

export type GbisRouteStation = GbisStop & {
    stationSeq: string
    turnYn: string
}

const toArray = <T>(val: T | T[] | undefined): T[] => {
    if (!val) return []
    return Array.isArray(val) ? val : [val]
}

// GBIS 시간값을 HH:MM:SS 포맷으로 변환
// "05:40" → "05:40:00" / "05:40:00" → "05:40:00"
const toHHMMSS = (val: unknown): string => {
    const str = String(val ?? '')
    if (/^\d{2}:\d{2}$/.test(str)) return `${str}:00`
    if (/^\d{2}:\d{2}:\d{2}$/.test(str)) return str
    const padded = str.padStart(6, '0')
    return `${padded.slice(0, 2)}:${padded.slice(2, 4)}:${padded.slice(4, 6)}`
}

export const searchGbisRoutes = async (keyword: string): Promise<GbisRoute[]> => {
    const res = await axios.get('/gbis-api/6410000/busrouteservice/v2/getBusRouteListv2', {
        params: {
            serviceKey: getGbisApiKey(),
            keyword,
            numOfRows: 20,
            pageNo: 1,
            format: 'json',
        },
    })
    const list = toArray(res.data?.response?.msgBody?.busRouteList)
    return list.map((item: Record<string, string>) => ({
        routeId: item.routeId,
        routeName: item.routeName,
        routeTypeCd: item.routeTypeCd,
        routeTypeName: item.routeTypeName,
        districtCd: item.districtCd,
        companyId: item.companyId,
        companyName: item.companyName,
        startStationId: item.startStationId,
        endStationId: item.endStationId,
        startStationName: item.startStationName,
        endStationName: item.endStationName,
        upFirstTime: toHHMMSS(item.upFirstTime),
        upLastTime: toHHMMSS(item.upLastTime),
        downFirstTime: toHHMMSS(item.downFirstTime),
        downLastTime: toHHMMSS(item.downLastTime),
    }))
}

export const getGbisRouteInfo = async (routeId: string): Promise<GbisRouteDetail> => {
    const res = await axios.get('/gbis-api/6410000/busrouteservice/v2/getBusRouteInfoItemv2', {
        params: {
            serviceKey: getGbisApiKey(),
            routeId,
            format: 'json',
        },
    })
    const item = res.data?.response?.msgBody?.busRouteInfoItem
    return {
        routeId: String(item.routeId),
        routeName: String(item.routeName),
        routeTypeCd: String(item.routeTypeCd),
        routeTypeName: String(item.routeTypeName),
        districtCd: String(item.districtCd),
        companyId: String(item.companyId),
        companyName: String(item.companyName),
        companyTel: String(item.companyTel ?? ''),
        startStationId: String(item.startStationId),
        endStationId: String(item.endStationId),
        startStationName: String(item.startStationName ?? ''),
        endStationName: String(item.endStationName ?? ''),
        upFirstTime: toHHMMSS(item.upFirstTime),
        upLastTime: toHHMMSS(item.upLastTime),
        downFirstTime: toHHMMSS(item.downFirstTime),
        downLastTime: toHHMMSS(item.downLastTime),
    }
}

export const getGbisRouteStations = async (routeId: string): Promise<GbisRouteStation[]> => {
    const res = await axios.get('/gbis-api/6410000/busrouteservice/v2/getBusRouteStationListv2', {
        params: {
            serviceKey: getGbisApiKey(),
            routeId,
            format: 'json',
        },
    })
    const list = toArray(res.data?.response?.msgBody?.busRouteStationList)
    return list.map((item: Record<string, unknown>) => ({
        stationId: String(item.stationId),
        stationName: String(item.stationName),
        mobileNo: String(item.mobileNo),
        regionName: String(item.regionName ?? ''),
        districtCd: String(item.districtCd),
        gpsLati: String(item.y),
        gpsLong: String(item.x),
        stationSeq: String(item.stationSeq),
        turnYn: String(item.turnYn ?? 'N'),
    }))
}

export const searchGbisStops = async (keyword: string): Promise<GbisStop[]> => {
    const res = await axios.get('/gbis-api/6410000/busstationservice/v2/getBusStationListv2', {
        params: {
            serviceKey: getGbisApiKey(),
            keyword,
            format: 'json',
        },
    })
    const list = toArray(res.data?.response?.msgBody?.busStationList)
    return list.map((item: Record<string, unknown>) => ({
        stationId: String(item.stationId),
        stationName: String(item.stationName),
        mobileNo: String(item.mobileNo),
        regionName: String(item.regionName ?? ''),
        districtCd: '2',
        gpsLati: String(item.y),
        gpsLong: String(item.x),
    }))
}
