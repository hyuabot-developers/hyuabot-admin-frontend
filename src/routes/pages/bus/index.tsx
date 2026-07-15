import { SectionTabsLayout } from '../../components/SectionTabsLayout.tsx'

export default function Bus() {
    return (
        <SectionTabsLayout
            basePath='/bus'
            tabs={[
                { label: '노선 관리', path: 'route' },
                { label: '정류장 관리', path: 'stop' },
                { label: '노선별 정류장 관리', path: 'routeStop' },
                { label: '시간표 관리', path: 'timetable' },
                { label: '실시간 도착 정보', path: 'realtime' },
                { label: '도착 기록', path: 'log' },
                { label: '공휴일 관리', path: 'holiday' },
            ]}
        />
    )
}
