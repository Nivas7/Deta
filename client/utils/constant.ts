import { JobStatus } from '@/types';

export const STATUS_OPTIONS: JobStatus[] = [
  'Interviewed',
  'Offered',
  'Accepted',
  'Rejected',
  'No Offer',
  'Withdrawn',
  'Ghosted',
  'Declined',
];

export const STATUS_COLORS: Record<JobStatus, string> = {
  Interviewed: '#F59E0B',
  Offered: '#10B981',
  Accepted: '#059669',
  Rejected: '#EF4444',
  'No Offer': '#F97316',
  Withdrawn: '#A8A29E',
  Ghosted: '#6B7280',
  Declined: '#B91C1C',
};

export const STORAGE_KEY = 'job_applications';
