import styled from "@emotion/styled";
import type { PropsWithChildren } from "react";
import ClearIcon from '@mui/icons-material/Clear';
import { IconButton } from "@mui/material";

type DataTableFiltersProps = {
    open: boolean;
    onClear: () => void;
} & PropsWithChildren;

export const DataTableFilters = ({
    open,
    children, 
    onClear,
 }: DataTableFiltersProps) => {
    return (
        <StyledContainer open={open}>
            {children}
            <IconButton onClick={onClear} size="small">
                <ClearIcon />
            </IconButton>
        </StyledContainer>
    );
}

const StyledContainer = styled.div<{ open: boolean }>`
    display: grid;
    grid-template-columns: 1fr auto;
    gap: 1rem;
    overflow: hidden;
    max-height: ${({ open }) => (open ? '500px' : '0')};
    transition: max-height 300ms ease;
`;