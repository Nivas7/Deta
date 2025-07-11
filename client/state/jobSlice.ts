// src/state/jobSlice.ts
import { JobApplication, JobStatus } from '@/types'; // Import StatusHistoryEntry
import { loadApplications, saveApplications } from '@/utils/storage';
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface JobState {
  applications: JobApplication[];
  loading: boolean;
  error: string | null;
}

const initialState: JobState = {
  applications: [],
  loading: false,
  error: null,
};

// Load Applications
export const loadApplicationsAsync = createAsyncThunk(
  'jobs/loadApplications',
  async () => {
    const apps = await loadApplications();
    // Ensure statusHistory exists for older entries if not present
    // This is a migration step for existing data
    return apps.map(app => ({
      ...app,
      statusHistory: app.statusHistory || [{ status: app.status, timestamp: app.createdAt || new Date().toISOString() }],
      createdAt: app.createdAt || new Date().toISOString(), // Ensure createdAt is set
      updatedAt: app.updatedAt || app.createdAt || new Date().toISOString(), // Ensure updatedAt is set
    }));
  }
);

// Add Application - Fixed payload type and statusHistory generation
export const addApplicationAsync = createAsyncThunk(
  'jobs/addApplication',
  async (
    // Define the exact payload shape this thunk expects from the ViewModel
    jobInput: {
      companyName: string;
      position: string;
      notes?: string;
      dateApplied: string; // YYYY-MM-DD string
      initialStatus: JobStatus;
      // Include interview fields if the form collects them
      interviewDate?: string; // YYYY-MM-DD string
      interviewType?: string;
      interviewRound?: string;
    },
    { getState }
  ) => {
    const state = getState() as { jobs: JobState };
    const now = new Date().toISOString();

    const newJob: JobApplication = {
      id: Date.now().toString(), // Simple unique ID
      companyName: jobInput.companyName,
      position: jobInput.position,
      dateApplied: jobInput.dateApplied, // From form
      status: jobInput.initialStatus, // Initial status from form
      notes: jobInput.notes,
      createdAt: now,
      updatedAt: now,
      statusHistory: [{ status: jobInput.initialStatus, timestamp: now }], // Initial history entry

      // Include optional interview details if provided
      ...(jobInput.interviewDate && { interviewDate: jobInput.interviewDate }),
      ...(jobInput.interviewType && { interviewType: jobInput.interviewType }),
      ...(jobInput.interviewRound && { interviewRound: jobInput.interviewRound }),
    };

    const updated = [...state.jobs.applications, newJob];
    await saveApplications(updated);
    return updated;
  }
);

// Update Status - Ensure statusHistory is updated
export const updateApplicationStatus = createAsyncThunk(
  'jobs/updateApplicationStatus',
  async ({ id, status }: { id: string; status: JobStatus }, { getState }) => {
    const state = getState() as { jobs: JobState };
    const now = new Date().toISOString();
    const updated = state.jobs.applications.map(app =>
      app.id === id
        ? {
          ...app,
          status,
          updatedAt: now,
          // Ensure statusHistory is an array, then add the new entry
          statusHistory: [...(app.statusHistory || []), { status, timestamp: now }],
        }
        : app
    );
    await saveApplications(updated);
    return updated;
  }
);

// Delete Application (no changes needed)
export const deleteApplication = createAsyncThunk(
  'jobs/deleteApplication',
  async (id: string, { getState }) => {
    const state = getState() as { jobs: JobState };
    const updated = state.jobs.applications.filter(app => app.id !== id);
    await saveApplications(updated);
    return updated;
  }
);

export const jobSlice = createSlice({
  name: 'jobs',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(loadApplicationsAsync.pending, state => {
        state.loading = true;
      })
      .addCase(loadApplicationsAsync.fulfilled, (state, action: PayloadAction<JobApplication[]>) => {
        state.applications = action.payload;
        state.loading = false;
        state.error = null;
      })
      .addCase(loadApplicationsAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to load applications';
      })
      .addCase(addApplicationAsync.fulfilled, (state, action: PayloadAction<JobApplication[]>) => {
        state.applications = action.payload;
      })
      .addCase(updateApplicationStatus.fulfilled, (state, action: PayloadAction<JobApplication[]>) => {
        state.applications = action.payload;
      })
      .addCase(deleteApplication.fulfilled, (state, action: PayloadAction<JobApplication[]>) => {
        state.applications = action.payload;
      });
  },
});

export default jobSlice.reducer;