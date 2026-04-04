import { InputAdornment, MenuItem, TextField, Tooltip, type TextFieldProps } from "@mui/material";
import type { ReactNode } from "react";
import HelpIcon from '@mui/icons-material/Help';
import { createTestIDsForComponent, joinTestIDs } from "../../utils/common-utils";

const BaseSelect_TestIDs = createTestIDsForComponent('BaseSelect', [
    'endAdornment',
    'item',
]);

export type BaseSelectProps<T> = {
    label: string;
    value: T;
    onChange: (value: T) => void;
    tooltip?: string;
    appendSlot?: ReactNode;
    items: T[];
    idMapper?: (option: T) => string;
    textMapper?: (option: T) => string;
    testID: string;
} & Omit<TextFieldProps, 'onChange' | 'value'>;

export const BaseSelect = <T,>({
    label,
    value,
    onChange,
    tooltip,
    appendSlot,
    items,
    idMapper = v => String(v),
    textMapper = v => String(v),
    testID,
    ...rest
}: BaseSelectProps<T>) => {
    return (
        <TextField
            select
            label={label}
            variant="outlined"
            size="small"
            value={idMapper(value)}
            onChange={v => {
                const item = items.find(v2 => idMapper(v2) === v.target.value);

                if (item) {
                    onChange(item);
                }
            }}
            slotProps={{
                input: {
                    endAdornment: (
                        // extra margin required, so that select arrow is not overlapping this end adornment
                        <InputAdornment position="end" style={{ marginRight: '16px' }} data-cy={joinTestIDs(testID, BaseSelect_TestIDs.endAdornment)}>
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
            style={{ flex: 1 }}
            {...rest}
        >
            {items.map(v => {
                const id = idMapper(v);
                return (
                    <MenuItem
                        key={id}
                        value={id}
                        data-cy={joinTestIDs(testID, BaseSelect_TestIDs.item, id)}
                    >
                        {textMapper(v)}
                    </MenuItem>
                );
            })}
        </TextField>
    );
}