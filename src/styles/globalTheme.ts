import { createTheme } from '@mui/material'

export const globalTheme = createTheme({
    typography: {
        fontFamily: 'Godo, Pretendard, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
        h4: {
            fontSize: 'clamp(1.625rem, 3vw, 2rem)',
            letterSpacing: '-0.02em',
        },
    },
    palette: {
        mode: 'light',
        primary: {
            main: '#0e4a84',
            light: '#3f73b4',
            dark: '#002653',
        },
        secondary: {
            main: '#f08100',
        },
        background: {
            default: '#f5f7fa',
            paper: '#ffffff',
        },
        text: {
            primary: '#172033',
            secondary: '#5d6678',
        },
    },
    shape: {
        borderRadius: 12,
    },
    components: {
        MuiButton: {
            defaultProps: {
                disableElevation: true,
            },
            styleOverrides: {
                root: {
                    minHeight: 40,
                    textTransform: 'none',
                    fontWeight: 700,
                },
            },
        },
        MuiCard: {
            styleOverrides: {
                root: {
                    backgroundImage: 'none',
                },
            },
        },
        MuiDrawer: {
            styleOverrides: {
                paper: {
                    borderRightColor: '#dfe3ea',
                },
            },
        },
        MuiListItemButton: {
            styleOverrides: {
                root: {
                    borderRadius: 10,
                },
            },
        },
        MuiOutlinedInput: {
            styleOverrides: {
                root: {
                    '&:not(.Mui-disabled) .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#7b8495',
                    },
                    '&:not(.Mui-disabled):hover .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#5d6678',
                    },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#0e4a84',
                    },
                },
            },
        },
    },
})
