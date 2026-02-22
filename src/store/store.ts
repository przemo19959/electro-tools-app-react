import { configureStore } from '@reduxjs/toolkit'
import overlaySpinnerSlice from '../components/overlay-spinner/overlay-spinner-slice'
import alertStackSlice, { alertListener } from '../components/alert-stack/alert-stack-slice'

export const store = configureStore({
  reducer: {
    overlaySpinnerSlice,
    alertStackSlice,
  },
  middleware: (gdm) => gdm().prepend(alertListener.middleware),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch