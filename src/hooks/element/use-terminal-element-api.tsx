import { useEffect, useRef } from "react";
import { useAppDispatch } from "../../store/hooks";
import { addAlert } from "../../components/alert-stack/alert-stack-slice";
import type { CreateTerminalElementDto, UpdateTerminalElementDto } from "../../api/api";
import { decrement, increment } from "../../components/overlay-spinner/overlay-spinner-slice";
import { ApiInstance } from "../../main";
import { ABORT_MESSAGE } from "../../utils/api-utils";

export const useTerminalElementApi = () => {
    const dispatch = useAppDispatch();
    const abortControllerRef = useRef<AbortController | null>(null);

    const success = (message: string) => dispatch(addAlert({
        id: new Date().getTime(),
        message,
        type: 'success',
    }));

    const create = (data: CreateTerminalElementDto) => {
        dispatch(increment());
        return ApiInstance.terminalElementController.create(data, { signal: abortControllerRef.current?.signal })
            .then(() => success('Terminal created successfully'))
            .finally(() => dispatch(decrement()));
    }

    const update = (elementId: string, data: UpdateTerminalElementDto) => {
        dispatch(increment());
        return ApiInstance.terminalElementController.update(elementId, data, { signal: abortControllerRef.current?.signal })
            .then(() => success('Terminal updated successfully'))
            .finally(() => dispatch(decrement()));
    }

    const deleteById = (elementId: string) => {
        dispatch(increment());
        return ApiInstance.terminalElementController.deleteById(elementId, { signal: abortControllerRef.current?.signal })
            .then(() => success('Terminal removed successfully'))
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