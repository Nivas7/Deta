// src/state/flowSlice.ts
import { JobApplication } from '@/types';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

interface FlowsState {
    flowsInput: string;
    loadingFlows: boolean;
    errorFlows: string | null;
}

const initialState: FlowsState = {
    flowsInput: '',
    loadingFlows: false,
    errorFlows: null,
};

export const generateAndSetSankeyFlows = createAsyncThunk(
    'flows/generateAndSetSankeyFlows',
    async (applications: JobApplication[], { rejectWithValue }) => {
        try {
            const flows: { [key: string]: number } = {};

            applications.forEach((app: JobApplication) => {
                const currentStatus = app.status;

                // All applications are implicitly considered part of the initial 'Applications' pool.
                // We define flows based on where they transition *from* this pool.

                // If the application is still 'Applied', it doesn't create a *flow* yet,
                // it's just part of the 'Applications' conceptual source node.
                // We only generate flows for applications that have moved BEYOND 'Applied'
                // or represent a terminal state from the initial application phase.

                if (currentStatus === 'Interviewed') {
                    // From the general pool of applications to interviews
                    const flowKey = `Applications -> Interviews`;
                    flows[flowKey] = (flows[flowKey] || 0) + 1;
                } else if (currentStatus === 'Offered') {
                    // Offers always come from Interviews (implicitly handled for now)
                    const flowKey = `Interviews -> Offers`;
                    flows[flowKey] = (flows[flowKey] || 0) + 1;
                } else if (currentStatus === 'Accepted') {
                    // Accepted always comes from Offers
                    const flowKey = `Offers -> Accepted`;
                    flows[flowKey] = (flows[flowKey] || 0) + 1;
                } else if (currentStatus === 'Rejected') {
                    // Rejected can happen directly from the initial application stage
                    const flowKey = `Applications -> Rejected`;
                    flows[flowKey] = (flows[flowKey] || 0) + 1;
                } else if (currentStatus === 'No Answer') {
                    // No answer can also happen directly from the initial application stage
                    const flowKey = `Applications -> No Answer`;
                    flows[flowKey] = (flows[flowKey] || 0) + 1;
                } else if (currentStatus === 'Offer Declined') {
                    // Candidate declined the offer
                    const flowKey = `Offers -> Declined`;
                    flows[flowKey] = (flows[flowKey] || 0) + 1;
                } else if (currentStatus === 'No Offer') {
                    // After interview, no offer given
                    const flowKey = `Interviews -> No Offer`;
                    flows[flowKey] = (flows[flowKey] || 0) + 1;
                }
                // You might need to add logic for other statuses like 'Withdrawn', 'Ghosted', 'Declined' (general)
                // based on how they fit into your funnel from the 'Applications' node.
                // For example:
                // else if (currentStatus === 'Withdrawn') {
                //     const flowKey = `Applications -> Withdrawn`;
                //     flows[flowKey] = (flows[flowKey] || 0) + 1;
                // }
            });

            const formattedFlows = Object.entries(flows)
                .map(([flowKey, value]) => `${flowKey}:${value}`)
                .join('\n');

            return formattedFlows;
        } catch (error: any) {
            return rejectWithValue(error.message);
        }
    }
);


export const flowsSlice = createSlice({
    name: 'flows',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(generateAndSetSankeyFlows.pending, (state) => {
                state.loadingFlows = true;
                state.errorFlows = null;
            })
            .addCase(generateAndSetSankeyFlows.fulfilled, (state, action) => {
                state.loadingFlows = false;
                state.flowsInput = action.payload;
            })
            .addCase(generateAndSetSankeyFlows.rejected, (state, action) => {
                state.loadingFlows = false;
                state.errorFlows = action.payload as string;
                state.flowsInput = '';
            });
    },
});

export default flowsSlice.reducer;