import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';

import * as zod from "zod"
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod"
import styled from '@emotion/styled';
import { useProjectApi } from '../../hooks/project/use-project-api';
import type { ReadProjectDto } from '../../api/api';
import { ModalTransition } from '../../components/modals/modal-transition';
import { FormTextField } from '../../components/form-text-field/form-text-field';

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
            <DialogTitle data-cy="edit_project_modal_title">{`${edit ? 'Edit' : 'Create'} project`}</DialogTitle>
            <StyledDialogContent>
                <form>
                    <StyledCol>
                        <FormTextField
                            control={control}
                            errors={errors}
                            label='Name'
                            name='name'
                            onClear={() => setValue('name', '')}
                            testId='edit_project_modal_name_tf'
                        />
                    </StyledCol>
                </form>
            </StyledDialogContent>
            <DialogActions>
                <Button onClick={onCancel} variant='outlined' color='secondary' data-cy="edit_project_modal_cancel_btn">Cancel</Button>
                <Button onClick={handleSubmit(onApply)} color="primary" data-cy="edit_project_modal_apply_btn">Agree</Button>
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