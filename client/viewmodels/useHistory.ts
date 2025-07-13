import { useAppDispatch, useAppSelector } from '@/state/hooks';
import { deleteApplication, loadApplicationsAsync, updateApplicationStatus } from '@/state/jobSlice';
import { JobStatus } from '@/types';
import { useCallback, useState } from 'react';


export const useHistory = () => {
  const dispatch = useAppDispatch();
  const applications = useAppSelector(state => state.jobs.applications);
  const loading = useAppSelector(state => state.jobs.loading);
  const error = useAppSelector(state => state.jobs.error);

  const [refreshing, setRefreshing] = useState(false);

  const refresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await dispatch(loadApplicationsAsync()).unwrap();
    } catch (err) {
      console.error('Failed to refresh applications:', err);
    } finally {
      setRefreshing(false);
    }
  }, [dispatch]);

  const handleDeleteApplication = useCallback((id: string) => {
    dispatch(deleteApplication(id));
  }, [dispatch]);

  const handleUpdateApplicationStatus = useCallback((id: string, status: JobStatus) => {
    dispatch(updateApplicationStatus({ id, status }));
  }, [dispatch]);

  return {
    applications,
    loading,
    error,
    refreshing,
    refresh,
    deleteApplication: handleDeleteApplication,
    updateApplicationStatus: handleUpdateApplicationStatus,
  };
};
