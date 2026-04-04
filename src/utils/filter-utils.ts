import type { FilterColumnDto, FilterGroupDto } from "../api/api";
import type { FilterColumnDef } from "../components/data-table/types";
import { DEFAULT_OPERATOR_FOR_TYPE } from "../components/data-table/types";

type ProjectFilterableColumn = 'NAME' | 'CREATED_DATE' | 'MODIFIED_DATE' | 'CREATED_BY' | 'MODIFIED_BY';

export type FilterableColumn = ProjectFilterableColumn;

export class FilterUtils {
    static getColumnValue(filter: FilterGroupDto, column: FilterableColumn): string {
        return filter.columns?.find(v => v.column === column)?.value ?? '';
    }

    static updateStringIlike(filter: FilterGroupDto, column: FilterableColumn, value: string): FilterGroupDto {
        return this.updateColumnHelper(filter, column, 'STRING_ILIKE', value);
    }

    static updateColumn(filter: FilterGroupDto, index: number, col: FilterColumnDto): FilterGroupDto {
        const updated = [...(filter.columns ?? [])];
        updated[index] = col;
        return { ...filter, columns: updated };
    }

    static removeColumn(filter: FilterGroupDto, index: number): FilterGroupDto {
        return { ...filter, columns: (filter.columns ?? []).filter((_, i) => i !== index) };
    }

    static addColumn(filter: FilterGroupDto, availableColumns: FilterColumnDef[]): FilterGroupDto {
        const firstCol = availableColumns[0];
        if (!firstCol) return filter;
        return {
            ...filter,
            columns: [...(filter.columns ?? []), {
                column: firstCol.key,
                operator: DEFAULT_OPERATOR_FOR_TYPE[firstCol.type],
                value: '',
            }],
        };
    }

    static updateGroup(filter: FilterGroupDto, index: number, subgroup: FilterGroupDto): FilterGroupDto {
        const updated = [...(filter.groups ?? [])];
        updated[index] = subgroup;
        return { ...filter, groups: updated };
    }

    static removeGroup(filter: FilterGroupDto, index: number): FilterGroupDto {
        return { ...filter, groups: (filter.groups ?? []).filter((_, i) => i !== index) };
    }

    static addGroup(filter: FilterGroupDto): FilterGroupDto {
        return {
            ...filter,
            groups: [...(filter.groups ?? []), { operator: 'AND', columns: [], groups: [] }],
        };
    }

    static clearGroup(filter: FilterGroupDto): FilterGroupDto {
        return { ...filter, columns: [], groups: [] };
    }

    static sanitizeFilter(filter: FilterGroupDto): FilterGroupDto {
        const sanitizedColumns = (filter.columns ?? []).filter(col => col.value !== '' && col.value !== undefined);
        const sanitizedGroups = (filter.groups ?? []).map(group => this.sanitizeFilter(group)).filter(group => (group.columns?.length ?? 0) > 0 || (group.groups?.length ?? 0) > 0);
        return { ...filter, columns: sanitizedColumns, groups: sanitizedGroups };
    }

    static countActiveConditions(filter: FilterGroupDto): number {
        const columnCount = (filter.columns ?? []).filter(col => col.value !== '' && col.value !== undefined).length;
        const groupCount = (filter.groups ?? []).reduce((sum, group) => sum + this.countActiveConditions(group), 0);
        return columnCount + groupCount;
    }


    private static updateColumnHelper(filter: FilterGroupDto, column: FilterableColumn, operator: FilterColumnDto['operator'], value: string): FilterGroupDto {
        const otherCols = filter.columns?.filter(v => v.column !== column) ?? [];
        if (value === '') {
            return { ...filter, columns: otherCols };
        }
        const updatedColumns = [...otherCols, { column, operator, value }];
        return { ...filter, columns: updatedColumns };
    }
}