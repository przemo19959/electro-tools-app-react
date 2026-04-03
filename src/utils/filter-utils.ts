import type { FilterColumnDto, FilterGroupDto } from "../api/api";

type ProjectFilterableColumn = 'NAME' | 'CREATED_DATE' | 'MODIFIED_DATE' | 'CREATED_BY' | 'MODIFIED_BY';

export type FilterableColumn = ProjectFilterableColumn;

export class FilterUtils {
    static getColumnValue(filter: FilterGroupDto, column: FilterableColumn): string {
        console.log(filter);
        
        return filter.columns?.find(v => v.column === column)?.value ?? '';
    }

    static updateStringEq(filter: FilterGroupDto, column: FilterableColumn, value: string): FilterGroupDto {
        return this.updateColumnHelper(filter, column, 'STRING_EQ', value);
    }

    private static updateColumnHelper(filter: FilterGroupDto, column: FilterableColumn, operator: FilterColumnDto['operator'], value: string): FilterGroupDto {
        const otherCols = filter.columns?.filter(v=>v.column !== column) ?? [];
        if(value === '') {
            return { ...filter, columns: otherCols };
        }

        const updatedColumns = [...otherCols, { column, operator, value }];
        return { ...filter, columns: updatedColumns };
    }
}