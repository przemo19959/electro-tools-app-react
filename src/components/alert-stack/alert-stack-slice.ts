import { createListenerMiddleware, createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { AlertItem } from "./types";
import type { RootState } from "../../store/store";

const timeout: number = 1500;

type AlertStackSliceState = {
    alerts: AlertItem[];
}

const initialState: AlertStackSliceState = {
    alerts: [],
};

const alertStackSlice = createSlice({
    name: 'alertStack',
    initialState,
    reducers: {
        addAlert: (state, action: PayloadAction<AlertItem>) => {
            state.alerts.push(action.payload);
        },
        removeItem: (state, action: PayloadAction<number>) => {
            state.alerts = state.alerts.filter(alert => alert.id !== action.payload);
        }
    },
});

export default alertStackSlice.reducer;

export const {
    addAlert,
    removeItem
} = alertStackSlice.actions;

export const alerts = (state: RootState) => state.alertStackSlice.alerts;

export const alertListener = createListenerMiddleware();

alertListener.startListening({
    actionCreator: addAlert,
    effect: async (action, listenerApi) => {
        const id = action.payload.id;

        // wait timeout
        await listenerApi.delay(timeout);

        // remove item
        listenerApi.dispatch(removeItem(id));
    },
});
