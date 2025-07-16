import type { SankeyNodeMinimal, SankeyLinkMinimal } from 'd3-sankey';

export type JobStatus =
  | 'Offered'
  | 'Accepted'
  | 'Rejected'
  | 'No Offer'
  | 'Withdrawn'
  | 'Ghosted'
  | 'Declined';

export interface StatusHistoryEntry {
  status: JobStatus;
  timestamp: string;
}


export type Totals = {
  total: number;
} & Partial<Record<JobStatus, number>>;


export interface JobApplication {
  id: string;
  companyName: string;
  position: string;
  status: JobStatus;
  dateApplied: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;

  interviewDate?: string;
  interviewType?: string;
  interviewRound?: string;

  statusHistory: StatusHistoryEntry[];
}
export interface SankeyChartProps {
  nodes: SankeyNode[];
  links: SankeyLink[];
}

export interface JobState {
  applications: JobApplication[];
  loading: boolean;
  error: string | null;
}

export interface AddJobFormData {
  companyName: string;
  position: string;
  notes?: string;
  dateApplied: Date;
  initialStatus: JobStatus;
  interviewDate?: Date;
  interviewType?: string;
  interviewRound?: string;
}

export interface AddJobFormErrors {
  companyName?: string;
  position?: string;
  dateApplied?: string;
  initialStatus?: string;
  interviewDate?: string;
  general?: string;
}


export interface SankeyNode extends SankeyNodeMinimal<SankeyNode, SankeyLink> {
  id: string;
  name: string;
}

export interface SankeyLink extends SankeyLinkMinimal<SankeyNode, SankeyLink> {
  source: string | number | SankeyNode;
  target: string | number | SankeyNode;
  value: number;
}
