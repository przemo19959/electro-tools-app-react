import { IconButton, InputAdornment, TextField, Tooltip, type TextFieldProps } from "@mui/material";
import type { ReactNode } from "react";
import ClearIcon from '@mui/icons-material/Clear';
import HelpIcon from '@mui/icons-material/Help';
import { createTestIDsForComponent, joinTestIDs } from "../../utils/common-utils";

const BaseTextField_TestIDs = createTestIDsForComponent('BaseTextField', [
    'endAdornment',
    'clear_btn',
]);

export type BaseTextFieldProps = {
    label: string;
    value: string;
    onChange: (value: string) => void;
    testID: string;
    tooltip?: string;
    appendSlot?: ReactNode;
} & TextFieldProps;

export const BaseTextField = ({
    label,
    value,
    onChange,
    testID,
    tooltip,
    appendSlot,
    ...props
}: BaseTextFieldProps) => {
    return (
        <TextField
            label={label}
            variant="outlined"
            size="small"
            value={value}
            onChange={(v) => {
                onChange(v.target.value);
            }}
            slotProps={{
                input: {
                    endAdornment: (
                        <InputAdornment position="end" data-cy={joinTestIDs(testID, BaseTextField_TestIDs.endAdornment)}>
                            {appendSlot}
                            {tooltip && (
                                <Tooltip title={tooltip}>
                                    <HelpIcon style={{ margin: '5px' }} />
                                </Tooltip>
                            )}
                            {String(value) && !props.disabled && (
                                <IconButton onClick={() => onChange('')} size="small" data-cy={joinTestIDs(testID, BaseTextField_TestIDs.clear_btn)}>
                                    <ClearIcon />
                                </IconButton>
                            )}
                        </InputAdornment>
                    ),
                },
            }}
            data-cy={testID}
            style={{ flex: 1 }}
            {...props}
        />
    );
};