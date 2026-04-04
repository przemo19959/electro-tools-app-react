import Box from '@mui/material/Box';
import OutlinedInput from '@mui/material/OutlinedInput';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Chip from '@mui/material/Chip';
import { createTestIDsForComponent, joinTestIDs } from '../../utils/common-utils';
import InputLabel from '@mui/material/InputLabel';
import styled from '@emotion/styled';
import FormHelperText from '@mui/material/FormHelperText';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
            width: 250,
        },
    },
};

const BaseMultiSelect_TestIDs = createTestIDsForComponent('BaseMultiSelect', [
    'menu_item',
    'chip',
    'helper_text',
]);

type BaseMultiSelectProps<T> = {
    label: string;
    value: T[];
    onChange: (value: T[]) => void;
    items: T[];
    idMapper?: (option: T) => string;
    textMapper?: (option: T) => string;
    helperText?: string;
    error?: boolean;
    testID: string;
}

export const BaseMultiSelect = <T,>({
    label,
    value,
    onChange,
    items,
    idMapper = v => String(v),
    textMapper = v => String(v),
    helperText,
    error = false,
    testID,
}: BaseMultiSelectProps<T>) => (
    <FormControl sx={{ flex: 1 }} error={error} size="small">
        <InputLabel id="label">{label}</InputLabel>
        <Select
            labelId="label"
            multiple
            value={idMapper ? value.map(v => idMapper(v)) : (value as unknown as string[])}
            onChange={(v) => {
                const selectedIds = typeof v.target.value === 'string' ? v.target.value.split(',') : v.target.value;
                const selectedItems = items.filter(v => selectedIds.includes(idMapper ? idMapper(v) : String(v)));
                onChange(selectedItems);
            }}
            input={<StyledOutlinedInput label={label} size='small' />}
            renderValue={(selected) => (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {selected.map((selectedId) => (
                        <Chip
                            key={selectedId}
                            label={selectedId}
                            size="small"
                            onMouseDown={(e) => e.stopPropagation()}
                            onClick={() => onChange(value.filter(v2 => idMapper(v2) !== selectedId))}
                            data-cy={joinTestIDs(testID, BaseMultiSelect_TestIDs.chip, selectedId)}
                        />
                    ))}
                </Box>
            )}
            MenuProps={MenuProps}
            data-cy={testID}
        >
            {items.map((item) => (
                <MenuItem
                    key={idMapper(item)}
                    value={idMapper(item)}
                    data-cy={joinTestIDs(testID, BaseMultiSelect_TestIDs.menu_item, idMapper(item))}
                >
                    {textMapper(item)}
                </MenuItem>
            ))}
        </Select>
        {helperText && <FormHelperText data-cy={joinTestIDs(testID, BaseMultiSelect_TestIDs.helper_text)}>{helperText}</FormHelperText>}
    </FormControl>
);

const StyledOutlinedInput = styled(OutlinedInput)`
`;