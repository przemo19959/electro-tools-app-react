import { InputAdornment, MenuItem, TextField, Tooltip, type TextFieldProps } from "@mui/material";
import { Controller, type Control, type FieldErrors, type FieldValues, type Path } from "react-hook-form";
import HelpIcon from '@mui/icons-material/Help';
import type { ReactNode } from "react";
import { createTestIDsForComponent, joinTestIDs } from "../../utils/common-utils";

const FormSelect_TestIDs = createTestIDsForComponent('FormSelect', [
    'endAdornment',
    'item',
]);

type FormSelectProps<T, R extends FieldValues> = {
    label: string;
    name: string;
    control: Control<R, any, R>;
    errors: FieldErrors;
    testID: string;
    items: T[];
    idMapper?: (option: T) => string;
    textMapper?: (option: T) => string;
    disabled?: TextFieldProps['disabled'];
    tooltip?: string;
    appendSlot?: ReactNode;
}

export const FormSelect = <T, R extends FieldValues>({
    label,
    name,
    control,
    errors,
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
        render={({ field }) => {
            const hasError = Boolean(errors[field.name]);
            return (
                <TextField
                    select
                    label={label}
                    variant="outlined"
                    size="small"
                    value={idMapper(field.value)}
                    onChange={v => {
                        const item = items.find(v2 => idMapper(v2) === v.target.value);

                        if (item) {
                            field.onChange(item);
                        }
                    }}
                    error={hasError}
                    helperText={hasError ? String(errors[field.name]?.message) : ''}
                    slotProps={{
                        input: {
                            endAdornment: (
                                // extra margin required, so that select arrow is not overlapping this end adornment
                                <InputAdornment position="end" style={{ marginRight: '16px' }} data-cy={FormSelect_TestIDs.endAdornment}>
                                    {appendSlot}
                                    {tooltip && (
                                        <Tooltip title={tooltip}>
                                            <HelpIcon />
                                        </Tooltip>
                                    )}
                                </InputAdornment>
                            ),
                        },
                    }}
                    data-cy={testID}
                    disabled={disabled}
                    style={{ flex: 1 }}
                >
                    {items.map(v => {
                        const id = idMapper(v);
                        return (
                            <MenuItem
                                key={id}
                                value={id}
                                data-cy={joinTestIDs(FormSelect_TestIDs.item, id)}
                            >
                                {textMapper(v)}
                            </MenuItem>
                        );
                    })}
                </TextField>
            );
        }} />
)