import { Global } from '@emotion/react'
import { ThemeProvider } from '@mui/material'
import { createRoot } from 'react-dom/client'

import Router from './routes'
import { globalStyle } from './styles/globalStyle.ts'
import { globalTheme } from './styles/globalTheme.ts'



createRoot(document.getElementById('root')!).render(
    <ThemeProvider theme={globalTheme}>
        <Global styles={globalStyle} />
        <Router />
    </ThemeProvider>
)