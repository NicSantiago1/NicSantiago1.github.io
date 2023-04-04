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
                        2020 {props.active.name}
                    </Typography>
                    <Stack spacing={0}>
                        <Typography variant="body1" >
                            <CircleIcon ml={1} sx={{ color: '#0D4D00', fontSize: 15, paddingRight: 1}} />
                            250,000
                        </Typography>
                        <Typography variant="body1">
                            <CircleIcon sx={{ color: '#22CC00', fontSize: 15, paddingRight: 1}} />
                            100,000
                        </Typography>
                        <Typography variant="body1">
                            <CircleIcon sx={{ color: '#80FF66', fontSize: 15, paddingRight: 1}} />
                            0
                        </Typography>
                        <Typography variant="body1">
                            <CircleIcon sx={{ color: '#FF3333', fontSize: 15, paddingRight: 1}} />
                            -100,000
                        </Typography>
                        <Typography variant="body1">
                            <CircleIcon sx={{ color: '#CC0000', fontSize: 15, paddingRight: 1}} />
                            -250,000
                        </Typography>
                    </Stack>
                </CardContent>
            </Card>
        </Box>
    );
}