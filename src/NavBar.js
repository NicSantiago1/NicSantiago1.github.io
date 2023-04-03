import React, { useRef, useEffect, useState } from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Slider from '@mui/material/Slider';
import MuiInput from '@mui/material/Input';
import Autocomplete from '@mui/material/Autocomplete';
import countryNames from './geodata/countrynames.json';

const darkTheme = createTheme({
    palette: {
        mode: 'dark',
        primary: {
          main: '#1976d2',
        },
      },
});

export default function NavBar({flyTo}) {
    const[country, setCountry] = React.useState(null);
    const [year, setYear] = React.useState(2020);

    const handleSliderChange = (event, newValue) => {
        setYear(newValue);
    };

    const handleInputChange = (event) => {
        setYear(event.target.value === '' ? '' : Number(event.target.value));
    };


    return(
        <Box sx={{ flexGrow: 1}}>
            <ThemeProvider theme={darkTheme}>
                <AppBar color="primary">
                    <Toolbar>
                        <Grid container spacing={3} columns = {24} alignItems="center">
                            <Grid item xs>
                                <Typography variant="h5" component="div">
                                    Migration Data Project
                                </Typography>   
                            </Grid>
                            <Grid item xs={14}>
                                <Slider
                                    value={typeof year === 'number' ? year : 2020}
                                    onChange={handleSliderChange}
                                    marks
                                    color="secondary"
                                    min={2000}
                                    max={2020}
                                />
                            </Grid>
                            <Grid item xs={4}>
                                <MuiInput
                                    value={year}
                                    size="small"
                                    onChange={handleInputChange}
                                    inputProps={{
                                      step: 1,
                                      min: 2000,
                                      max: 2020,
                                      type: 'number',
                                    }}
                                />
                            </Grid>
                        </Grid>
                        <Autocomplete 
                            id="country-search"
                            sx={{ width: 300 }} 
                            options={countryNames} 
                            autoHighlight 
                            getOptionLabel={(option) => option.country}
                            renderInput={(params) => <TextField {...params} label="Country"/>}
                            onChange={this.flyTo([(option) => option.longitude, (option) => option.latitude])}
                        />
                    </Toolbar>
                </AppBar>
            </ThemeProvider>
        </Box>
    );
}
