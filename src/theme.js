import { createTheme } from '@material-ui/core/styles';

// Create a theme instance.
const theme = createTheme({
  palette: {
    common: { black: '#000', white: '#fff' },
    background: { paper: '#fff', default: '#fafafa' },
    primary: {
      light: 'rgba(54, 85, 127, 1)',
      main: 'rgba(30, 54, 71, 1)',
      dark: 'rgba(24, 58, 99, 1)',
      contrastText: '#fff',
    },
    secondary: {
      light: 'rgba(199, 36, 36, 1)',
      main: 'rgba(159, 25, 21, 1)',
      dark: 'rgba(167, 8, 8, 1)',
      contrastText: '#fff',
    },
    error: {
      light: '#e57373',
      main: '#f44336',
      dark: '#d32f2f',
      contrastText: '#fff',
    },
    text: {
      primary: 'rgba(0, 0, 0, 0.87)',
      secondary: 'rgba(0, 0, 0, 0.54)',
      disabled: 'rgba(0, 0, 0, 0.38)',
      hint: 'rgba(0, 0, 0, 0.38)',
    },
  },
});

export default theme;
