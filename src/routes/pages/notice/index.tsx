import { SectionTabsLayout } from '../../components/SectionTabsLayout.tsx'

export default function Notice() {
    return (
        <SectionTabsLayout
            basePath='/notice'
            tabs={[
                { label: '분류 관리', path: 'category' },
                { label: '공지사항 관리', path: 'notice' },
            ]}
        />
    )
}
