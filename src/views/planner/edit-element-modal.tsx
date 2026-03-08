import { useForm } from "react-hook-form";
import * as zod from "zod"
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";
import { ModalTransition } from "../../components/modals/modal-transition";
import { FormTextField } from "../../components/form-text-field/form-text-field";
import styled from "@emotion/styled";
import { useElementApiMediator } from "../../hooks/element/use-element-api-mediator";
import { ElectricElement } from "../../domain/electricelement/electric-element";

const ELEMENT_SCHEMA = zod.object({
    label: zod.string().min(1, "Field is required"),
}).required();

type ElementForm = {
    label: string;
}

type EditElementModalProps = {
    projectId: string;
    edit: boolean;
    element: ElectricElement | undefined;
    onSuccess: () => void;
    onCancel: () => void;
}

export const EditElementModal = ({
    projectId,
    edit,
    element,
    onSuccess,
    onCancel,
}: EditElementModalProps) => {
    const {
        create,
        update,
    } = useElementApiMediator();

    const {
        handleSubmit,
        control,
        setValue,
        formState: { errors, isValid },
    } = useForm<ElementForm>({
        resolver: zodResolver(ELEMENT_SCHEMA),
        defaultValues: {
            label: element?.label ?? '',
        },
        reValidateMode: 'onChange',
    })

    const onApply = (data: ElementForm) => {
        if (isValid) {
            (
                edit && element?.id
                    ? update(ElectricElement.createFromRaw(data))
                    : create(projectId, ElectricElement.createFromRaw(data))
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
            <DialogTitle data-cy="edit_element_modal_title">{`${edit ? 'Edit' : 'Create'} element`}</DialogTitle>
            <StyledDialogContent>
                <form>
                    <StyledCol>
                        <StyledRow>
                            <FormTextField
                                control={control}
                                errors={errors}
                                label='Name'
                                name='label'
                                onClear={() => setValue('label', '')}
                                testId='edit_element_modal_name_tf'
                            />
                        </StyledRow>
                    </StyledCol>
                </form>
            </StyledDialogContent>
            <DialogActions>
                <Button onClick={onCancel} variant='outlined' color='secondary' data-cy="edit_element_modal_cancel_btn">Cancel</Button>
                <Button onClick={handleSubmit(onApply)} color="primary" data-cy="edit_element_modal_apply_btn">Agree</Button>
            </DialogActions>
        </Dialog>
    );
}

const StyledDialogContent = styled(DialogContent)`
    padding-top: 20px !important;
`;

const StyledCol = styled.div`
    display: flex;
    flex-direction: column;
    gap: 1rem;
    min-width: 300px;
`;

const StyledRow = styled.div`
    display: flex;
    gap: 1rem;
    align-items: center;
`;