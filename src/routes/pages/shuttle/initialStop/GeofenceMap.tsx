import {
    Alert,
    Box,
    Button,
    Chip,
    CircularProgress,
    Stack,
} from '@mui/material'
import { useEffect, useRef, useState } from 'react'

import { loadNaverMaps } from './loadNaverMaps.ts'
import type {
    ShuttleGeoPoint,
    ShuttleStopResponse,
} from '../../../../service/network/shuttle.ts'

const ERICA_CENTER = { latitude: 37.2964, longitude: 126.8352 }
const NAVER_MAP_CLIENT_ID = import.meta.env.VITE_NAVER_MAP_CLIENT_ID?.trim() ?? ''

type GeofenceMapProps = {
    polygon: ShuttleGeoPoint[],
    stops: ShuttleStopResponse[],
    selectedStopName: string,
    onPolygonChange: (polygon: ShuttleGeoPoint[]) => void,
    onStopSelect: (stopName: string) => void,
}

export function GeofenceMap({
    polygon,
    stops,
    selectedStopName,
    onPolygonChange,
    onStopSelect,
}: GeofenceMapProps) {
    const containerRef = useRef<HTMLDivElement | null>(null)
    const polygonRef = useRef(polygon)
    const onPolygonChangeRef = useRef(onPolygonChange)
    const onStopSelectRef = useRef(onStopSelect)
    const [map, setMap] = useState<naver.maps.Map | null>(null)
    const [loadError, setLoadError] = useState('')
    const [retryCount, setRetryCount] = useState(0)

    polygonRef.current = polygon
    onPolygonChangeRef.current = onPolygonChange
    onStopSelectRef.current = onStopSelect

    useEffect(() => {
        if (NAVER_MAP_CLIENT_ID.length === 0) {
            setLoadError('네이버 지도 Client ID가 설정되지 않았습니다.')
            return
        }

        let active = true
        let authenticationFailed = false
        let mapInstance: naver.maps.Map | null = null
        const previousAuthenticationFailure = window.navermap_authFailure
        const handleAuthenticationFailure = () => {
            if (authenticationFailed) return
            authenticationFailed = true
            previousAuthenticationFailure?.()
            if (!active) return

            mapInstance?.destroy()
            mapInstance = null
            setMap(null)
            setLoadError('네이버 지도 인증에 실패했습니다. Client ID와 Web 서비스 URL을 확인해 주세요.')
        }
        window.navermap_authFailure = handleAuthenticationFailure
        setLoadError('')

        void loadNaverMaps(NAVER_MAP_CLIENT_ID)
            .then(() => {
                if (!active || authenticationFailed || containerRef.current === null) return

                mapInstance = new naver.maps.Map(containerRef.current, {
                    center: new naver.maps.LatLng(
                        ERICA_CENTER.latitude,
                        ERICA_CENTER.longitude,
                    ),
                    scaleControl: true,
                    scrollWheel: true,
                    zoom: 15,
                    zoomControl: true,
                    zoomControlOptions: {
                        position: naver.maps.Position.TOP_RIGHT,
                    },
                })
                setMap(mapInstance)
            })
            .catch(() => {
                if (active) setLoadError('네이버 지도를 불러오지 못했습니다.')
            })

        return () => {
            active = false
            mapInstance?.destroy()
            if (window.navermap_authFailure === handleAuthenticationFailure) {
                window.navermap_authFailure = previousAuthenticationFailure
            }
        }
    }, [retryCount])

    useEffect(() => {
        if (map === null) return

        const listener = naver.maps.Event.addListener(
            map,
            'click',
            (event: naver.maps.PointerEvent) => {
                const position = event.coord as naver.maps.LatLng
                onPolygonChangeRef.current([
                    ...polygonRef.current,
                    {
                        latitude: position.lat(),
                        longitude: position.lng(),
                    },
                ])
            },
        )

        return () => naver.maps.Event.removeListener(listener)
    }, [map])

    useEffect(() => {
        if (map === null || polygon.length < 3) return

        const positions = polygon.map(
            ({ latitude, longitude }) => new naver.maps.LatLng(latitude, longitude),
        )
        const overlay = new naver.maps.Polygon({
            fillColor: '#3f73b4',
            fillOpacity: 0.22,
            map,
            paths: [positions],
            strokeColor: '#0e4a84',
            strokeOpacity: 1,
            strokeWeight: 3,
        })
        map.fitBounds(positions, {
            bottom: 36,
            left: 36,
            maxZoom: 17,
            right: 36,
            top: 36,
        })

        return () => overlay.setMap(null)
    }, [map, polygon])

    useEffect(() => {
        if (map === null) return

        const markers = polygon.map((point, index) => {
            const marker = new naver.maps.Marker({
                clickable: true,
                cursor: 'grab',
                draggable: true,
                icon: {
                    anchor: new naver.maps.Point(14, 14),
                    content: `<span class="geofence-vertex">${index + 1}</span>`,
                    size: new naver.maps.Size(28, 28),
                },
                map,
                position: new naver.maps.LatLng(point.latitude, point.longitude),
                title: `꼭짓점 ${index + 1}`,
                zIndex: 200,
            })
            const listener = naver.maps.Event.addListener(marker, 'dragend', () => {
                const position = marker.getPosition() as naver.maps.LatLng
                onPolygonChangeRef.current(
                    polygonRef.current.map((current, pointIndex) =>
                        pointIndex === index
                            ? {
                                latitude: position.lat(),
                                longitude: position.lng(),
                            }
                            : current,
                    ),
                )
            })

            return { marker, listener }
        })

        return () => {
            markers.forEach(({ marker, listener }) => {
                naver.maps.Event.removeListener(listener)
                marker.setMap(null)
            })
        }
    }, [map, polygon])

    useEffect(() => {
        if (map === null) return

        const infoWindow = new naver.maps.InfoWindow({
            borderWidth: 0,
            content: '',
            disableAnchor: true,
            pixelOffset: new naver.maps.Point(0, -12),
        })
        const markers = stops.map((stop) => {
            const selected = stop.name === selectedStopName
            const marker = new naver.maps.Marker({
                clickable: true,
                cursor: 'pointer',
                icon: {
                    anchor: new naver.maps.Point(selected ? 9 : 7, selected ? 9 : 7),
                    content: `<span class="geofence-stop-marker${selected ? ' is-selected' : ''}"></span>`,
                    size: new naver.maps.Size(selected ? 18 : 14, selected ? 18 : 14),
                },
                map,
                position: new naver.maps.LatLng(stop.latitude, stop.longitude),
                title: stop.name,
                zIndex: selected ? 150 : 100,
            })
            const listener = naver.maps.Event.addListener(
                marker,
                'click',
                (event: naver.maps.PointerEvent) => {
                    event.pointerEvent.stopPropagation()
                    onStopSelectRef.current(stop.name)

                    const content = document.createElement('span')
                    content.className = 'geofence-stop-label'
                    content.textContent = stop.name
                    infoWindow.setContent(content)
                    infoWindow.open(map, marker)
                },
            )

            return { marker, listener }
        })

        return () => {
            infoWindow.close()
            markers.forEach(({ marker, listener }) => {
                naver.maps.Event.removeListener(listener)
                marker.setMap(null)
            })
        }
    }, [map, selectedStopName, stops])

    return (
        <Box sx={{
            position: 'relative',
            height: { xs: 420, md: 620 },
            minHeight: 360,
            overflow: 'hidden',
            borderRadius: 3,
            border: 1,
            borderColor: 'divider',
            bgcolor: 'background.paper',
            '& .geofence-vertex': {
                display: 'grid',
                placeItems: 'center',
                width: 28,
                height: 28,
                borderRadius: '50%',
                bgcolor: 'primary.main',
                color: 'primary.contrastText',
                border: '3px solid white',
                boxShadow: '0 2px 8px rgb(0 0 0 / 35%)',
                fontSize: 12,
                fontWeight: 800,
            },
            '& .geofence-stop-marker': {
                display: 'block',
                width: 14,
                height: 14,
                borderRadius: '50%',
                bgcolor: '#ffffff',
                border: '2px solid #5d6678',
                boxShadow: '0 1px 4px rgb(0 0 0 / 30%)',
                boxSizing: 'border-box',
            },
            '& .geofence-stop-marker.is-selected': {
                width: 18,
                height: 18,
                bgcolor: 'secondary.main',
                border: '4px solid #ffffff',
                boxShadow: '0 0 0 2px #f08100, 0 2px 8px rgb(0 0 0 / 35%)',
            },
            '& .geofence-stop-label': {
                display: 'block',
                px: 1.5,
                py: 1,
                borderRadius: 1,
                bgcolor: 'background.paper',
                color: 'text.primary',
                boxShadow: 3,
                fontFamily: 'inherit',
                fontSize: 13,
                fontWeight: 750,
                whiteSpace: 'nowrap',
            },
        }}>
            <Box
                ref={containerRef}
                sx={{
                    width: '100%',
                    height: '100%',
                    cursor: 'crosshair',
                }}
            />
            {map === null && loadError.length === 0 && (
                <Stack
                    spacing={1.5}
                    sx={{
                        position: 'absolute',
                        inset: 0,
                        alignItems: 'center',
                        justifyContent: 'center',
                        bgcolor: 'background.paper',
                    }}>
                    <CircularProgress size={32} />
                    <Box component='span' sx={{ color: 'text.secondary', fontSize: 14 }}>
                        네이버 지도를 불러오는 중입니다.
                    </Box>
                </Stack>
            )}
            {loadError.length > 0 && (
                <Stack
                    sx={{
                        position: 'absolute',
                        inset: 0,
                        alignItems: 'center',
                        justifyContent: 'center',
                        p: 2,
                        bgcolor: 'background.paper',
                    }}>
                    <Alert
                        action={NAVER_MAP_CLIENT_ID.length > 0 && (
                            <Button
                                color='inherit'
                                onClick={() => setRetryCount((count) => count + 1)}
                                size='small'>
                                다시 시도
                            </Button>
                        )}
                        severity='error'
                        sx={{ maxWidth: 520 }}>
                        {loadError}
                    </Alert>
                </Stack>
            )}
            <Stack
                direction='row'
                spacing={1}
                sx={{
                    position: 'absolute',
                    zIndex: 2,
                    top: 12,
                    left: 12,
                    pointerEvents: 'none',
                }}>
                <Chip
                    label={`꼭짓점 ${polygon.length}개`}
                    size='small'
                    sx={{ bgcolor: 'background.paper', boxShadow: 2, fontWeight: 700 }}
                />
                {selectedStopName && (
                    <Chip
                        color='secondary'
                        label={`정류장 · ${selectedStopName}`}
                        size='small'
                        sx={{ boxShadow: 2, fontWeight: 700 }}
                    />
                )}
            </Stack>
        </Box>
    )
}
