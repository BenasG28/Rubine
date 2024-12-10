import React from 'react';
import { Button } from '@mui/material';

const AddButton = ({ onClick, children, sx, ...props }) => {
    return (
        <Button
            variant="contained"
            onClick={onClick}
            sx={{
                marginBottom: 3,
                fontFamily: 'roboto',
                fontSize: {
                    xs: '10px',  // Mažesnis šrifto dydis telefonams (xs - mobile)
                    sm: '12px',  // Vidutiniai ekranai (sm - tablet)
                    md: '14px',  // Dideli ekranai (md - desktop)
                },
                fontWeight: 300,
                letterSpacing: '0.5px',
                textTransform: 'none',
                padding: {
                    xs: '4px 8px',  // Didesnis padding mobiliose įrenginiuose
                    sm: '5px 10px', // Vidutinio dydžio ekranams
                    md: '6px 12px', // Didesniems ekranams
                },
                borderRadius: '6px',
                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                transition: 'background-color 0.3s ease, transform 0.3s ease',
                '&:hover': {
                    backgroundColor: 'primary.dark',
                    transform: 'scale(1.05)',
                },
                '&:active': {
                    backgroundColor: 'primary.main',
                    transform: 'scale(1)',
                },
                '&:focus': {
                    outline: 'none',
                },
                minWidth: '50px', // Užtikrina, kad mygtukas netaps per mažas
                flexGrow: 0,
                flexShrink: 0,
                ...sx,
            }}
            {...props}
        >
            {children}
        </Button>
    );
};

export default AddButton;