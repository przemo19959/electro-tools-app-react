import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import styled from '@emotion/styled';
import { ModalTransition } from './modal-transition';

type ConfirmModalProps = {
    message: string;
    onClose: () => void;
    onConfirm: () => void;
}

export const ConfirmModal = ({
    message,
    onClose,
    onConfirm,
}: ConfirmModalProps) => {
    return (
        <Dialog
            open
            slots={{
                transition: ModalTransition,
            }}
            keepMounted
            onClose={onClose}
        >
            <StyledDialogTitle>
                <InfoOutlinedIcon fontSize="small" />
                Confirmation
            </StyledDialogTitle>
            <DialogContent>
                <DialogContentText>{message}</DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} variant='outlined' color='secondary'>Cancel</Button>
                <Button onClick={onConfirm} color='primary'>Confirm</Button>
            </DialogActions>
        </Dialog>
    );
};

const StyledDialogTitle = styled(DialogTitle)`
    display: flex;
    align-items: center;
    gap: 8px;
`;
