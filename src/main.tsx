import { createRoot } from 'react-dom/client'
import Router from "./routes"
import { ThemeProvider } from "@mui/material"
import { globalTheme } from "./styles/globalTheme.ts"
import { Global } from "@emotion/react"
import { globalStyle } from "./styles/globalStyle.ts"

createRoot(document.getElementById('root')!).render(
    <ThemeProvider theme={globalTheme}>
        <Global styles={globalStyle} />
        <Router />
    </ThemeProvider>
)