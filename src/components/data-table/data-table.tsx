import * as React from 'react';

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';

import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';

import { type DataTableColumn, type DataTableSort } from './types';
import { DataTableHead, type DataTableHeadProps } from './data-table-head';
import styled from '@emotion/styled';

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
    totalElements: number;
    getItemId: (v: T) => string;
    selectedBy?: (v: T) => string;
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
    totalElements,
    selectedBy,
    getItemId,
}: DataTableProps<T>) => {
    const handleSortChange = (property: keyof T) => {
        const isAsc = sort?.key === property && sort?.order === 'asc';

        if (!isAsc && sort) {
            onSortChange(undefined);
        } else {
            onSortChange({
                key: property,
                order: isAsc ? 'desc' : 'asc',
            });
        }
    };

    const handleChangePage = (_event: unknown, newPage: number) => {
        onPageChange(newPage);
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        onPageSizeChange(parseInt(event.target.value, 10));
    };

    return (
        <StyledColumn>
            <TableContainer>
                <Table
                    stickyHeader
                    sx={{ minWidth: 750 }}
                    aria-labelledby="tableTitle"
                    size='small'
                >
                    <colgroup>
                        <col />
                        {columns.map(v => (<col key={String(v.key)} style={v.colStyle} />))}
                    </colgroup>
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
                                    <TableCell padding="checkbox" align="center">
                                        <Checkbox
                                            color="primary"
                                            checked={isItemSelected}
                                            data-cy="row-checkbox"
                                        />
                                    </TableCell>
                                    {columns.map((col) => {
                                        const content = col.render ? col.render(item) : String(item[col.key]);

                                        return (
                                            <TableCell key={String(col.key)} align={col.align ?? 'left'} data-cy={`${String(col.key)}_data_cell`}>{content}</TableCell>
                                        );
                                    })}
                                </TableRow>
                            );
                        })}
                        {items.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={columns.length + 1} align='center'>
                                    No Data
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
            <TablePagination
                style={{ minHeight: '60px' }}
                rowsPerPageOptions={[5, 10, 25]}
                component="div"
                count={totalElements}
                page={page}
                onPageChange={handleChangePage}
                rowsPerPage={pageSize}
                onRowsPerPageChange={handleChangeRowsPerPage}
            />
        </StyledColumn >
    );
}

const StyledColumn = styled.div`
    display: flex;
    flex-direction: column;
    gap: 1rem;
    flex: 1;
    min-height: 0
`;
