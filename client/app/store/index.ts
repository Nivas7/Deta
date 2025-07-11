import applicationReducer from '@/state/applicationSlice';
import flowsReducer from '@/state/flowSlice';
import jobsReducer from '@/state/jobSlice';
import { configureStore } from '@reduxjs/toolkit';

export const store = configureStore({
  reducer: {
    flows: flowsReducer,
    jobs: jobsReducer,
    application: applicationReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
