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
};

export type FilterColumnOperator = NonNullable<FilterColumnDto['operator']>;

const STRING_OPERATORS: FilterColumnOperator[] = ['STRING_EQ', 'STRING_NOT_EQ', 'STRING_ILIKE', 'STRING_IN', 'STRING_NOT_IN'] as const;
const NUMBER_OPERATORS: FilterColumnOperator[] = ['NUMBER_EQ', 'NUMBER_NOT_EQ', 'NUMBER_GT', 'NUMBER_GTE', 'NUMBER_LT', 'NUMBER_LTE', 'NUMBER_ILIKE', 'NUMBER_IN', 'NUMBER_NOT_IN'] as const;
const DATE_OPERATORS: FilterColumnOperator[] = ['DATE_EQ', 'DATE_NOT_EQ', 'DATE_BEFORE', 'DATE_AFTER', 'DATE_ILIKE', 'DATE_IN', 'DATE_NOT_IN'] as const;

export const OPERATOR_LABELS: Record<FilterColumnOperator, string> = {
    STRING_EQ: 'equals',
    STRING_NOT_EQ: 'not equals',
    STRING_IN: 'in',
    STRING_NOT_IN: 'not in',
    STRING_ILIKE: 'contains',
    NUMBER_EQ: '=',
    NUMBER_NOT_EQ: '≠',
    NUMBER_GT: '>',
    NUMBER_GTE: '≥',
    NUMBER_LT: '<',
    NUMBER_LTE: '≤',
    NUMBER_ILIKE: 'contains',
    NUMBER_IN: 'in',
    NUMBER_NOT_IN: 'not in',
    DATE_EQ: 'on',
    DATE_NOT_EQ: 'not on',
    DATE_BEFORE: 'before',
    DATE_AFTER: 'after',
    DATE_ILIKE: 'contains',
    DATE_IN: 'in',
    DATE_NOT_IN: 'not in',
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