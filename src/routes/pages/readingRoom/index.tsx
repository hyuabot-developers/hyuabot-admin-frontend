import { SectionTabsLayout } from '../../components/SectionTabsLayout.tsx'

export default function ReadingRoom() {
    return (
        <SectionTabsLayout
            basePath='/readingRoom'
            tabs={[{ label: '열람실 관리', path: 'room' }]}
        />
    )
}
