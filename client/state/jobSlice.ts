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

export const loadApplicationsAsync = createAsyncThunk<JobApplication[], void>(
  'jobs/loadApplications',
  async () => {
    const apps = await loadApplications();
    return apps.map(app => ({
      ...app,
      statusHistory: app.statusHistory || [{ status: app.status, timestamp: app.createdAt || new Date().toISOString() }],
      createdAt: app.createdAt || new Date().toISOString(),
      updatedAt: app.updatedAt || app.createdAt || new Date().toISOString(),
    }));
  }
);

export const addApplicationAsync = createAsyncThunk<
  JobApplication[],
  {
    companyName: string;
    position: string;
    notes?: string;
    dateApplied: string;
    initialStatus: JobStatus;
    interviewDate?: string;
    interviewType?: string;
    interviewRound?: string;
  }
>(
  'jobs/addApplication',
  async (jobInput, { getState }) => {
    const state = getState() as { jobs: JobState };
    const now = new Date().toISOString();

    const newJob: JobApplication = {
      id: Date.now().toString(),
      companyName: jobInput.companyName,
      position: jobInput.position,
      dateApplied: jobInput.dateApplied,
      status: jobInput.initialStatus,
      notes: jobInput.notes,
      createdAt: now,
      updatedAt: now,
      statusHistory: [{ status: jobInput.initialStatus, timestamp: now }],
      ...(jobInput.interviewDate && { interviewDate: jobInput.interviewDate }),
      ...(jobInput.interviewType && { interviewType: jobInput.interviewType }),
      ...(jobInput.interviewRound && { interviewRound: jobInput.interviewRound }),
    };

    const updated = [...state.jobs.applications, newJob];
    await saveApplications(updated);
    return updated;
  }
);

// Update Status
export const updateApplicationStatus = createAsyncThunk<
  JobApplication[],
  { id: string; status: JobStatus }
>(
  'jobs/updateApplicationStatus',
  async ({ id, status }, { getState }) => {
    const state = getState() as { jobs: JobState };
    const now = new Date().toISOString();
    const updated = state.jobs.applications.map(app =>
      app.id === id
        ? {
          ...app,
          status,
          updatedAt: now,
          statusHistory: [...(app.statusHistory || []), { status, timestamp: now }],
        }
        : app
    );
    await saveApplications(updated);
    return updated;
  }
);

// Delete Application
export const deleteApplication = createAsyncThunk<JobApplication[], string>(
  'jobs/deleteApplication',
  async (id, { getState }) => {
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
      // loadApplicationsAsync
      .addCase(loadApplicationsAsync.pending, state => {
        state.loading = true;
        state.error = null;
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
      // addApplicationAsync
      .addCase(addApplicationAsync.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addApplicationAsync.fulfilled, (state, action: PayloadAction<JobApplication[]>) => {
        state.applications = action.payload;
        state.loading = false;
        state.error = null;
      })
      .addCase(addApplicationAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to add application';
      })
      // updateApplicationStatus
      .addCase(updateApplicationStatus.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateApplicationStatus.fulfilled, (state, action: PayloadAction<JobApplication[]>) => {
        state.applications = action.payload;
        state.loading = false;
        state.error = null;
      })
      .addCase(updateApplicationStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to update application status';
      })
      // deleteApplication
      .addCase(deleteApplication.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteApplication.fulfilled, (state, action: PayloadAction<JobApplication[]>) => {
        state.applications = action.payload;
        state.loading = false;
        state.error = null;
      })
      .addCase(deleteApplication.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to delete application';
      });
  },
});

export default jobSlice.reducer;
