import type { TableCellProps } from "@mui/material";

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