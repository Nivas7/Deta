import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface JobApplication {
    id: string;         // unique ID for each application
    companyName: string;
    status: string;
    createdAt: string;  // date the application was added
}

interface ApplicationState {
    applications: JobApplication[];
}

const initialState: ApplicationState = {
    applications: [],
};

export const applicationSlice = createSlice({
    name: 'application',
    initialState,
    reducers: {
        addApplication: (
            state,
            action: PayloadAction<{ companyName: string; status: string }>
        ) => {
            const { companyName, status } = action.payload;
            state.applications.push({
                id: Date.now().toString(),
                companyName,
                status,
                createdAt: new Date().toISOString(),
            });
        },
        updateApplicationStatus: (
            state,
            action: PayloadAction<{ id: string; newStatus: string }>
        ) => {
            const { id, newStatus } = action.payload;
            const app = state.applications.find((a) => a.id === id);
            if (app) {
                app.status = newStatus;
            }
        },
        removeApplication: (state, action: PayloadAction<string>) => {
            state.applications = state.applications.filter((a) => a.id !== action.payload);
        },
    },
});

export const {
    addApplication,
    updateApplicationStatus,
    removeApplication,
} = applicationSlice.actions;

export default applicationSlice.reducer;
