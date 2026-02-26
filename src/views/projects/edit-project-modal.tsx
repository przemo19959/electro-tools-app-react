import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Slide from '@mui/material/Slide';
import { type TransitionProps } from '@mui/material/transitions';
import * as zod from "zod"
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod"
import { IconButton, InputAdornment, TextField } from '@mui/material';
import type { Project } from './projects';
import styled from '@emotion/styled';
import ClearIcon from '@mui/icons-material/Clear';

const Transition = React.forwardRef(function Transition(
    props: TransitionProps & {
        children: React.ReactElement<any, any>;
    },
    ref: React.Ref<unknown>,
) {
    return <Slide direction="up" ref={ref} {...props} />;
});

const PROJECT_SCHEMA = zod.object({
    name: zod.string().min(1, "Field is required"),
}).required();

type ProjectForm = {
    name: string;
}

type EditProjectModalProps = {
    edit: boolean;
    project: Project | undefined;
    onSuccess: () => void;
    onCancel: () => void;
}

export const EditProjectModal = ({
    edit,
    project,
    onSuccess,
    onCancel,
}: EditProjectModalProps) => {
    const {
        handleSubmit,
        control,
        setValue,
        formState: { errors, isValid },
    } = useForm<ProjectForm>({
        resolver: zodResolver(PROJECT_SCHEMA),
        defaultValues: {
            name: project?.name ?? '',
        },
        reValidateMode: 'onChange',
    })

    const onApply = (data: ProjectForm) => {
        if (isValid) {
            console.log(data);
            //call update/create API
            onSuccess();
        }
    };

    return (
        <Dialog
            open
            slots={{
                transition: Transition,
            }}
            keepMounted
            onClose={onCancel}
        >
            <DialogTitle>{`${edit ? 'Edit' : 'Create'} project`}</DialogTitle>
            <StyledDialogContent>
                <form>
                    <StyledCol>
                        <Controller
                            name="name"
                            control={control}
                            render={({ field }) => {
                                const hasError = Boolean(errors[field.name]);
                                return (
                                    <TextField
                                        label="Name"
                                        variant="outlined"
                                        size="small"
                                        value={field.value}
                                        onChange={field.onChange}
                                        error={hasError}
                                        helperText={hasError ? errors[field.name]?.message : ''}
                                        slotProps={{
                                            input: {
                                                endAdornment: (
                                                    <InputAdornment position="end">
                                                        {field.value && (
                                                            <IconButton onClick={() => setValue('name', '')} size="small">
                                                                <ClearIcon />
                                                            </IconButton>
                                                        )}
                                                    </InputAdornment>
                                                ),
                                            },
                                        }}
                                    />
                                );
                            }}
                        />
                    </StyledCol>
                </form>
            </StyledDialogContent>
            <DialogActions>
                <Button onClick={onCancel} variant='outlined' color='secondary'>Cancel</Button>
                <Button onClick={handleSubmit(onApply)} color="primary">Agree</Button>
            </DialogActions>
        </Dialog>
    );
};

const StyledDialogContent = styled(DialogContent)`
    padding-top: 20px !important;
`;

const StyledCol = styled.div`
    display: flex;
    flex-direction: column;
    gap: 1rem;
    min-width: 300px;
`;