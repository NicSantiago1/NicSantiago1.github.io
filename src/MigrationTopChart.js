import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import { Doughnut } from "react-chartjs-2";
import ChartDataLabels from "chartjs-plugin-datalabels";

import migrationData from "./geodata/net_migration.json";
import countryNames from "./geodata/countrynames.json";

function processData(migrationData, year, mode) {
    const countryCodeToName = countryNames.reduce((acc, country) => {
        acc[country.alpha3] = country.country;
        return acc;
      }, {});
    const yearData = migrationData[year] || [];
    const filteredYearData = yearData.filter(({country}) => countryCodeToName.hasOwnProperty(country));
    const sortedData = [...filteredYearData].sort((a, b) => mode === "source" ? a.migrants - b.migrants : b.migrants - a.migrants);

    const topTen = sortedData.slice(0, 5);
    const other = sortedData.slice(5).reduce((acc, cur) => acc + cur.migrants, 0);

    const labels = topTen.map((entry) => countryCodeToName[entry.country]).concat("Other");
    const data = topTen.map((entry) => Math.abs(entry.migrants)).concat(Math.abs(other));

    return {
        labels: labels,
        datasets: [
            {
                label: mode === "source" ? "Source of Migrants" : "Destination of Migrants",
                data: data,
                backgroundColor: [
                    "#FF6384",
                    "#36A2EB",
                    "#FFCE56",
                    "#4BC0C0",
                    "#9966FF",
                    "#7F7F7F"
                ],
            },
        ],
    };
}


export default function MigrationTopChart({ year, mode, title }) {
    const [chartData, setChartData] = useState({});

    const chartOptions = {
        plugins: {
            legend: {
                display: false,
            },
            datalabels: {
                color: "#000",
                font: {
                    size: 14,
                },
                formatter: (value, context) => {
                    return context.chart.data.labels[context.dataIndex];
                },
            },
        },
    };

    useEffect(() => {
        let data = processData(migrationData, year, mode);
        setChartData(data);
    }, [year, mode]);

    return (
        <Box sx={{ flexGrow: 1 }}>
            <h3>{title} {year}</h3>
            {chartData.labels && chartData.labels.length > 0 && chartData.datasets && chartData.datasets.length > 0 && (
                <Doughnut data={chartData} options={chartOptions} plugins={[ChartDataLabels]} />
            )}
            {(!chartData.labels || chartData.labels.length === 0) && <p>No data available for this year.</p>}
        </Box>
    );
}
