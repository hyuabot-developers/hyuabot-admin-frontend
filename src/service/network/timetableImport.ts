import client from './client.ts'
import type { BulkSubwayTimetableCreateRequest } from './subway.ts'

export type TimetableImportIssue = {
    row: number | null,
    code: string,
    message: string,
}

export type TimetableImportChange = {
    type: 'CREATE' | 'UPDATE' | 'DELETE',
    identifier: string,
    before: string | null,
    after: string | null,
}

export type TimetableImportPreview = {
    previewID: string | null,
    expiresAt: string | null,
    createCount: number,
    updateCount: number,
    deleteCount: number,
    unchangedCount: number,
    errors: TimetableImportIssue[],
    warnings: TimetableImportIssue[],
    sampleChanges: TimetableImportChange[],
}

export type TimetableImportResult = Pick<
    TimetableImportPreview,
    'createCount' | 'updateCount' | 'deleteCount' | 'unchangedCount'
>

export type ShuttleTimetableImportEntry = {
    routeName: string,
    period: string,
    weekday: boolean,
    departureTime: string,
}

export const previewSubwayTimetableImport = async (
    stationIDs: string[],
    entries: BulkSubwayTimetableCreateRequest[],
) => client.post<TimetableImportPreview>('/api/v1/subway/timetable/import/preview', { stationIDs, entries })

export const applySubwayTimetableImport = async (previewID: string) =>
    client.post<TimetableImportResult>('/api/v1/subway/timetable/import/apply', { previewID })

export const previewShuttleTimetableImport = async (
    routeNames: string[],
    entries: ShuttleTimetableImportEntry[],
) => client.post<TimetableImportPreview>('/api/v1/shuttle/timetable/import/preview', { routeNames, entries })

export const applyShuttleTimetableImport = async (previewID: string) =>
    client.post<TimetableImportResult>('/api/v1/shuttle/timetable/import/apply', { previewID })
