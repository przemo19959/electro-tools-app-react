import { useEffect, useRef } from "react";
import { useAppDispatch } from "../../store/hooks";
import { ApiInstance } from "../../main";
import type { CreateLoadElementDto, UpdateLoadElementDto } from "../../api/api";
import { decrement, increment } from "../../components/overlay-spinner/overlay-spinner-slice";
import { addAlert } from "../../components/alert-stack/alert-stack-slice";
import { ABORT_MESSAGE } from "../../utils/api-utils";

export const useLoadElementApi = () => {
    const dispatch = useAppDispatch();
    const abortControllerRef = useRef<AbortController | null>(null);

    const success = (message: string) => dispatch(addAlert({
        id: new Date().getTime(),
        message,
        type: 'success',
    }));

    const create = (data: CreateLoadElementDto) => {
        dispatch(increment());
        return ApiInstance.loadElementController.create4(data, { signal: abortControllerRef.current?.signal })
            .then(() => success('Load created successfully'))
            .finally(() => dispatch(decrement()));
    }

    const update = (elementId: string, data: UpdateLoadElementDto) => {
        dispatch(increment());
        return ApiInstance.loadElementController.update4(elementId, data, { signal: abortControllerRef.current?.signal })
            .then(() => success('Load updated successfully'))
            .finally(() => dispatch(decrement()));
    }

    const deleteById = (elementId: string) => {
        dispatch(increment());
        return ApiInstance.loadElementController.deleteById3(elementId, { signal: abortControllerRef.current?.signal })
            .then(() => success('Load removed successfully'))
            .finally(() => dispatch(decrement()));
    }

    useEffect(() => {
        abortControllerRef.current = new AbortController();

        return () => {
            abortControllerRef.current?.abort(ABORT_MESSAGE);
        }
    }, []);

    return {
        create,
        update,
        deleteById,
    }
}