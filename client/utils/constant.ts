import { JobStatus } from '@/types';

export const STATUS_OPTIONS: JobStatus[] = [
  'Offered',
  'Accepted',
  'Rejected',
  'No Offer',
  'Withdrawn',
  'Ghosted',
  'Declined',
];

export const STATUS_COLORS: Record<JobStatus, string> = {
  Offered: '#10B981',
  Accepted: '#059669',
  Rejected: '#EF4444',
  'No Offer': '#F97316',
  Withdrawn: '#A8A29E',
  Ghosted: '#6B7280',
  Declined: '#B91C1C',
};

export const statusPathMap: Record<string, string[]> = {
  Rejected: ['Applications', 'Rejected'],
  Interviewed: ['Applications', 'Interviews'],
  Ghosted: ['Applications', 'Interviews', 'Ghosted'],
  'No Offer': ['Applications', 'Interviews', 'No Offer'],
  Offered: ['Applications', 'Interviews', 'Offers'],
  Accepted: ['Applications', 'Interviews', 'Offers', 'Accepted'],
  Declined: ['Applications', 'Interviews', 'Offers', 'Declined'],
  'Offer Declined': ['Applications', 'Interviews', 'Offers', 'Declined'],
  Withdrawn: ['Applications', 'Withdrawn'],
};


export const STORAGE_KEY = 'job_applications';
