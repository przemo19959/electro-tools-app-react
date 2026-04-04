import styled from "@emotion/styled";
import type { FilterColumnDto, FilterGroupDto } from "../../api/api";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import ToggleButton from "@mui/material/ToggleButton";
import { IconButton, Tooltip } from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import { type FilterableColumnToValues, type FilterColumnDef } from "./types";
import DeleteIcon from '@mui/icons-material/Delete';
import { FilterColumnRow } from "./data-table-filter-column";
import FormatListBulletedAddIcon from '@mui/icons-material/FormatListBulletedAdd';
import ClearIcon from '@mui/icons-material/Clear';
import { FilterUtils } from "../../utils/filter-utils";
import { createTestIDsForComponent, joinTestIDs } from "../../utils/common-utils";

const BRANCH_Y = 18;
const INDENT = 24;

const GROUP_OPERATORS: NonNullable<FilterGroupDto['operator']>[] = ['AND', 'OR'];

const DataTableFilterGroup_TestIDs = createTestIDsForComponent('DataTableFilterGroup', [
    'operator_toggle_group',
    'add_column_btn',
    'add_group_btn',
    'clear_btn',
    'remove_group_btn',
]);

type FilterGroupNodeProps = {
    group: FilterGroupDto;
    onChange: (group: FilterGroupDto) => void;
    onRemove?: () => void;
    availableColumns: FilterColumnDef[];
    depth: number;
    columnToValues: FilterableColumnToValues;
    testID: string;
};

export const FilterGroupNode = ({ group, onChange, onRemove, availableColumns, depth, columnToValues, testID }: FilterGroupNodeProps) => {
    const handleColumnChange = (index: number, col: FilterColumnDto) => onChange(FilterUtils.updateColumn(group, index, col));
    const handleColumnRemove = (index: number) => onChange(FilterUtils.removeColumn(group, index));
    const handleAddColumn = () => onChange(FilterUtils.addColumn(group, availableColumns));
    const handleGroupChange = (index: number, subgroup: FilterGroupDto) => onChange(FilterUtils.updateGroup(group, index, subgroup));
    const handleGroupRemove = (index: number) => onChange(FilterUtils.removeGroup(group, index));
    const handleAddGroup = () => onChange(FilterUtils.addGroup(group));

    const columns = group.columns ?? [];
    const groups = group.groups ?? [];
    const hasItems = columns.length + groups.length > 0;

    return (
        <StyledGroupBox>
            <StyledGroupHeader>
                <ToggleButtonGroup
                    size="small"
                    color="primary"
                    value={group.operator ?? 'AND'}
                    exclusive
                    onChange={(_, v) => v && onChange({ ...group, operator: v })}
                    data-cy={joinTestIDs(testID, DataTableFilterGroup_TestIDs.operator_toggle_group)}
                >
                    {GROUP_OPERATORS.map(op => (
                        <ToggleButton key={op} value={op} style={{ padding: '.25rem' }}>{op}</ToggleButton>
                    ))}
                </ToggleButtonGroup>
                <div style={{ flex: 1 }} />
                <Tooltip title="Add column">
                    <IconButton size="small" onClick={handleAddColumn}
                        disabled={availableColumns.length === 0} data-cy={joinTestIDs(testID, DataTableFilterGroup_TestIDs.add_column_btn)}>
                        <AddIcon />
                    </IconButton>
                </Tooltip>
                <Tooltip title="Add group">
                    <IconButton size="small" onClick={handleAddGroup} data-cy={joinTestIDs(testID, DataTableFilterGroup_TestIDs.add_group_btn)}>
                        <FormatListBulletedAddIcon />
                    </IconButton>
                </Tooltip>
                {depth === 0 && (
                    <Tooltip title="Clear">
                        <IconButton size="small" onClick={() => onChange(FilterUtils.clearGroup(group))} data-cy={joinTestIDs(testID, DataTableFilterGroup_TestIDs.clear_btn)}>
                            <ClearIcon />
                        </IconButton>
                    </Tooltip>
                )}
                {onRemove && (
                    <Tooltip title="Remove group">
                        <IconButton size="small" onClick={onRemove} data-cy={joinTestIDs(testID, DataTableFilterGroup_TestIDs.remove_group_btn)}>
                            <DeleteIcon color="error" />
                        </IconButton>
                    </Tooltip>
                )}
            </StyledGroupHeader>

            {hasItems && (
                <StyledItemList>
                    {columns.map((col, i) => (
                        <StyledItemListItem key={`col-${i}`}>
                            <FilterColumnRow
                                column={col}
                                availableColumns={availableColumns}
                                columnToValues={columnToValues}
                                onChange={c => handleColumnChange(i, c)}
                                onRemove={() => handleColumnRemove(i)}
                                testID={joinTestIDs(testID, `col${i}`)}
                            />
                        </StyledItemListItem>
                    ))}
                    {groups.map((subgroup, i) => (
                        <StyledItemListItem key={`grp-${i}`}>
                            <FilterGroupNode
                                group={subgroup}
                                onChange={g => handleGroupChange(i, g)}
                                onRemove={() => handleGroupRemove(i)}
                                availableColumns={availableColumns}
                                columnToValues={columnToValues}
                                depth={depth + 1}
                                testID={joinTestIDs(testID, `lvl${depth + 1}`, `group${i}`)}
                            />
                        </StyledItemListItem>
                    ))}
                </StyledItemList>
            )}
        </StyledGroupBox>
    );
};

const StyledGroupBox = styled.div`
    display: flex;
    flex-direction: column;
    flex: 1;
`;

const StyledGroupHeader = styled.div`
    display: flex;
    align-items: center;
    gap: 0.5rem;
`;

const StyledItemList = styled.ul`
    list-style: none;
    margin: 6px 0 0 ${INDENT}px;
    padding: 0;
`;

const StyledItemListItem = styled.li`
    position: relative;
    padding-left: ${INDENT}px;
    padding-bottom: 8px;

    /* L-shaped connector */
    &::before {
        content: '';
        position: absolute;
        left: 0;
        top: 0;
        width:  ${INDENT}px;
        height: ${BRANCH_Y}px;
        border-left:   2px solid ${({ theme }) => theme.palette.primary.main};
        border-bottom: 2px solid ${({ theme }) => theme.palette.primary.main};
        border-bottom-left-radius: 3px;
        box-sizing: border-box;
    }

    /* Vertical spine continuation to next sibling */
    &:not(:last-child)::after {
        content: '';
        position: absolute;
        left: 0;
        top:    ${BRANCH_Y}px;
        bottom: 0;
        border-left: 2px solid ${({ theme }) => theme.palette.primary.main};
    }
`;