import React, { useRef, useEffect, useState } from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import { ThemeProvider, createTheme } from '@mui/material/styles';

const darkTheme = createTheme({
    palette: {
        mode: 'dark',
        primary: {
          main: '#1976d2',
        },
      },
});

const filters = ['Year', 'Country', 'Migration Flow'];

export default function NavBar() {
    return(
        <Box sx={{ flexGrow: 1}}>
            <ThemeProvider theme={darkTheme}>
                <AppBar position="static" color="primary">
                    <Toolbar>
                        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                            Migration Data Project
                        </Typography>
                        <Box sx={{ flexGrow: 7, display: { xs: 'none', md: 'flex' } }}>
                            {filters.map((filter) => (
                            <Button key={filter} sx={{ my: 2, color: 'white', display: 'block' }}>
                                {filter}
                            </Button>
                        ))}
                        </Box>
                    </Toolbar>
                </AppBar>
            </ThemeProvider>
        </Box>
    );
}