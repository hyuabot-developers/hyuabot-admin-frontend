import { SectionTabsLayout } from '../../components/SectionTabsLayout.tsx'

export default function Cafeteria() {
    return (
        <SectionTabsLayout
            basePath='/cafeteria'
            tabs={[
                { label: '식당 관리', path: 'cafeteria' },
                { label: '메뉴 관리', path: 'menu' },
            ]}
        />
    )
}
