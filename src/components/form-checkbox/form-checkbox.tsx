import { Checkbox, FormControlLabel } from "@mui/material";
import { Controller, type Control, type FieldValues, type Path } from "react-hook-form";

type FormCheckboxProps<T extends FieldValues> = {
    label: string;
    name: string;
    control: Control<T, any, T>;
}

export const FormCheckbox = <T extends FieldValues,>({
    label,
    name,
    control,
}: FormCheckboxProps<T>) => {
    return (
        <Controller
            name={name as Path<T>}
            control={control}
            render={({ field }) => {
                return (
                    <FormControlLabel
                        control={
                            <Checkbox
                                size="small"
                                checked={field.value}
                                onChange={field.onChange}
                                slotProps={{
                                    input: { 'aria-label': 'controlled' },
                                }}
                            />
                        }
                        label={label}
                    />
                )
            }}
        />
    )
}