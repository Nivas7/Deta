import { useAppDispatch, useAppSelector } from '@/state/hooks';
import { deleteApplication, loadApplicationsAsync, updateApplicationStatus } from '@/state/jobSlice';
import { JobStatus } from '@/types';
import { useState } from 'react';

export const useHistory = () => {
  const dispatch = useAppDispatch();
  const applications = useAppSelector(state => state.jobs.applications);
  const loading = useAppSelector(state => state.jobs.loading);

  const [refreshing, setRefreshing] = useState(false);

  const refresh = async () => {
    setRefreshing(true);
    await dispatch(loadApplicationsAsync()).unwrap();
    setRefreshing(false);
  };

  const handleDeleteJob = (id: string) => {
    dispatch(deleteApplication(id));
  };

  const handleUpdateStatus = (id: string, status: JobStatus) => {
    dispatch(updateApplicationStatus({ id, status }));
  };

  return {
    applications,
    loading,
    refreshing,
    refresh,
    deleteApplication: handleDeleteJob,
    updateApplicationStatus: handleUpdateStatus,
    setRefreshing,
  };
};
