import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';

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
    const [open, setOpen] = React.useState(props.open);
    const handleClose = () => setOpen(false);
    const countryCode = props.country.ISO_A3;
    const chartData = prepareChartData(countryCode);

    return (
        <Modal open={open} onClose={props.close}>
            <Box sx={{ position: 'absolute', top:'20%', left:'10%', width: '80%', height: '70%', bgcolor: 'background.paper'}}>
                <Typography id="modal-modal-title" variant="h6" component="h2">
                    {props.country.ADMIN}
                </Typography>
                <Box sx={{ padding: 2, width: 'calc(100% - 48px)', height: 'calc(100% - 48px)' }}>
                    <div style={{ width: '100%', height: '100%' }}>
                        <Bar data={chartData} options={chartOptions} />
                    </div>
                </Box>
            </Box>
        </Modal>
    );
}
