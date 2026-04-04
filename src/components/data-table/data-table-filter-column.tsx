import styled from "@emotion/styled";
import type { FilterColumnDto } from "../../api/api";
import { DEFAULT_OPERATOR_FOR_TYPE, OPERATORS_FOR_TYPE, OPERATOR_LABELS, type FilterColumnDef, type FilterColumnOperator, type FilterableColumnToValues } from "./types";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from '@mui/icons-material/Delete';
import { Tooltip } from "@mui/material";
import { BaseSelect } from "../form-select/base-select";
import { DebouncedTextField } from "../form-text-field/debounced-text-field";
import { BaseMultiSelect } from "../form-select/base-multi-select";
import type { FilterableColumn } from "../../utils/filter-utils";
import { createTestIDsForComponent, joinTestIDs } from "../../utils/common-utils";

const DataTableFilterColumn_TestIDs = createTestIDsForComponent('DataTableFilterColumn', [
    'column_select',
    'operator_select',
    'value_input',
    'value_select',
    'delete_btn',
]);

type FilterColumnRowProps = {
    column: FilterColumnDto;
    availableColumns: FilterColumnDef[];
    onChange: (col: FilterColumnDto) => void;
    onRemove: () => void;
    columnToValues: FilterableColumnToValues;
    testID: string;
};

export const FilterColumnRow = ({ column, availableColumns, onChange, onRemove, columnToValues, testID }: FilterColumnRowProps) => {
    const colDef = availableColumns.find(c => c.key === column.column) ?? availableColumns[0];
    const operators = colDef ? OPERATORS_FOR_TYPE[colDef.type] : [];

    const handleColumnKeyChange = (key: FilterColumnDef['key']) => {
        const newColDef = availableColumns.find(c => c.key === key);
        const newOperator = newColDef ? DEFAULT_OPERATOR_FOR_TYPE[newColDef.type] : column.operator;
        onChange({ ...column, column: key, operator: newOperator, value: '' });
    };

    return (
        <StyledConditionRow>
            <BaseSelect<FilterColumnDef>
                label="Column"
                value={availableColumns.find(c => c.key === column.column) ?? availableColumns[0]}
                items={availableColumns}
                idMapper={c => c.key}
                textMapper={c => c.label}
                onChange={v => handleColumnKeyChange(v.key)}
                testID={joinTestIDs(testID, DataTableFilterColumn_TestIDs.column_select)}
            />
            <BaseSelect<FilterColumnOperator>
                label="Operator"
                value={column.operator!}
                items={operators}
                textMapper={op => OPERATOR_LABELS[op].label}
                onChange={v => {
                    const operatorInputTypeChanged = OPERATOR_LABELS[v].inputType !== OPERATOR_LABELS[column.operator!].inputType;
                    onChange({ ...column, operator: v, value: operatorInputTypeChanged ? '' : column.value });
                }}
                testID={joinTestIDs(testID, DataTableFilterColumn_TestIDs.operator_select)}
            />
            {column.operator && OPERATOR_LABELS[column.operator].inputType === 'textfield' && (
                <DebouncedTextField
                    label="Value"
                    value={column.value ?? ''}
                    onChange={v => onChange({ ...column, value: v })}
                    error={column.value === undefined || column.value === ''}
                    helperText={column.value === undefined || column.value === '' ? 'Value is required' : ''}
                    testID={joinTestIDs(testID, DataTableFilterColumn_TestIDs.value_input)}
                />
            )}
            {column.operator && OPERATOR_LABELS[column.operator].inputType === 'select' && (
                <BaseMultiSelect<string>
                    label="Value"
                    value={column.value ? column.value.split(',') : []}
                    error={column.value === undefined || column.value === ''}
                    helperText={column.value === undefined || column.value === '' ? 'Value is required' : ''}
                    items={column.column ? columnToValues[column.column as FilterableColumn] : []}
                    onChange={v => onChange({ ...column, value: v.join(',') })}
                    testID={joinTestIDs(testID, DataTableFilterColumn_TestIDs.value_select)}
                />
            )}
            <Tooltip title="Remove condition">
                <StyledDeleteButton size="small" onClick={onRemove} data-cy={joinTestIDs(testID, DataTableFilterColumn_TestIDs.delete_btn)}>
                    <DeleteIcon color="error" />
                </StyledDeleteButton>
            </Tooltip>
        </StyledConditionRow>
    );
};

const StyledConditionRow = styled.div`
    display: flex;
    align-items: flex-start;
    gap: 0.5rem;
    flex-wrap: wrap;
`;

const StyledDeleteButton = styled(IconButton)`
    position: relative;
    top: 5px;
`;