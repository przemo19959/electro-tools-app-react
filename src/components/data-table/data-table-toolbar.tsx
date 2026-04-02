import { IconButton, Tooltip, Typography } from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';
import FilterListIcon from '@mui/icons-material/FilterList';
import { alpha, css } from '@mui/material/styles';
import styled from '@emotion/styled';
import type { ReactNode } from "react";

type DataTableToolbarProps = {
    beforeSlot?: ReactNode;
    numSelected: number;
    onDeleteSelected?: () => void;
    onFilterToggle?: () => void;
}


export const DataTableToolbar = ({
    numSelected,
    beforeSlot,
    onDeleteSelected,
    onFilterToggle,
}: DataTableToolbarProps) => {
    return (
        <StyledContainer>
            {beforeSlot}
            <StyledRow numSelected={numSelected}>
                {numSelected > 0 && (
                    <StyledTitleTypography color="inherit" variant="subtitle1" data-cy="selection-count-label">
                        {numSelected} selected
                    </StyledTitleTypography>
                )}
                <div style={{ flex: 1 }} />
                {numSelected > 0 ? (
                    <Tooltip title="Delete">
                        <IconButton color="error" onClick={onDeleteSelected}>
                            <DeleteIcon />
                        </IconButton>
                    </Tooltip>
                ) : (
                    <Tooltip title="Filter list">
                        <IconButton onClick={onFilterToggle}>
                            <FilterListIcon />
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
