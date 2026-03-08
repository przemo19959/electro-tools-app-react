import { useEffect, useRef } from "react";
import { useAppDispatch } from "../../store/hooks";
import { addAlert } from "../../components/alert-stack/alert-stack-slice";
import type { CreateOvercurrentProtectionElementDto, UpdateOvercurrentProtectionElementDto } from "../../api/api";
import { decrement, increment } from "../../components/overlay-spinner/overlay-spinner-slice";
import { ApiInstance } from "../../main";
import { ABORT_MESSAGE } from "../../utils/api-utils";

export const useOvercurrentProtectionElementApi = () => {
    const dispatch = useAppDispatch();
    const abortControllerRef = useRef<AbortController | null>(null);

    const success = (message: string) => dispatch(addAlert({
        id: new Date().getTime(),
        message,
        type: 'success',
    }));

    const create = (data: CreateOvercurrentProtectionElementDto) => {
        dispatch(increment());
        return ApiInstance.overcurrentProtectionElementController.create3(data, { signal: abortControllerRef.current?.signal })
            .then(() => success('Overcurrent protection created successfully'))
            .finally(() => dispatch(decrement()));
    }

    const update = (elementId: string, data: UpdateOvercurrentProtectionElementDto) => {
        dispatch(increment());
        return ApiInstance.overcurrentProtectionElementController.update3(elementId, data, { signal: abortControllerRef.current?.signal })
            .then(() => success('Overcurrent protection updated successfully'))
            .finally(() => dispatch(decrement()));
    }

    const deleteById = (elementId: string) => {
        dispatch(increment());
        return ApiInstance.overcurrentProtectionElementController.deleteById2(elementId, { signal: abortControllerRef.current?.signal })
            .then(() => success('Overcurrent protection removed successfully'))
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