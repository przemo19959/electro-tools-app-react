import { useEffect, useRef } from "react";
import { type CreateProjectDto, type FilterGroupDto, type ReadProjectDto, type UpdateProjectDto } from "../../api/api"
import { decrement, increment } from "../../components/overlay-spinner/overlay-spinner-slice";
import { ApiInstance } from "../../main";
import { useAppDispatch } from "../../store/hooks";
import { addAlert } from "../../components/alert-stack/alert-stack-slice";
import type { DataTableSort } from "../../components/data-table/types";
import { ABORT_MESSAGE } from "../../utils/api-utils";

export const useProjectApi = () => {
    const dispatch = useAppDispatch();
    const abortControllerRef = useRef<AbortController | null>(null);

    const success = (message: string) => dispatch(addAlert({
        id: new Date().getTime(),
        message,
        type: 'success',
    }));

    const pageAll = (
        filter: FilterGroupDto,
        page: number,
        pageSize: number,
        sort?: DataTableSort<ReadProjectDto>,
        query?: string,
    ) => {
        dispatch(increment());
        return ApiInstance.projectController.pageAll(filter, {
            page,
            size: pageSize,
            sort: sort ? [`${sort.key},${sort.order}`] : undefined,
            query,
        }, { signal: abortControllerRef.current?.signal })
            .then(v => v.data)
            .finally(() => dispatch(decrement()));
    }

    const create = (data: CreateProjectDto) => {
        dispatch(increment());
        return ApiInstance.projectController.create2(data, { signal: abortControllerRef.current?.signal })
            .then(() => success('Project created successfully'))
            .finally(() => dispatch(decrement()));
    }

    const update = (projectId: string, data: UpdateProjectDto) => {
        dispatch(increment());
        return ApiInstance.projectController.update2(projectId, data, { signal: abortControllerRef.current?.signal })
            .then(() => success('Project updated successfully'))
            .finally(() => dispatch(decrement()));
    }

    const deleteAllById = (projectIds: string[]) => {
        dispatch(increment());
        return ApiInstance.projectController.deleteAllById(projectIds, { signal: abortControllerRef.current?.signal })
            .then(() => success('Projects removed successfully'))
            .finally(() => dispatch(decrement()));
    }

    useEffect(() => {
        abortControllerRef.current = new AbortController();

        return () => {
            abortControllerRef.current?.abort(ABORT_MESSAGE);
        }
    }, []);

    return {
        pageAll,
        create,
        update,
        deleteAllById,
    }
}