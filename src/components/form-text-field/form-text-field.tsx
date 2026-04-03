import { Controller, type Control, type FieldError, type FieldValues, type Path } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { BaseTextField, type BaseTextFieldProps } from "./base-text-field";

type FormTextFieldProps<T extends FieldValues> = {
    name: string;
    control: Control<T, any, T>;
} & Omit<BaseTextFieldProps, 'value' | 'onChange'>;

export const FormTextField = <T extends FieldValues,>({
    label,
    name,
    control,
    testID,
    type = 'text',
    tooltip,
    appendSlot,
    disabled = false,
}: FormTextFieldProps<T>) => {
    const { t } = useTranslation();

    const getMessage = (error?: FieldError) => {
        if (error?.message) {
            return error.message.startsWith('VALIDATION.') && 'params' in error
                ? t(error.message, error.params as string).toString()
                : error.message.toString()
        }
        return '???';
    }

    return (
        <Controller
            name={name as Path<T>}
            control={control}
            render={({ field, fieldState }) => {
                const hasError = Boolean(fieldState.error);
                return <BaseTextField
                    label={label}
                    value={field.value}
                    onChange={(value) => field.onChange(type === 'number' ? Number(value) : value)}
                    error={hasError}
                    helperText={hasError ? getMessage(fieldState.error) : ''}
                    testID={testID}
                    tooltip={tooltip}
                    appendSlot={appendSlot}
                    disabled={disabled}
                    type={type}
                />
            }} />
    );
}