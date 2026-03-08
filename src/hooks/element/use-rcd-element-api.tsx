import { useEffect, useRef } from "react";
import type { CreateRcdElementDto, UpdateRcdElementDto } from "../../api/api";
import { useAppDispatch } from "../../store/hooks";
import { addAlert } from "../../components/alert-stack/alert-stack-slice";
import { decrement, increment } from "../../components/overlay-spinner/overlay-spinner-slice";
import { ApiInstance } from "../../main";
import { ABORT_MESSAGE } from "../../utils/api-utils";

export const useRcdElementApi = () => {
    const dispatch = useAppDispatch();
    const abortControllerRef = useRef<AbortController | null>(null);

    const success = (message: string) => dispatch(addAlert({
        id: new Date().getTime(),
        message,
        type: 'success',
    }));

    const create = (data: CreateRcdElementDto) => {
        dispatch(increment());
        return ApiInstance.rcdElementController.create1(data, { signal: abortControllerRef.current?.signal })
            .then(() => success('RCD created successfully'))
            .finally(() => dispatch(decrement()));
    }

    const update = (elementId: string, data: UpdateRcdElementDto) => {
        dispatch(increment());
        return ApiInstance.rcdElementController.update1(elementId, data, { signal: abortControllerRef.current?.signal })
            .then(() => success('RCD updated successfully'))
            .finally(() => dispatch(decrement()));
    }

    const deleteById = (elementId: string) => {
        dispatch(increment());
        return ApiInstance.rcdElementController.deleteById1(elementId, { signal: abortControllerRef.current?.signal })
            .then(() => success('RCD removed successfully'))
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