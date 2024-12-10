import { createTheme } from '@mui/material';

const theme = createTheme({
    typography: {
        fontFamily: 'Roboto',
    },
    palette: {
        primary: {
            main: '#000',
        },
        secondary: {
            main: '#DC143C',
        },
    },
    components: {
        MuiTableCell: {
            styleOverrides: {
                head: { // Styles for TableHead cells
                    fontSize: '15px',
                    fontFamily: 'Roboto',
                    fontWeight: 500, // Bold for TableHead
                },
                body: { // Styles for TableBody cells
                    fontSize: '15px',
                    fontFamily: 'Roboto',
                    fontWeight: 300, // Lighter weight for TableBody
                },
            },
        },
    },
});

export default theme;