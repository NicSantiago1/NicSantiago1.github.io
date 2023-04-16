import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';

// load and prepare data
import migrationData from './geodata/net_migration.json';

function prepareChartData(countryCode) {
    const years = Object.keys(migrationData);
    const labels = years;
    const data = years.map(year => {
        const country = migrationData[year].find(c => c.country === countryCode);
        return country ? country.migrants : 0;
    });

    return {
        labels,
        datasets: [
            {
                label: 'Net Migration',
                data,
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1,
            },
        ],
    };
}

const chartOptions = {
    maintainAspectRatio: false,
    responsive: true,
    scales: {
      x: {
        type: 'category',
      },
      y: {
        beginAtZero: true,
      },
    },
  };
  


export default function CountryModal(props) {
    const countryCode = props.country.ISO_A3;
    const chartData = prepareChartData(countryCode);

    return (
        <Paper elevation={3}>
            <Box sx={{ position: 'absolute', top:'10%', right:'1%', width: '20%', height: '86%', bgcolor: 'background.paper'}}>
                <Typography id="modal-modal-title" variant="h6" align="center" component="h2">
                    {props.country.ADMIN}
                    <Button onClick={props.handleClose} > Close </Button> 
                </Typography>
                <Box sx={{ padding: 2, width: 'calc(100% - 48px)', height: 'calc(100% - 48px)' }}>
                    <div style={{ width: '100%', height: '100%' }}>
                        <Bar data={chartData} options={chartOptions} />
                    </div>
                </Box>
            </Box>
        </Paper>
    );
}