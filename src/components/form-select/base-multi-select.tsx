import Box from '@mui/material/Box';
import OutlinedInput from '@mui/material/OutlinedInput';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Chip from '@mui/material/Chip';
import { createTestIDsForComponent, joinTestIDs } from '../../utils/common-utils';

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
    'select',
    'menu_item',
    'chip',
]);

type BaseMultiSelectProps<T> = {
    label: string;
    value: T[];
    onChange: (value: T[]) => void;
    items: T[];
    idMapper?: (option: T) => string;
    textMapper?: (option: T) => string;
    testID: string;
}

export const BaseMultiSelect = <T,>({
    label,
    value,
    onChange,
    items,
    idMapper = v => String(v),
    textMapper = v => String(v),
    testID,
}: BaseMultiSelectProps<T>) => (
    <div>
        <FormControl sx={{ m: 1, width: 300 }}>
            <Select
                multiple
                label={label}
                value={idMapper ? value.map(v => idMapper(v)) : (value as unknown as string[])}
                onChange={(v) => {
                    const selectedIds = typeof v.target.value === 'string' ? v.target.value.split(',') : v.target.value;
                    const selectedItems = items.filter(v => selectedIds.includes(idMapper ? idMapper(v) : String(v)));
                    onChange(selectedItems);
                }}
                input={<OutlinedInput label={label} />}
                renderValue={(selected) => (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                        {selected.map((selectedId) => (
                            <Chip
                                key={selectedId}
                                label={selectedId}
                                size="small"
                                onClick={() => {
                                    onChange(value.filter(v2 => idMapper ? idMapper(v2) !== selectedId : String(v2) !== selectedId));
                                }}
                                data-cy={joinTestIDs(testID, BaseMultiSelect_TestIDs.chip, selectedId)}
                            />
                        ))}
                    </Box>
                )}
                MenuProps={MenuProps}
                data-cy={joinTestIDs(testID, BaseMultiSelect_TestIDs.select)}
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
        </FormControl>
    </div>
)
