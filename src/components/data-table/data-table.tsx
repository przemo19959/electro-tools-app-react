import * as React from 'react';

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';

import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';

import { type DataTableColumn, type DataTableSort } from './types';
import { DataTableToolbar } from './data-table-toolbar';
import { DataTableHead, type DataTableHeadProps } from './data-table-head';

type DataTableProps<T> = {
    columns: DataTableColumn<T>[];
    items: T[];
    selection: string[];
    sort: DataTableSort<T> | undefined;
    onSortChange: (v: DataTableSort<T> | undefined) => void;
    onClick?: (v: T) => void;
    page: number;
    onPageChange: (v: number) => void;
    pageSize: number;
    onPageSizeChange: (v: number) => void;
    getItemId: (v: T) => string;
    selectedBy?: (v: T) => string;
    title?: string;
} & Pick<DataTableHeadProps<T>, 'onSelectAll'>;

export const DataTable = <T,>({
    columns,
    items,
    selection,
    sort,
    onSortChange,
    onSelectAll,
    onClick,
    page,
    onPageChange,
    pageSize,
    onPageSizeChange,
    selectedBy,
    getItemId,
    title,
}: DataTableProps<T>) => {
    const handleSortChange = (property: keyof T) => {
        const isAsc = sort?.key === property && sort?.order === 'asc';
        onSortChange({
            key: property,
            order: isAsc ? 'desc' : 'asc',
        });
    };

    // const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    //     if (event.target.checked) {
    //         const newSelected = items.map((n) => n.id);
    //         setSelected(newSelected);
    //         return;
    //     }
    //     setSelected([]);
    // };

    // const handleClick = (event: React.MouseEvent<unknown>, id: number) => {
    //     const selectedIndex = selected.indexOf(id);
    //     let newSelected: readonly number[] = [];

    //     if (selectedIndex === -1) {
    //         newSelected = newSelected.concat(selected, id);
    //     } else if (selectedIndex === 0) {
    //         newSelected = newSelected.concat(selected.slice(1));
    //     } else if (selectedIndex === selected.length - 1) {
    //         newSelected = newSelected.concat(selected.slice(0, -1));
    //     } else if (selectedIndex > 0) {
    //         newSelected = newSelected.concat(
    //             selected.slice(0, selectedIndex),
    //             selected.slice(selectedIndex + 1),
    //         );
    //     }
    //     setSelected(newSelected);
    // };

    const handleChangePage = (_event: unknown, newPage: number) => {
        onPageChange(newPage);
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        onPageSizeChange(parseInt(event.target.value, 10));
        onPageChange(0);
    };

    // Avoid a layout jump when reaching the last page with empty rows.
    const emptyRows = page > 0 ? Math.max(0, (1 + page) * pageSize - items.length) : 0;

    return (
        <div>
            <DataTableToolbar title={title ?? ''} numSelected={selection.length} />
            <TableContainer>
                <Table
                    sx={{ minWidth: 750 }}
                    aria-labelledby="tableTitle"
                    size='small'
                >
                    <DataTableHead
                        columns={columns}
                        selectionCount={selection.length}
                        sort={sort}
                        onSelectAll={onSelectAll}
                        onSortChange={handleSortChange}
                        rowCount={items.length}
                    />
                    <TableBody>
                        {items.map((item) => {
                            const itemId = getItemId(item);
                            const isItemSelected = selection.includes(selectedBy ? selectedBy(item) : itemId);

                            return (
                                <TableRow
                                    hover
                                    onClick={() => onClick?.(item)}
                                    role="checkbox"
                                    aria-checked={isItemSelected}
                                    tabIndex={-1}
                                    key={itemId}
                                    selected={isItemSelected}
                                    sx={{ cursor: 'pointer' }}
                                >
                                    <TableCell padding="checkbox">
                                        <Checkbox
                                            color="primary"
                                            checked={isItemSelected}
                                        />
                                    </TableCell>
                                    {columns.map((col) => {
                                        const content = col.render ? col.render(item) : String(item[col.key]);

                                        return (
                                            <TableCell align="right">{content}</TableCell>
                                        );
                                    })}
                                </TableRow>
                            );
                        })}
                        {emptyRows > 0 && (
                            <TableRow
                                style={{
                                    height: 33 * emptyRows,
                                }}
                            >
                                <TableCell colSpan={columns.length} />
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
            <TablePagination
                rowsPerPageOptions={[5, 10, 25]}
                component="div"
                count={items.length}
                page={page}
                onPageChange={handleChangePage}
                rowsPerPage={pageSize}
                onRowsPerPageChange={handleChangeRowsPerPage}
            />
        </div>
    );
}
