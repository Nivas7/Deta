// src/viewmodels/useHome.ts

import type { AppDispatch, RootState } from '@/state/store';
// import { addApplicationAsync, deleteApplication, loadApplicationsAsync, updateApplicationStatus } from '@/state/jobSlice'; // Potentially remove these
import { JobApplication, JobStatus } from '@/types';
import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';

export const useHome = () => {
  const dispatch = useDispatch<AppDispatch>();

  // If Firebase is the source of truth, you wouldn't use dummyApplications here.
  // Instead, applications would come from your Firebase data listener.
  // For now, if you're mixing, keep this for other parts of the app that rely on it.
  const applications = useSelector((state: RootState) => state.jobs.applications); // Get from Redux state

  const loading = useSelector((state: RootState) => state.jobs.loading);

  const refresh = useCallback(() => {
    // If Firebase is sole source, this might not be needed or would trigger a Firebase re-fetch.
    // For now, if Redux is still managing this, keep it.
    // dispatch(loadApplicationsAsync()); // Uncomment if Redux still loads data
  }, []); // Remove dispatch if not used

  // These functions would now typically interact directly with Firebase/backend
  // or trigger actions that then interact with Firebase.
  // They are provided by useAnalytics in the new setup.
  const addJob = useCallback(
    (jobData: Omit<JobApplication, 'id' | 'createdAt'>) => {
      console.log("Add job action triggered, but Firebase is now handling data. Implement Firebase add here if needed.");
      // If you still want Redux state to reflect Firebase data,
      // you'd dispatch a plain Redux action here after successful Firebase write.
      // E.g., dispatch(addApplicationSuccess(firebaseData));
    },
    [] // No dispatch dependency if not dispatching here
  );

  const updateStatus = useCallback(
    (id: string, status: JobStatus) => {
      console.log("Update status action triggered. Implement Firebase update here if needed.");
    },
    []
  );

  const deleteJob = useCallback(
    (id: string) => {
      console.log("Delete job action triggered. Implement Firebase delete here if needed.");
    },
    []
  );

  return {
    applications,
    loading,
    refresh,
    addJob,
    updateStatus,
    sankeyData: null, // You probably don't need sankeyData from here anymore if useAnalytics provides it
    deleteJob,
  };
};