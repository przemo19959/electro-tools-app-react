import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';

import * as zod from "zod"
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod"
import { IconButton, InputAdornment, TextField } from '@mui/material';
import styled from '@emotion/styled';
import ClearIcon from '@mui/icons-material/Clear';
import { useProjectApi } from '../../hooks/project/use-project-api';
import type { ReadProjectDto } from '../../api/api';
import { ModalTransition } from '../../components/modals/modal-transition';

const PROJECT_SCHEMA = zod.object({
    name: zod.string().min(1, "Field is required"),
}).required();

type ProjectForm = {
    name: string;
}

type EditProjectModalProps = {
    edit: boolean;
    project: ReadProjectDto | undefined;
    onSuccess: () => void;
    onCancel: () => void;
}

export const EditProjectModal = ({
    edit,
    project,
    onSuccess,
    onCancel,
}: EditProjectModalProps) => {
    const { create, update } = useProjectApi();

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
            (
                edit && project?.id
                    ? update(project.id, { name: data.name })
                    : create({ name: data.name })
            ).then(onSuccess)
        }
    };

    return (
        <Dialog
            open
            slots={{
                transition: ModalTransition,
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