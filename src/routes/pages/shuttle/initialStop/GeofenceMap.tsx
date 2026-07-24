import { Box, Chip, Stack, Typography } from '@mui/material'
import L, { type LeafletEvent } from 'leaflet'
import { useEffect } from 'react'
import {
    CircleMarker,
    MapContainer,
    Marker,
    Polygon,
    Popup,
    TileLayer,
    useMap,
    useMapEvents,
} from 'react-leaflet'

import type {
    ShuttleGeoPoint,
    ShuttleStopResponse,
} from '../../../../service/network/shuttle.ts'

const ERICA_CENTER: [number, number] = [37.2964, 126.8352]
const TILE_URL = import.meta.env.VITE_MAP_TILE_URL || 'https://tile.openstreetmap.org/{z}/{x}/{y}.png'
const TILE_ATTRIBUTION = import.meta.env.VITE_MAP_TILE_ATTRIBUTION ||
    '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'

type GeofenceMapProps = {
    polygon: ShuttleGeoPoint[],
    stops: ShuttleStopResponse[],
    selectedStopName: string,
    onPolygonChange: (polygon: ShuttleGeoPoint[]) => void,
    onStopSelect: (stopName: string) => void,
}

function MapClickHandler({
    onAdd,
}: {
    onAdd: (point: ShuttleGeoPoint) => void,
}) {
    useMapEvents({
        click: ({ latlng }) => {
            onAdd({
                latitude: latlng.lat,
                longitude: latlng.lng,
            })
        },
    })
    return null
}

function PolygonViewport({ polygon }: { polygon: ShuttleGeoPoint[] }) {
    const map = useMap()

    useEffect(() => {
        if (polygon.length >= 3) {
            map.fitBounds(
                polygon.map((point) => [point.latitude, point.longitude]),
                { padding: [36, 36], maxZoom: 17 },
            )
        }
    }, [map, polygon])

    return null
}

const vertexIcon = (index: number) =>
    L.divIcon({
        className: '',
        html: `<span class="geofence-vertex">${index + 1}</span>`,
        iconSize: [28, 28],
        iconAnchor: [14, 14],
    })

export function GeofenceMap({
    polygon,
    stops,
    selectedStopName,
    onPolygonChange,
    onStopSelect,
}: GeofenceMapProps) {
    const updateVertex = (index: number, event: LeafletEvent) => {
        const marker = event.target as L.Marker
        const position = marker.getLatLng()
        onPolygonChange(
            polygon.map((point, pointIndex) =>
                pointIndex === index
                    ? { latitude: position.lat, longitude: position.lng }
                    : point,
            ),
        )
    }

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
            '& .leaflet-container': {
                width: '100%',
                height: '100%',
                fontFamily: 'inherit',
                cursor: 'crosshair',
            },
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
        }}>
            <MapContainer center={ERICA_CENTER} zoom={15} scrollWheelZoom>
                <TileLayer
                    attribution={TILE_ATTRIBUTION}
                    url={TILE_URL}
                    maxZoom={19}
                />
                <MapClickHandler
                    onAdd={(point) => onPolygonChange([...polygon, point])}
                />
                <PolygonViewport polygon={polygon} />
                {polygon.length >= 3 && (
                    <Polygon
                        positions={polygon.map((point) => [point.latitude, point.longitude])}
                        pathOptions={{
                            color: '#0e4a84',
                            fillColor: '#3f73b4',
                            fillOpacity: 0.22,
                            weight: 3,
                        }}
                    />
                )}
                {polygon.map((point, index) => (
                    <Marker
                        draggable
                        eventHandlers={{
                            dragend: (event) => updateVertex(index, event),
                        }}
                        icon={vertexIcon(index)}
                        key={`${index}-${point.latitude}-${point.longitude}`}
                        position={[point.latitude, point.longitude]}
                    />
                ))}
                {stops.map((stop) => {
                    const selected = stop.name === selectedStopName
                    return (
                        <CircleMarker
                            center={[stop.latitude, stop.longitude]}
                            eventHandlers={{ click: () => onStopSelect(stop.name) }}
                            key={stop.name}
                            pathOptions={{
                                color: selected ? '#f08100' : '#5d6678',
                                fillColor: selected ? '#f08100' : '#ffffff',
                                fillOpacity: 1,
                                weight: selected ? 4 : 2,
                            }}
                            radius={selected ? 9 : 6}>
                            <Popup>
                                <Typography component='span' sx={{ fontWeight: 750 }}>
                                    {stop.name}
                                </Typography>
                            </Popup>
                        </CircleMarker>
                    )
                })}
            </MapContainer>
            <Stack
                direction='row'
                spacing={1}
                sx={{
                    position: 'absolute',
                    zIndex: 500,
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
