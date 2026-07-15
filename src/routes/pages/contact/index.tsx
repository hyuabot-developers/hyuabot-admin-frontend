import { SectionTabsLayout } from '../../components/SectionTabsLayout.tsx'

export default function Contact() {
    return (
        <SectionTabsLayout
            basePath='/contact'
            tabs={[
                { label: '분류 관리', path: 'category' },
                { label: '서울캠퍼스', path: 'seoul' },
                { label: 'ERICA 캠퍼스', path: 'erica' },
            ]}
        />
    )
}
