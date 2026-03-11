import { IconButton, InputAdornment, TextField, Tooltip, type TextFieldProps } from "@mui/material";
import { Controller, type Control, type FieldValues, type Path } from "react-hook-form";
import ClearIcon from '@mui/icons-material/Clear';
import HelpIcon from '@mui/icons-material/Help';
import type { ReactNode } from "react";
import styled from "@emotion/styled";

type FormTextFieldProps<T extends FieldValues> = {
    label: string;
    name: string;
    control: Control<T, any, T>;
    testID: string;
    type?: TextFieldProps['type'];
    disabled?: TextFieldProps['disabled'];
    tooltip?: string;
    appendSlot?: ReactNode;
}

export const FormTextField = <T extends FieldValues,>({
    label,
    name,
    control,
    testID,
    type = 'text',
    tooltip,
    appendSlot,
    disabled = false,
}: FormTextFieldProps<T>) => (
    <Controller
        name={name as Path<T>}
        control={control}
        render={({ field, fieldState }) => {
            const hasError = Boolean(fieldState.error);

            return (
                <TextField
                    label={label}
                    variant="outlined"
                    size="small"
                    value={field.value}
                    onChange={(v) => {
                        field.onChange(type === 'number' ? Number(v.target.value) : v.target.value);
                    } }
                    error={hasError}
                    helperText={hasError ? String(fieldState.error?.message) : ''}
                    slotProps={{
                        input: {
                            endAdornment: (
                                <InputAdornment position="end">
                                    <StyledRow>
                                        {appendSlot}
                                        {tooltip && (
                                            <Tooltip title={tooltip}>
                                                <HelpIcon style={{ margin: '5px' }} />
                                            </Tooltip>
                                        )}
                                        {field.value && (
                                            <IconButton onClick={() => field.onChange('')} size="small">
                                                <ClearIcon />
                                            </IconButton>
                                        )}
                                    </StyledRow>
                                </InputAdornment>
                            ),
                        },
                    }}
                    data-cy={testID}
                    type={type}
                    disabled={disabled}
                    style={{ flex: 1 }} />
            );
        } } />
)

const StyledRow = styled.div`
    display: flex;
    align-items: center;
`