import { JobStatus } from "@/types";

export const STATUS_OPTIONS: JobStatus[] = [
    "Applied",
    "Interviewed",
    "Offered",
    "Accepted",
    "Rejected",
    "Offer Declined",
    "No Offer",
    "Withdrawn",
    "Ghosted",
    "No Answer",
    "Declined", // Make sure this is consistent with your types
];

export const STATUS_COLORS: Record<JobStatus, string> = {
    "Applied": "#3B82F6",       // Blue
    "Interviewed": "#F59E0B",   // Amber
    "Offered": "#10B981",       // Green
    "Accepted": "#059669",      // Dark Green
    "Rejected": "#EF4444",      // Red
    "Offer Declined": "#DC2626", // Dark Red
    "No Offer": "#F97316",      // Orange
    "Withdrawn": "#A8A29E",     // Stone
    "Ghosted": "#6B7280",       // Gray
    "No Answer": "#9CA3AF",     // Light Gray
    "Declined": "#B91C1C",      // Burgundy
};



export const STORAGE_KEY = 'job_applications';