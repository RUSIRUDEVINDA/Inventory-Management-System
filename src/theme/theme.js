import { createTheme } from '@mui/material/styles';

/**
 * Creates a MUI theme for the given color mode.
 * Palette.success/warning/error light & dark values flip between modes
 * so StockBadge can always use `success.light` for bg and `success.dark`
 * for text and remain readable in both light and dark mode.
 *
 * @param {'light'|'dark'} mode
 * @returns {import('@mui/material').Theme}
 */
const getTheme = (mode) =>
  createTheme({
    palette: {
      mode,
      primary: {
        main: '#6366f1',
        light: '#818cf8',
        dark: '#4338ca',
        contrastText: '#ffffff',
      },
      secondary: {
        main: '#8b5cf6',
        light: '#a78bfa',
        dark: '#7c3aed',
        contrastText: '#ffffff',
      },
      success: {
        main: '#22c55e',
        // light = chip background, dark = chip text — inverted per mode for contrast
        light: mode === 'dark' ? '#14532d' : '#dcfce7',
        dark: mode === 'dark' ? '#86efac' : '#15803d',
        contrastText: '#ffffff',
      },
      warning: {
        main: '#f59e0b',
        light: mode === 'dark' ? '#78350f' : '#fef3c7',
        dark: mode === 'dark' ? '#fcd34d' : '#b45309',
        contrastText: '#ffffff',
      },
      error: {
        main: '#ef4444',
        light: mode === 'dark' ? '#7f1d1d' : '#fee2e2',
        dark: mode === 'dark' ? '#fca5a5' : '#b91c1c',
        contrastText: '#ffffff',
      },
      info: {
        main: '#3b82f6',
        light: mode === 'dark' ? '#1e3a5f' : '#dbeafe',
        dark: mode === 'dark' ? '#93c5fd' : '#1d4ed8',
      },
      background: {
        default: mode === 'dark' ? '#0f172a' : '#f8fafc',
        paper: mode === 'dark' ? '#1e293b' : '#ffffff',
      },
      text: {
        primary: mode === 'dark' ? '#f1f5f9' : '#0f172a',
        secondary: mode === 'dark' ? '#94a3b8' : '#64748b',
        disabled: mode === 'dark' ? '#475569' : '#cbd5e1',
      },
      divider: mode === 'dark' ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.07)',
    },

    shape: { borderRadius: 10 },

    typography: {
      fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
      h4: { fontWeight: 700, letterSpacing: '-0.02em' },
      h5: { fontWeight: 600, letterSpacing: '-0.01em' },
      h6: { fontWeight: 600 },
      subtitle1: { fontWeight: 600 },
      subtitle2: { fontWeight: 600 },
      body2: { fontSize: '0.875rem' },
      caption: { fontSize: '0.75rem' },
    },

    components: {
      MuiCard: {
        styleOverrides: {
          root: ({ theme }) => ({
            boxShadow: 'none',
            border: `1px solid ${theme.palette.divider}`,
            borderRadius: theme.shape.borderRadius,
            backgroundImage: 'none',
          }),
        },
      },

      MuiCardContent: {
        styleOverrides: {
          root: {
            '&:last-child': { paddingBottom: 16 },
          },
        },
      },

      MuiChip: {
        styleOverrides: {
          root: {
            fontWeight: 600,
            borderRadius: 20,
            fontSize: '0.75rem',
          },
          label: {
            paddingLeft: 10,
            paddingRight: 10,
          },
        },
      },

      MuiButton: {
        styleOverrides: {
          root: {
            textTransform: 'none',
            fontWeight: 600,
            boxShadow: 'none',
            '&:hover': { boxShadow: 'none' },
          },
          containedPrimary: {
            background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
            '&:hover': {
              background: 'linear-gradient(135deg, #4338ca 0%, #7c3aed 100%)',
            },
          },
        },
      },

      MuiIconButton: {
        styleOverrides: {
          root: ({ theme }) => ({
            borderRadius: theme.shape.borderRadius,
          }),
        },
      },

      MuiAppBar: {
        defaultProps: { elevation: 0 },
        styleOverrides: {
          root: ({ theme }) => ({
            boxShadow: 'none',
            borderBottom: `1px solid ${theme.palette.divider}`,
            backgroundColor: theme.palette.background.paper,
            color: theme.palette.text.primary,
            backgroundImage: 'none',
          }),
        },
      },

      MuiDrawer: {
        styleOverrides: {
          paper: ({ theme }) => ({
            border: 'none',
            borderRight: `1px solid ${theme.palette.divider}`,
            backgroundImage: 'none',
          }),
        },
      },

      MuiTableHead: {
        styleOverrides: {
          root: ({ theme }) => ({
            '& .MuiTableCell-root': {
              fontWeight: 600,
              fontSize: '0.7rem',
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
              color: theme.palette.text.secondary,
              backgroundColor: theme.palette.background.default,
              borderBottom: `2px solid ${theme.palette.divider}`,
              paddingTop: 10,
              paddingBottom: 10,
            },
          }),
        },
      },

      MuiTableBody: {
        styleOverrides: {
          root: ({ theme }) => ({
            '& .MuiTableRow-root': {
              transition: 'background-color 0.15s ease',
              '&:hover': {
                backgroundColor:
                  theme.palette.mode === 'dark'
                    ? 'rgba(255,255,255,0.03)'
                    : 'rgba(99,102,241,0.03)',
              },
            },
          }),
        },
      },

      MuiTableRow: {
        styleOverrides: {
          root: {
            '&:last-child td, &:last-child th': { border: 0 },
          },
        },
      },

      MuiTableCell: {
        styleOverrides: {
          root: ({ theme }) => ({
            borderColor: theme.palette.divider,
            fontSize: '0.875rem',
          }),
        },
      },

      MuiTextField: {
        defaultProps: {
          size: 'small',
          variant: 'outlined',
        },
      },

      MuiOutlinedInput: {
        styleOverrides: {
          root: ({ theme }) => ({
            borderRadius: theme.shape.borderRadius,
          }),
        },
      },

      MuiDialog: {
        styleOverrides: {
          paper: ({ theme }) => ({
            backgroundImage: 'none',
            borderRadius: theme.shape.borderRadius * 1.5,
          }),
        },
      },

      MuiDialogTitle: {
        styleOverrides: {
          root: {
            fontWeight: 600,
          },
        },
      },

      MuiPaper: {
        styleOverrides: {
          root: {
            backgroundImage: 'none',
          },
        },
      },

      MuiListItemButton: {
        styleOverrides: {
          root: ({ theme }) => ({
            borderRadius: theme.shape.borderRadius,
          }),
        },
      },

      MuiSnackbar: {
        defaultProps: {
          anchorOrigin: { vertical: 'bottom', horizontal: 'right' },
        },
      },

      MuiAlert: {
        styleOverrides: {
          root: ({ theme }) => ({
            borderRadius: theme.shape.borderRadius,
            fontWeight: 500,
          }),
        },
      },
    },
  });

export default getTheme;
