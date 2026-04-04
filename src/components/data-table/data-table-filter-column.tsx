import styled from "@emotion/styled";
import type { FilterColumnDto } from "../../api/api";
import { DEFAULT_OPERATOR_FOR_TYPE, OPERATORS_FOR_TYPE, OPERATOR_LABELS, type FilterColumnDef, type FilterColumnOperator } from "./types";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from '@mui/icons-material/Delete';
import { Tooltip } from "@mui/material";
import { BaseSelect } from "../form-select/base-select";
import { DebouncedTextField } from "../form-text-field/debounced-text-field";

type FilterColumnRowProps = {
    column: FilterColumnDto;
    availableColumns: FilterColumnDef[];
    onChange: (col: FilterColumnDto) => void;
    onRemove: () => void;
};

export const FilterColumnRow = ({ column, availableColumns, onChange, onRemove }: FilterColumnRowProps) => {
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
                testID="column-select"
            />
            <BaseSelect<FilterColumnOperator>
                label="Operator"
                value={column.operator!}
                items={operators}
                textMapper={op => OPERATOR_LABELS[op]}
                onChange={v => onChange({ ...column, operator: v })}
                testID="operator-select"
            />
            <DebouncedTextField
                label="Value"
                value={column.value ?? ''}
                onChange={v => onChange({ ...column, value: v })}
                error={column.value === undefined || column.value === ''}
                helperText={column.value === undefined || column.value === '' ? 'Value is required' : ''}
                testID="value-input"
            />
            <Tooltip title="Remove condition">
                <StyledDeleteButton size="small" onClick={onRemove}>
                    <DeleteIcon color="error"/>
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