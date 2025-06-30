export interface JobApplication {
    id: string;
    companyName: string;
    position: string;
    status: JobStatus;
    dateApplied: string;
    notes?: string;
    createdAt: string;
    updatedAt?: string;
}

export type JobStatus =
    | 'Applied'
    | 'Ghosted'
    | 'Rejected'
    | 'Interviewed'
    | 'Accepted'
    | 'Declined';

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

