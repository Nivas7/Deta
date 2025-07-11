// src/state/flowSlice.ts
import { JobApplication, SankeyLink, SankeyNode } from '@/types'; // Import SankeyLink, SankeyNode
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';

interface FlowsState {
    nodes: SankeyNode[]; // Changed from flowsInput: string
    links: SankeyLink[]; // Changed from flowsInput: string
    loadingFlows: boolean;
    errorFlows: string | null;
}

const initialState: FlowsState = {
    nodes: [], // Initialize as empty array
    links: [], // Initialize as empty array
    loadingFlows: false,
    errorFlows: null,
};

// Removed getFlowKey as it's no longer directly needed for the new Sankey data structure

export const generateAndSetSankeyFlows = createAsyncThunk(
    'flows/generateAndSetSankeyFlows',
    async (applications: JobApplication[], { rejectWithValue }) => {
        try {
            const linkCounts: Record<string, number> = {}; // Stores "source->target": count
            const uniqueStatuses = new Set<string>();

            applications.forEach((app: JobApplication) => {
                // Ensure statusHistory exists and has at least one entry
                if (app.statusHistory && app.statusHistory.length > 0) {
                    app.statusHistory.forEach((entry, index) => {
                        uniqueStatuses.add(entry.status); // Add current status to unique list

                        if (index < app.statusHistory.length - 1) {
                            const sourceStatus = entry.status;
                            const targetStatus = app.statusHistory[index + 1].status;

                            // Increment count for this transition
                            const key = `${sourceStatus}->${targetStatus}`;
                            linkCounts[key] = (linkCounts[key] || 0) + 1;
                        }
                    });
                } else {
                    // Fallback for applications without status history (e.g., old data or incomplete)
                    // If an app only has a single status, it's considered 'Applied' for the diagram
                    // This creates a "start" node for applications with no history.
                    // You might adjust this logic based on your desired diagram representation.
                    if (app.status) {
                        uniqueStatuses.add('Applied'); // Assume all applications start here
                        uniqueStatuses.add(app.status);
                        if (app.status !== 'Applied') {
                            const key = `Applied->${app.status}`;
                            linkCounts[key] = (linkCounts[key] || 0) + 1;
                        }
                    }
                }
            });

            // Create Nodes
            const nodes: SankeyNode[] = Array.from(uniqueStatuses).map(status => ({
                id: status,
                name: status, // Display name is the status itself
            }));

            // Create Links
            const links: SankeyLink[] = Object.entries(linkCounts).map(([key, value]) => {
                const [source, target] = key.split('->');
                return { source, target, value };
            });

            return { nodes, links }; // Return the structured object
        } catch (error: any) {
            console.error('Error generating Sankey flows:', error);
            return rejectWithValue(error.message || 'Failed to generate flows');
        }
    }
);

const flowsSlice = createSlice({
    name: 'flows',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(generateAndSetSankeyFlows.pending, (state) => {
                state.loadingFlows = true;
                state.errorFlows = null;
            })
            .addCase(generateAndSetSankeyFlows.fulfilled, (state, action: PayloadAction<{ nodes: SankeyNode[]; links: SankeyLink[] }>) => {
                state.loadingFlows = false;
                state.nodes = action.payload.nodes; // Assign nodes
                state.links = action.payload.links; // Assign links
            })
            .addCase(generateAndSetSankeyFlows.rejected, (state, action) => {
                state.loadingFlows = false;
                state.errorFlows = action.payload as string;
                state.nodes = []; // Clear nodes on error
                state.links = []; // Clear links on error
            });
    },
});

export default flowsSlice.reducer;