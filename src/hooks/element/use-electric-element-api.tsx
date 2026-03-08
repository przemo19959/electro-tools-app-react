import { useEffect, useRef } from "react";
import { useAppDispatch } from "../../store/hooks";
import { addAlert } from "../../components/alert-stack/alert-stack-slice";
import { ApiInstance } from "../../main";
import { decrement, increment } from "../../components/overlay-spinner/overlay-spinner-slice";
import type { CreateAbstractElementDto, UpdateAbstractElementDto } from "../../api/api";
import { ABORT_MESSAGE } from "../../utils/api-utils";


export const useElectricElementApi = () => {
    const dispatch = useAppDispatch();
    const abortControllerRef = useRef<AbortController | null>(null);

    const success = (message: string) => dispatch(addAlert({
        id: new Date().getTime(),
        message,
        type: 'success',
    }));

    const getTrees = (projectId: string) => {
        dispatch(increment());
        return ApiInstance.basicElementController.getTrees({ projectId }, { signal: abortControllerRef.current?.signal })
            .then((v) => {
                console.log(v.data);
                return v.data;
            })
            .finally(() => dispatch(decrement()));
    }

    const create = (data: CreateAbstractElementDto) => {
        dispatch(increment());
        return ApiInstance.basicElementController.create5(data, { signal: abortControllerRef.current?.signal })
            .then(() => success('Element created successfully'))
            .finally(() => dispatch(decrement()));
    }

    const update = (elementId: string, data: UpdateAbstractElementDto) => {
        dispatch(increment());
        return ApiInstance.basicElementController.update5(elementId, data, { signal: abortControllerRef.current?.signal })
            .then(() => success('Element updated successfully'))
            .finally(() => dispatch(decrement()));
    }

    const deleteAllById = (elementIds: string[]) => {
        dispatch(increment());
        return ApiInstance.basicElementController.remove(elementIds, { signal: abortControllerRef.current?.signal })
            .then(() => success('Elements removed successfully'))
            .finally(() => dispatch(decrement()));
    }

    useEffect(() => {
        abortControllerRef.current = new AbortController();

        return () => {
            abortControllerRef.current?.abort(ABORT_MESSAGE);
        }
    }, []);

    return {
        getTrees,
        create,
        update,
        deleteAllById,
    }
}