// filepath: /home/nivaz/Code/Deta/client/app/domain/job.ts
export type JobStatus = 'Applied' | 'Ghosted' | 'Rejected' | 'Interviewed' | 'Accepted' | 'Declined';

export interface JobApplication {
    id?: string;
    companyName: string;
    position: string;
    status: JobStatus;
    dateApplied: string;
    notes?: string;
    createdAt?: string;
    updatedAt?: string;
}