import { createSlice } from "@reduxjs/toolkit";
import type { RootState } from "../../store/store";

type OverlaySpinnerState = {
    value: number;
};

const initialState: OverlaySpinnerState = {
    value: 0,
};

const overlaySpinnerSlice = createSlice({
    name: 'overlaySpinner',
    initialState,
    reducers: {
        increment: (state) => {
            state.value += 1;
        },
        decrement: (state) => {
            state.value -= 1;
        },
    },
});

export const { increment, decrement } = overlaySpinnerSlice.actions;
export default overlaySpinnerSlice.reducer;

export const isZero = (state: RootState) => state.overlaySpinnerSlice.value <= 0;