import { JobStatus } from "@/types";

export const STATUS_OPTIONS: JobStatus[] = [
    'Applied',
    'Ghosted',
    'Rejected',
    'Interviewed',
    'Accepted',
    'Declined'
];

export const STATUS_COLORS: Record<JobStatus, string> = {
    Applied: '#3B82F6',
    Ghosted: '#6B7280',
    Rejected: '#EF4444',
    Interviewed: '#F59E0B',
    Accepted: '#10B981',
    Declined: '#8B5CF6'
};

export const STORAGE_KEY = 'job_applications';