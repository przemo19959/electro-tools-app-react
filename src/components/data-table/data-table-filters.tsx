import styled from "@emotion/styled";
import type { FilterGroupDto } from "../../api/api";
import { createTestIDsForComponent, joinTestIDs } from "../../utils/common-utils";
import { FilterGroupNode } from "./data-table-filter-group";
import type { FilterableColumnToValues, FilterColumnDef } from "./types";

const DataTableFilters_TestIDs = createTestIDsForComponent('DataTableFilters', [
    'container',
]);

type DataTableFiltersProps = {
    open: boolean;
    testID: string;
    filter: FilterGroupDto;
    onChange: (filter: FilterGroupDto) => void;
    availableColumns: FilterColumnDef[];
    columnToValues: FilterableColumnToValues;
};

export const DataTableFilters = ({ open, testID, filter, onChange, availableColumns, columnToValues }: DataTableFiltersProps) => {
    return (
        <StyledContainer open={open} data-cy={joinTestIDs(testID, DataTableFilters_TestIDs.container)}>
            <StyledRoot>
                <FilterGroupNode
                    group={filter}
                    onChange={onChange}
                    availableColumns={availableColumns}
                    columnToValues={columnToValues}
                    depth={0}
                    testID={joinTestIDs(testID, `root`)}
                />
            </StyledRoot>
        </StyledContainer>
    );
};

const StyledContainer = styled.div<{ open: boolean }>`
    overflow-y: auto;
    overflow-x: hidden;
    max-height: ${({ open }) => (open ? '800px' : '0')};
    transition: max-height 300ms ease;
    padding-top:    ${({ open }) => (open ? '0.5rem' : '0')};
    padding-bottom: ${({ open }) => (open ? '0.5rem' : '0')};
`;

const StyledRoot = styled.div`
    display: flex;
    align-items: flex-start;
    gap: 0.5rem;
`;