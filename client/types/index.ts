// src/types/index.ts
// Re-checking and refining based on all files

export type JobStatus =
    | 'Applied'
    | 'Interviewed'
    | 'Offered'
    | 'Accepted'
    | 'Rejected'
    | 'No Answer'
    | 'Offer Declined'
    | 'No Offer'
    | 'Withdrawn'
    | 'Ghosted'
    | 'Declined';

export interface StatusHistoryEntry {
    status: JobStatus;
    timestamp: string; // ISO string
}

export interface JobApplication {
    id: string;
    companyName: string;
    position: string;
    status: JobStatus; // Current status of the application
    dateApplied: string; // YYYY-MM-DD string from form
    notes?: string;
    createdAt: string; // ISO string
    updatedAt: string; // ISO string (should always be present after first creation)

    // Interview-related fields - optional for now
    interviewDate?: string; // YYYY-MM-DD
    interviewType?: string;
    interviewRound?: string;

    statusHistory: StatusHistoryEntry[]; // CRITICAL: Track all status changes
}

// Interface for data collected directly from the Add Job modal form
export interface AddJobFormData {
    companyName: string;
    position: string;
    notes?: string;
    dateApplied: Date; // THIS MUST BE 'Date' OBJECT, NOT STRING
    initialStatus: JobStatus; // THIS MUST BE 'initialStatus', NOT 'status'
    // Interview fields (if you want to add them to the initial form as well)
    interviewDate?: Date; // THIS MUST BE 'Date' OBJECT, NOT STRING
    interviewType?: string;
    interviewRound?: string;
}

// Validation errors for the Add Job modal
export interface AddJobFormErrors {
    companyName?: string;
    position?: string;
    dateApplied?: string; // If you need validation on this specifically
    initialStatus?: string; // If you need validation on this specifically
    interviewDate?: string; // If you need validation on this specifically
    general?: string; // For general submission errors
}

// src/types.ts (or wherever you define your global types)

export interface SankeyNode {
    id: string; // Unique identifier for the node (e.g., "Applications", "Interviews")
    name: string; // Display name for the node
    // D3-sankey will add these properties after layout calculation
    x0?: number;
    x1?: number;
    y0?: number;
    y1?: number;
    value?: number; // Total flow through the node
    depth?: number;
    height?: number;
    index?: number;
    fixed?: boolean;
    layer?: number;
}

export interface SankeyLink {
    source: string | number | SankeyNode; // Can be ID (string), index (number), or Node object
    target: string | number | SankeyNode;
    value: number; // The flow amount
    // D3-sankey will add these properties after layout calculation
    index?: number;
    width?: number; // The visual width of the link
    y0?: number; // Start Y position
    y1?: number; // End Y position
}