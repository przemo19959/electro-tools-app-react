import styled from "@emotion/styled";
import type { PropsWithChildren } from "react";
import ClearIcon from '@mui/icons-material/Clear';
import { IconButton } from "@mui/material";
import { createTestIDsForComponent, joinTestIDs } from "../../utils/common-utils";

const DataTableFilters_TestIDs = createTestIDsForComponent('DataTableFilters', [
    'container',
    'clear_btn',
]);

type DataTableFiltersProps = {
    open: boolean;
    onClear: () => void;
    testID: string;
} & PropsWithChildren;

export const DataTableFilters = ({
    open,
    children,
    onClear,
    testID,
}: DataTableFiltersProps) => {
    return (
        <StyledContainer open={open} data-cy={joinTestIDs(testID, DataTableFilters_TestIDs.container)}>
            {children}
            <StyledClearContainer>
                <IconButton onClick={onClear} size="small" data-cy={joinTestIDs(testID, DataTableFilters_TestIDs.clear_btn)}>
                    <ClearIcon />
                </IconButton>
            </StyledClearContainer>
        </StyledContainer>
    );
}

const StyledContainer = styled.div<{ open: boolean }>`
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: 1rem;
    overflow: hidden;
    max-height: ${({ open }) => (open ? '500px' : '0')};
    transition: max-height 300ms ease;
    padding-top: ${({ open }) => (open ? '0.5rem' : '0')};
    padding-bottom: ${({ open }) => (open ? '0.5rem' : '0')};
`;

const StyledClearContainer = styled.div`
    display: flex;
    align-items: center;
`;