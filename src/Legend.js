import React from "react";
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import CircleIcon from '@mui/icons-material/Circle';

export default function Legend(props) {
    return (
        <Box sx={{ flexGrow: 1 }}>
            <Card sx={{ maxWidth: 250, position: 'absolute', right: 0, bottom: 0, mb: 5, mr: 5 }}>
                <CardContent>
                    <Typography variant="h6" component="div">
                        {props.year} {props.active.name}
                    </Typography>
                    <Stack spacing={0}>
                        <Typography variant="body1" >
                            <CircleIcon ml={1} sx={{ color: '#0e5200', fontSize: 15, paddingRight: 1}} />
                            250,000
                        </Typography>
                        <Typography variant="body1">
                            <CircleIcon sx={{ color: '#59c942', fontSize: 15, paddingRight: 1}} />
                            100,000
                        </Typography>
                        <Typography variant="body1">
                            <CircleIcon sx={{ color: '#92cf86', fontSize: 15, paddingRight: 1}} />
                            50,000
                        </Typography>
                        <Typography variant="body1">
                            <CircleIcon sx={{ color: '#e1f7dc', fontSize: 15, paddingRight: 1}} />
                            0
                        </Typography>
                        <Typography variant="body1">
                            <CircleIcon sx={{ color: '#fa2020', fontSize: 15, paddingRight: 1}} />
                            -50,000
                        </Typography>
                        <Typography variant="body1">
                            <CircleIcon sx={{ color: '#b30404', fontSize: 15, paddingRight: 1}} />
                            -100,000
                        </Typography>
                        <Typography variant="body1">
                            <CircleIcon sx={{ color: '#7a0000', fontSize: 15, paddingRight: 1}} />
                            -250,000
                        </Typography>
                        <Typography variant="body1" >
                            <CircleIcon ml={1} sx={{ color: '#000000', fontSize: 15, paddingRight: 1 }} />
                            No Data
                        </Typography>
                    </Stack>
                </CardContent>
            </Card>
        </Box>
    );
}