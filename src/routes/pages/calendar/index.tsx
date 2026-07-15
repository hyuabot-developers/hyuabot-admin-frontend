import { SectionTabsLayout } from '../../components/SectionTabsLayout.tsx'

export default function Calendar() {
    return (
        <SectionTabsLayout
            basePath='/calendar'
            tabs={[
                { label: '분류 관리', path: 'category' },
                { label: '학사 일정 관리', path: 'event' },
            ]}
        />
    )
}
