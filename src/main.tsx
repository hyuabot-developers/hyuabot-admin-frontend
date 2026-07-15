import { Global } from '@emotion/react'
import { CssBaseline, ThemeProvider } from '@mui/material'
import { createRoot } from 'react-dom/client'

import Router from './routes'
import { globalStyle } from './styles/globalStyle.ts'
import { globalTheme } from './styles/globalTheme.ts'



createRoot(document.getElementById('root')!).render(
    <ThemeProvider theme={globalTheme}>
        <CssBaseline />
        <Global styles={globalStyle} />
        <Router />
    </ThemeProvider>
)
