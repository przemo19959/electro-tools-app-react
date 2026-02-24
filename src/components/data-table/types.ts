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

function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
    if (b[orderBy] < a[orderBy]) {
        return -1;
    }
    if (b[orderBy] > a[orderBy]) {
        return 1;
    }
    return 0;
}

export function getComparator<Key extends keyof any>(
    order: Order,
    orderBy: Key,
): (
    a: { [key in Key]: number | string },
    b: { [key in Key]: number | string },
) => number {
    return order === 'desc'
        ? (a, b) => descendingComparator(a, b, orderBy)
        : (a, b) => -descendingComparator(a, b, orderBy);
}