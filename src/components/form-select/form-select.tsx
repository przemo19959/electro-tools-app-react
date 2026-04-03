import { Controller, type Control, type FieldValues, type Path } from "react-hook-form";
import { BaseSelect, type BaseSelectProps } from "./base-select";

type FormSelectProps<T, R extends FieldValues> = {
    name: string;
    control: Control<R, any, R>;
} & Omit<BaseSelectProps<T>, 'value' | 'onChange'>;

export const FormSelect = <T, R extends FieldValues>({
    label,
    name,
    control,
    testID,
    items,
    idMapper = v => String(v),
    textMapper = v => String(v),
    disabled,
    tooltip,
    appendSlot,
}: FormSelectProps<T, R>) => (
    <Controller
        name={name as Path<R>}
        control={control}
        render={({ field, fieldState }) => {
            const hasError = Boolean(fieldState.error);
            return <BaseSelect
                label={label}
                value={field.value}
                onChange={field.onChange}
                tooltip={tooltip}
                appendSlot={appendSlot}
                items={items}
                idMapper={idMapper}
                textMapper={textMapper}
                testID={testID}
                disabled={disabled}
                error={hasError}
                helperText={hasError ? String(fieldState.error?.message) : ''}
            />
        }} />
)