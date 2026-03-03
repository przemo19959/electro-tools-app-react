import { Box, Checkbox, TableCell, TableHead, TableRow, TableSortLabel } from "@mui/material";
import type { DataTableColumn, DataTableSort } from "./types";
import { visuallyHidden } from '@mui/utils';

export type DataTableHeadProps<T> = {
    columns: DataTableColumn<T>[];
    selectionCount: number;
    onSortChange: (property: keyof T) => void;
    onSelectAll: (selectAll: boolean) => void;
    sort: DataTableSort<T> | undefined;
    rowCount: number;
};

export const DataTableHead = <T,>({
    columns,
    onSelectAll,
    sort,
    selectionCount,
    rowCount,
    onSortChange,
}: DataTableHeadProps<T>) => (
    <TableHead>
        <TableRow>
            <TableCell padding="checkbox">
                <Checkbox
                    color="primary"
                    indeterminate={selectionCount > 0 && selectionCount < rowCount}
                    checked={rowCount > 0 && selectionCount === rowCount}
                    onChange={(e) => onSelectAll(e.target.checked)}
                    data-cy="header-checkbox" 
                    />
            </TableCell>
            {columns.map((col) => (
                <TableCell
                    key={String(col.key)}
                    align="left"
                    padding="normal"
                    sortDirection={sort?.key === col.key ? sort.order : false}
                >
                    <TableSortLabel
                        active={sort?.key === col.key}
                        direction={sort?.key === col.key ? sort.order : 'asc'}
                        onClick={() => onSortChange(col.key)}
                    >
                        {col.label}
                        {sort?.key === col.key ? (
                            <Box component="span" sx={visuallyHidden}>
                                {sort.order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                            </Box>
                        ) : null}
                    </TableSortLabel>
                </TableCell>
            ))}
        </TableRow>
    </TableHead>
);