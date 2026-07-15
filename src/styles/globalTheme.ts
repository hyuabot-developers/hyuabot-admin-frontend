import { createTheme } from '@mui/material'

export const globalTheme = createTheme({
    cssVariables: {
        colorSchemeSelector: 'data',
    },
    colorSchemes: {
        light: {
            palette: {
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
                divider: '#dfe3ea',
            },
        },
        dark: {
            palette: {
                primary: {
                    main: '#78b7f2',
                    light: '#a6d1ff',
                    dark: '#4b8bc6',
                    contrastText: '#071426',
                },
                secondary: {
                    main: '#ffb45e',
                    contrastText: '#291700',
                },
                background: {
                    default: '#0f1724',
                    paper: '#182334',
                },
                text: {
                    primary: '#f3f6fb',
                    secondary: '#b6c0cf',
                },
                divider: '#344154',
            },
        },
    },
    typography: {
        fontFamily: 'Godo, Pretendard, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
        h4: {
            fontSize: 'clamp(1.625rem, 3vw, 2rem)',
            letterSpacing: '-0.02em',
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
                paper: ({ theme }) => ({
                    borderRightColor: theme.vars.palette.divider,
                }),
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
                root: ({ theme }) => ({
                    '&:not(.Mui-disabled) .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#7b8495',
                    },
                    '&:not(.Mui-disabled):hover .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#5d6678',
                    },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#0e4a84',
                    },
                    ...theme.applyStyles('dark', {
                        '&:not(.Mui-disabled) .MuiOutlinedInput-notchedOutline': {
                            borderColor: '#7f8da3',
                        },
                        '&:not(.Mui-disabled):hover .MuiOutlinedInput-notchedOutline': {
                            borderColor: '#b6c0cf',
                        },
                        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                            borderColor: '#78b7f2',
                        },
                    }),
                }),
            },
        },
    },
})
