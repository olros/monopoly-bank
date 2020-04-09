import { createMuiTheme } from '@material-ui/core/styles';

export default createMuiTheme({
    typography: {
      "fontFamily": "\"Krub\", \"Roboto\", \"Helvetica\", \"Arial\", sans-serif",
      useNextVariants: true,
    },
    palette: {
      primary: {
        main: '#F76C6C',
        contrastText: '#FFFFFF',
      },
      secondary: {
        main: '#1F0322',
        contrastText: '#FFFFFF',
      },
      error: {
        main: '#B71C1C',
        contrastText: '#ffffff',
      },
    },
});

export const errorTheme = createMuiTheme({
    typography: {
      useNextVariants: true,
    },
    palette: {
      primary: {
        main: '#B71C1C',
        contrastText: '#ffffff',
      },
      secondary: {
        main: '#009688',
        contrastText: '#ffffff',
      },
    },
});

