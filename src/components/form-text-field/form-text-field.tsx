import { IconButton, InputAdornment, TextField } from "@mui/material";
import { Controller, type Control, type FieldErrors, type FieldValues, type Path } from "react-hook-form";
import ClearIcon from '@mui/icons-material/Clear';

type FormTextFieldProps<T extends FieldValues> = {
    label: string;
    name: Path<T>;
    control: Control<T, any, T>;
    errors: FieldErrors;
    onClear: () => void;
    testId: string;
}

export const FormTextField = <T extends FieldValues,>({
    label,
    name,
    control,
    errors,
    onClear,
    testId,
}: FormTextFieldProps<T>) => (
    <Controller
        name={name}
        control={control}
        render={({ field }) => {
            const hasError = Boolean(errors[field.name]);
            return (
                <TextField
                    label={label}
                    variant="outlined"
                    size="small"
                    value={field.value}
                    onChange={field.onChange}
                    error={hasError}
                    helperText={hasError ? String(errors[field.name]?.message) : ''}
                    slotProps={{
                        input: {
                            endAdornment: (
                                <InputAdornment position="end">
                                    {field.value && (
                                        <IconButton onClick={onClear} size="small">
                                            <ClearIcon />
                                        </IconButton>
                                    )}
                                </InputAdornment>
                            ),
                        },
                    }}
                    data-cy={testId} />
            );
        }} />
)