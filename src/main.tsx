import { Global } from '@emotion/react'
import { CssBaseline, InitColorSchemeScript, ThemeProvider } from '@mui/material'
import { createRoot } from 'react-dom/client'

import Router from './routes'
import { globalStyle } from './styles/globalStyle.ts'
import { globalTheme } from './styles/globalTheme.ts'
const rootElement = document.getElementById('root')
if (rootElement === null) {
    throw new Error('Root element was not found')
}

createRoot(rootElement).render(
    <ThemeProvider
        theme={globalTheme}
        defaultMode='system'
        modeStorageKey='hyuabot.themeMode'
        disableTransitionOnChange>
        <InitColorSchemeScript defaultMode='system' modeStorageKey='hyuabot.themeMode' />
        <CssBaseline />
        <Global styles={globalStyle} />
        <Router />
    </ThemeProvider>
)
