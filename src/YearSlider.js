import React, { useRef, useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import { Slider } from '@mui/material';

export default function YearSlider() {
    return(
        <Box sx={{ width: 500, height: 200 }}>
            <Slider aria-label="Year" defaultValue={2021}  valueLabelDisplay="on" step={1} min={1950} max={2021} />
        </Box>
    );
}
