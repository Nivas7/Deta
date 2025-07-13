; import { deleteApplication, loadApplicationsAsync, updateApplicationStatus } from '@/state/jobSlice';
import { AppDispatch } from '@/state/store';
import { JobStatus } from '@/types';
import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';

export const useHome = () => {
  const dispatch = useDispatch<AppDispatch>();
  const applications = useSelector((state: any) => state.jobs.applications);
  const loading = useSelector((state: any) => state.jobs.loading);
  const error = useSelector((state: any) => state.jobs.error);

  const refresh = useCallback(async () => {
    await dispatch(loadApplicationsAsync()).unwrap();
  }, [dispatch]);

  const updateStatus = useCallback((id: string, status: JobStatus) => {
    dispatch(updateApplicationStatus({ id, status }));
  }, [dispatch]);

  const deleteJob = useCallback((id: string) => {
    dispatch(deleteApplication(id));
  }, [dispatch]);

  return { applications, loading, error, refresh, updateStatus, deleteJob };
}
