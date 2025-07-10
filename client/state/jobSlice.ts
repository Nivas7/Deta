import { JobApplication, JobStatus } from '@/types';
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

// Load
export const loadApplicationsAsync = createAsyncThunk(
  'jobs/loadApplications',
  async () => {
    const apps = await loadApplications();
    return apps;
  }
);

// Add
export const addApplicationAsync = createAsyncThunk(
  'jobs/addApplication',
  async (jobapplications: Omit<JobApplication, 'id' | 'createdAt'>, { getState }) => {
    const state = getState() as { jobs: JobState };
    const newJob: JobApplication = {
      id: Date.now().toString(),
      ...jobapplications,
      createdAt: new Date().toISOString(),
    };
    const updated = [...state.jobs.applications, newJob];
    await saveApplications(updated);
    return updated;
  }
);

// Update
export const updateApplicationStatus = createAsyncThunk(
  'jobs/updateApplicationStatus',
  async ({ id, status }: { id: string; status: JobStatus }, { getState }) => {
    const state = getState() as { jobs: JobState };
    const updated = state.jobs.applications.map(app =>
      app.id === id
        ? { ...app, status, updatedAt: new Date().toISOString() }
        : app
    );
    await saveApplications(updated);
    return updated;
  }
);

// Delete
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
