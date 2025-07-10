// src/types.ts

export interface StatusChange {
    status: string; // The status string at that point in time
    timestamp: string; // ISO string for when the status changed
}

// Define the union type for all possible job statuses
export type JobStatus =
    "Applied" | "Interviewed" | "Offered" | "Accepted" | "Rejected" |
    "Offer Declined" | "No Offer" | "Withdrawn" | "Ghosted" | "No Answer" | "Declined"; // Added 'Declined' as per your error

export interface JobApplication {
    id: string;
    companyName: string; // Changed from 'company' to 'companyName' as used in JobCard
    position: string;
    status: JobStatus; // Use the defined JobStatus type
    dateApplied: string; // Changed from 'applicationDate' to 'dateApplied' as used in JobCard
    notes?: string;
    createdAt: string; // ISO string for when the application was created
    updatedAt: string; // ISO string for when the application was last updated
    // Optional: Add statusHistory for more accurate Sankey diagrams
    statusHistory?: StatusChange[];
}

export interface Node {
    name: string;
}



export interface SankeyNode {
    name: string;
    value: number;
    x0?: number;
    x1?: number;
    y0?: number;
    y1?: number;
}

export interface SankeyLink {
    source: number | SankeyNode;
    target: number | SankeyNode;
    value: number;
    y0?: number;
    y1?: number;
}

export interface SankeyData {
    nodes: SankeyNode[];
    links: SankeyLink[];
}

export type TabType = 'Home' | 'History' | 'Analytics';
export type HomePageType = 'getting-started' | 'add-job';

// constants/index.ts

