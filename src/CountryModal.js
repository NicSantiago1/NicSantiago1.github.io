import React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';

export default function CountryModal(props) {
    const [open, setOpen] = React.useState(props.open);
    const handleClose = () => setOpen(false);

    return (
        <Modal open={open} onClose={props.close}>
            <Box sx={{ position: 'absolute', top:'20%', left:'10%', width: '80%', height: '70%', bgcolor: 'background.paper'}}>
                <Typography id="modal-modal-title" variant="h6" component="h2">
                    {props.country.ADMIN}
                </Typography>
            </Box>
        </Modal>
    );
}