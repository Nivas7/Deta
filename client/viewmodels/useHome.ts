import type { AppDispatch, RootState } from '@/app/store';
import {
  addApplicationAsync,
  deleteApplication,
  loadApplicationsAsync,
  updateApplicationStatus,
} from '@/state/jobSlice';
import { JobApplication, JobStatus } from '@/types';
import { dummyApplications } from '@/utils/dummyApplications'; // Ensure this path is correct for your dummy data file
import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';

export const useHome = () => {
  const dispatch = useDispatch<AppDispatch>();

  // Comment out or remove this line to temporarily stop using actual Redux state for applications
  // const applications = useSelector((state: RootState) => state.jobs.applications);

  // Use dummy data directly for testing
  const applications = dummyApplications; // ✨ THIS IS THE KEY CHANGE ✨

  const loading = useSelector((state: RootState) => state.jobs.loading);

  const refresh = useCallback(() => {
    // If you're using dummy data, this refresh might not do anything unless
    // you also want to simulate loading actual data, which would mean toggling this line.
    dispatch(loadApplicationsAsync());
  }, [dispatch]);

  const addJob = useCallback(
    (jobData: Omit<JobApplication, 'id' | 'createdAt'>) => {
      // When using dummy data for display, this action might not visibly add to the list
      // unless you also modify the Redux store in a way that includes dummy data for adding.
      // For pure dummy data display, this function's effect might not be seen immediately.
      dispatch(addApplicationAsync(jobData));
    },
    [dispatch]
  );

  const updateStatus = useCallback(
    (id: string, status: JobStatus) => {
      // This will still attempt to update Redux state, but if your 'applications'
      // constant is *only* the dummy data, you won't see changes reflected.
      dispatch(updateApplicationStatus({ id, status }));
    },
    [dispatch]
  );

  const deleteJob = useCallback(
    (id: string) => {
      // Similar to updateStatus, if 'applications' is only dummy data, deletion won't persist.
      dispatch(deleteApplication(id));
    },
    [dispatch]
  );

  return {
    applications,
    loading,
    refresh,
    addJob,
    updateStatus,
    deleteJob,
  };
};