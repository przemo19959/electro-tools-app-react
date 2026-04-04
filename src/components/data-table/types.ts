import type { TableCellProps } from "@mui/material";
import type { FilterColumnDto } from "../../api/api";
import type { FilterableColumn } from "../../utils/filter-utils";

export type Order = 'asc' | 'desc';

export type DataTableSort<T> = {
    key: keyof T;
    order: Order;
}

export type DataTableColumn<T> = {
    key: keyof T;
    label: string;
    render?: (v: T) => React.ReactNode;
    colStyle?: React.CSSProperties;
    align?: TableCellProps['align'];
};

export type FilterColumnDef = {
    key: FilterableColumn;
    label: string;
    type: 'string' | 'number' | 'date';
    fetchDistinctValues?: boolean;
};

export type FilterColumnOperator = NonNullable<FilterColumnDto['operator']>;

const STRING_OPERATORS: FilterColumnOperator[] = ['STRING_EQ', 'STRING_NOT_EQ', 'STRING_ILIKE', 'STRING_IN', 'STRING_NOT_IN'] as const;
const NUMBER_OPERATORS: FilterColumnOperator[] = ['NUMBER_EQ', 'NUMBER_NOT_EQ', 'NUMBER_GT', 'NUMBER_GTE', 'NUMBER_LT', 'NUMBER_LTE', 'NUMBER_ILIKE', 'NUMBER_IN', 'NUMBER_NOT_IN'] as const;
const DATE_OPERATORS: FilterColumnOperator[] = ['DATE_EQ', 'DATE_NOT_EQ', 'DATE_BEFORE', 'DATE_AFTER', 'DATE_ILIKE', 'DATE_IN', 'DATE_NOT_IN'] as const;

type OperatorProps = {
    label: string;
    inputType: 'textfield' | 'select';
}

export const OPERATOR_LABELS: Record<FilterColumnOperator, OperatorProps> = {
    STRING_EQ: { label: 'equals', inputType: 'textfield' },
    STRING_NOT_EQ: { label: 'not equals', inputType: 'textfield' },
    STRING_IN: { label: 'in', inputType: 'select' },
    STRING_NOT_IN: { label: 'not in', inputType: 'select' },
    STRING_ILIKE: { label: 'contains', inputType: 'textfield' },
    NUMBER_EQ: { label: '=', inputType: 'textfield' },
    NUMBER_NOT_EQ: { label: '≠', inputType: 'textfield' },
    NUMBER_GT: { label: '>', inputType: 'textfield' },
    NUMBER_GTE: { label: '≥', inputType: 'textfield' },
    NUMBER_LT: { label: '<', inputType: 'textfield' },
    NUMBER_LTE: { label: '≤', inputType: 'textfield' },
    NUMBER_ILIKE: { label: 'contains', inputType: 'textfield' },
    NUMBER_IN: { label: 'in', inputType: 'select' },
    NUMBER_NOT_IN: { label: 'not in', inputType: 'select' },
    DATE_EQ: { label: 'on', inputType: 'textfield' },
    DATE_NOT_EQ: { label: 'not on', inputType: 'textfield' },
    DATE_BEFORE: { label: 'before', inputType: 'textfield' },
    DATE_AFTER: { label: 'after', inputType: 'textfield' },
    DATE_ILIKE: { label: 'contains', inputType: 'textfield' },
    DATE_IN: { label: 'in', inputType: 'select' },
    DATE_NOT_IN: { label: 'not in', inputType: 'select' },
};

export const DEFAULT_OPERATOR_FOR_TYPE: Record<FilterColumnDef['type'], FilterColumnOperator> = {
    string: 'STRING_ILIKE',
    number: 'NUMBER_EQ',
    date: 'DATE_EQ',
};

export const OPERATORS_FOR_TYPE: Record<FilterColumnDef['type'], FilterColumnOperator[]> = {
    string: [...STRING_OPERATORS],
    number: [...NUMBER_OPERATORS],
    date: [...DATE_OPERATORS],
};

export type FilterableColumnToValues = Record<FilterableColumn, string[]>;