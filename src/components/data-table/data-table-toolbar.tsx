import { Badge, IconButton, Tooltip, Typography } from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';
import FilterListIcon from '@mui/icons-material/FilterList';
import { alpha, css } from '@mui/material/styles';
import styled from '@emotion/styled';
import type { ReactNode } from "react";
import { createTestIDsForComponent } from "../../utils/common-utils";

const DataTableToolbar_TestIDs = createTestIDsForComponent('DataTableToolbar', [
    'selection_count_label',
    'filter_toggle_btn',
    'delete_btn',
]);

type DataTableToolbarProps = {
    beforeSlot?: ReactNode;
    numSelected: number;
    filterCount: number;
    onDeleteSelected?: () => void;
    onFilterToggle?: () => void;
}

export const DataTableToolbar = ({
    numSelected,
    beforeSlot,
    filterCount,
    onDeleteSelected,
    onFilterToggle,
}: DataTableToolbarProps) => {
    return (
        <StyledContainer>
            {beforeSlot}
            <StyledRow numSelected={numSelected}>
                {numSelected > 0 && (
                    <StyledTitleTypography color="inherit" variant="subtitle1" data-cy={DataTableToolbar_TestIDs.selection_count_label}>
                        {numSelected} selected
                    </StyledTitleTypography>
                )}
                <div style={{ flex: 1 }} />
                {numSelected > 0 ? (
                    <Tooltip title="Delete">
                        <IconButton color="error" onClick={onDeleteSelected} data-cy={DataTableToolbar_TestIDs.delete_btn}>
                            <DeleteIcon />
                        </IconButton>
                    </Tooltip>
                ) : (
                    <Tooltip title="Filter list">
                        <IconButton onClick={onFilterToggle} data-cy={DataTableToolbar_TestIDs.filter_toggle_btn}>
                            <Badge color="primary" badgeContent={filterCount}>
                                <FilterListIcon />
                            </Badge>
                        </IconButton>
                    </Tooltip>
                )}
            </StyledRow>
        </StyledContainer>
    );
}

const StyledContainer = styled.div`
    display: flex;
    align-items: center;
    gap: 1rem;
`;

const StyledRow = styled.div<{ numSelected: number }>`
    display: flex;
    align-items: center;
    border-radius: 1rem;
    gap: 1rem;
    flex: 1;

    ${({ theme }) => css`
        padding-left: ${theme.spacing(1)};
    `}

    ${({ numSelected, theme }) => numSelected > 0 && css`
        background-color: ${alpha(theme.palette.primary.main, theme.palette.action.activatedOpacity)}
    `}
`;

const StyledTitleTypography = styled(Typography)({
    flex: '1 1 100%',
});
