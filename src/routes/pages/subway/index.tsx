import { SectionTabsLayout } from '../../components/SectionTabsLayout.tsx'

export default function Subway() {
    return (
        <SectionTabsLayout
            basePath='/subway'
            tabs={[
                { label: '노선 관리', path: 'route' },
                { label: '전철역 관리', path: 'station' },
                { label: '시간표 관리', path: 'timetable' },
                { label: '실시간 도착 정보', path: 'realtime' },
                { label: '공휴일 관리', path: 'holiday' },
            ]}
        />
    )
}
