export const ABORT_MESSAGE = '__abort_was_expected__';

export const HANDLE_ABORT_EXCEPTION = (e: any) => {
    if (e === ABORT_MESSAGE) return;
    return Promise.reject(e);
}