import { SectionTabsLayout } from '../../components/SectionTabsLayout.tsx'

export default function Shuttle() {
    return (
        <SectionTabsLayout
            basePath='/shuttle'
            tabs={[
                { label: '운행 기간 관리', path: 'period' },
                { label: '휴일 관리', path: 'holiday' },
                { label: '노선 관리', path: 'route' },
                { label: '정류장 관리', path: 'stop' },
                { label: '노선별 정류장 관리', path: 'routeStop' },
                { label: '시간표 관리', path: 'timetable' },
                { label: '시간표 (뷰)', path: 'timetableView' },
            ]}
        />
    )
}
