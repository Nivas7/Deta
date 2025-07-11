// This data can be placed in a file like src/utils/dummyData.ts
// or directly within a test/storybook file.

import { JobApplication } from '@/types'; // Assuming JobApplication and JobStatus are defined here

// Helper function to generate a past date string
const getPastDate = (daysAgo: number): string => {
    const date = new Date();
    date.setDate(date.getDate() - daysAgo);
    return date.toISOString().split('T')[0];
};

// Helper function to generate a past timestamp string
const getPastTimestamp = (daysAgo: number, hoursAgo: number = 0): string => {
    const date = new Date();
    date.setDate(date.getDate() - daysAgo);
    date.setHours(date.getHours() - hoursAgo);
    return date.toISOString();
};


export const dummyApplications: JobApplication[] = [
    // --- Applications -> Interviews: 4 ---
    {
        id: 'app-int-1',
        companyName: 'Tech Innovators Inc.',
        position: 'Software Engineer',
        dateApplied: getPastDate(30),
        status: 'Interviewed',
        notes: 'First round completed.',
        statusHistory: [
            { status: 'Applied', timestamp: getPastTimestamp(30) },
            { status: 'Interviewed', timestamp: getPastTimestamp(25) },
        ],
        createdAt: getPastTimestamp(30),
        updatedAt: getPastTimestamp(25),
    },
    {
        id: 'app-int-2',
        companyName: 'Data Solutions LLC',
        position: 'Data Analyst',
        dateApplied: getPastDate(28),
        status: 'Interviewed',
        notes: 'Technical interview next week.',
        statusHistory: [
            { status: 'Applied', timestamp: getPastTimestamp(28) },
            { status: 'Interviewed', timestamp: getPastTimestamp(20) },
        ],
        createdAt: getPastTimestamp(28),
        updatedAt: getPastTimestamp(20),
    },
    {
        id: 'app-int-3',
        companyName: 'Global Corp',
        position: 'Product Manager',
        dateApplied: getPastDate(35),
        status: 'Interviewed',
        notes: 'Hiring manager call scheduled.',
        statusHistory: [
            { status: 'Applied', timestamp: getPastTimestamp(35) },
            { status: 'Interviewed', timestamp: getPastTimestamp(30) },
        ],
        createdAt: getPastTimestamp(35),
        updatedAt: getPastTimestamp(30),
    },
    {
        id: 'app-int-4',
        companyName: 'Startup X',
        position: 'UI/UX Designer',
        dateApplied: getPastDate(22),
        status: 'Interviewed',
        notes: 'Portfolio review passed.',
        statusHistory: [
            { status: 'Applied', timestamp: getPastTimestamp(22) },
            { status: 'Interviewed', timestamp: getPastTimestamp(15) },
        ],
        createdAt: getPastTimestamp(22),
        updatedAt: getPastTimestamp(15),
    },

    // --- Applications -> Rejected: 9 ---
    {
        id: 'app-rej-1',
        companyName: 'Big Company A',
        position: 'Marketing Specialist',
        dateApplied: getPastDate(40),
        status: 'Rejected',
        notes: 'Received automated rejection email.',
        statusHistory: [
            { status: 'Applied', timestamp: getPastTimestamp(40) },
            { status: 'Rejected', timestamp: getPastTimestamp(35) },
        ],
        createdAt: getPastTimestamp(40),
        updatedAt: getPastTimestamp(35),
    },
    {
        id: 'app-rej-2',
        companyName: 'Small Biz B',
        position: 'Content Creator',
        dateApplied: getPastDate(38),
        status: 'Rejected',
        notes: 'Not a good fit.',
        statusHistory: [
            { status: 'Applied', timestamp: getPastTimestamp(38) },
            { status: 'Rejected', timestamp: getPastTimestamp(30) },
        ],
        createdAt: getPastTimestamp(38),
        updatedAt: getPastTimestamp(30),
    },
    {
        id: 'app-rej-5',
        companyName: 'Digital Agency',
        position: 'SEO Specialist',
        dateApplied: getPastDate(25),
        status: 'Rejected',
        notes: '',
        statusHistory: [
            { status: 'Applied', timestamp: getPastTimestamp(25) },
            { status: 'Rejected', timestamp: getPastTimestamp(18) },
        ],
        createdAt: getPastTimestamp(25),
        updatedAt: getPastTimestamp(18),
    },
    {
        id: 'app-rej-6',
        companyName: 'HealthTech Group',
        position: 'Compliance Officer',
        dateApplied: getPastDate(30),
        status: 'Rejected',
        notes: '',
        statusHistory: [
            { status: 'Applied', timestamp: getPastTimestamp(30) },
            { status: 'Rejected', timestamp: getPastTimestamp(22) },
        ],
        createdAt: getPastTimestamp(30),
        updatedAt: getPastTimestamp(22),
    },
    {
        id: 'app-rej-7',
        companyName: 'EduTech LLC',
        position: 'Curriculum Developer',
        dateApplied: getPastDate(15),
        status: 'Rejected',
        notes: '',
        statusHistory: [
            { status: 'Applied', timestamp: getPastTimestamp(15) },
            { status: 'Rejected', timestamp: getPastTimestamp(8) },
        ],
        createdAt: getPastTimestamp(15),
        updatedAt: getPastTimestamp(8),
    },
    {
        id: 'app-rej-8',
        companyName: 'FinServe Co.',
        position: 'Risk Analyst',
        dateApplied: getPastDate(18),
        status: 'Rejected',
        notes: '',
        statusHistory: [
            { status: 'Applied', timestamp: getPastTimestamp(18) },
            { status: 'Rejected', timestamp: getPastTimestamp(12) },
        ],
        createdAt: getPastTimestamp(18),
        updatedAt: getPastTimestamp(12),
    },
    {
        id: 'app-rej-9',
        companyName: 'Retail Giant',
        position: 'Store Manager',
        dateApplied: getPastDate(23),
        status: 'Rejected',
        notes: '',
        statusHistory: [
            { status: 'Applied', timestamp: getPastTimestamp(23) },
            { status: 'Rejected', timestamp: getPastTimestamp(16) },
        ],
        createdAt: getPastTimestamp(23),
        updatedAt: getPastTimestamp(16),
    },

    // --- Applications -> No Answer: 4 ---
    {
        id: 'app-noans-1',
        companyName: 'Stealth Startup',
        position: 'Blockchain Dev',
        dateApplied: getPastDate(60),
        status: 'No Answer',
        notes: 'No response after 2 months.',
        statusHistory: [
            { status: 'Applied', timestamp: getPastTimestamp(60) },
            { status: 'No Answer', timestamp: getPastTimestamp(30) }, // Mark as 'No Answer' after some time
        ],
        createdAt: getPastTimestamp(60),
        updatedAt: getPastTimestamp(30),
    },
    {
        id: 'app-noans-2',
        companyName: 'Quiet Co.',
        position: 'Research Scientist',
        dateApplied: getPastDate(55),
        status: 'No Answer',
        notes: 'Still waiting for an update.',
        statusHistory: [
            { status: 'Applied', timestamp: getPastTimestamp(55) },
            { status: 'No Answer', timestamp: getPastTimestamp(25) },
        ],
        createdAt: getPastTimestamp(55),
        updatedAt: getPastTimestamp(25),
    },
    {
        id: 'app-noans-3',
        companyName: 'Mystery Inc.',
        position: 'Forensic Accountant',
        dateApplied: getPastDate(48),
        status: 'No Answer',
        notes: '',
        statusHistory: [
            { status: 'Applied', timestamp: getPastTimestamp(48) },
            { status: 'No Answer', timestamp: getPastTimestamp(15) },
        ],
        createdAt: getPastTimestamp(48),
        updatedAt: getPastTimestamp(15),
    },
    {
        id: 'app-noans-4',
        companyName: 'Ghostly Ventures',
        position: 'IT Support',
        dateApplied: getPastDate(33),
        status: 'No Answer',
        notes: '',
        statusHistory: [
            { status: 'Applied', timestamp: getPastTimestamp(33) },
            { status: 'No Answer', timestamp: getPastTimestamp(10) },
        ],
        createdAt: getPastTimestamp(33),
        updatedAt: getPastTimestamp(10),
    },

    // --- Interviews -> Offers: 2 ---
    {
        id: 'int-off-1',
        companyName: 'Success Co.',
        position: 'Senior Developer',
        dateApplied: getPastDate(20),
        status: 'Offered',
        notes: 'Offer received, reviewing terms.',
        statusHistory: [
            { status: 'Applied', timestamp: getPastTimestamp(20) },
            { status: 'Interviewed', timestamp: getPastTimestamp(15) },
            { status: 'Offered', timestamp: getPastTimestamp(5) },
        ],
        createdAt: getPastTimestamp(20),
        updatedAt: getPastTimestamp(5),
    },
    {
        id: 'int-off-2',
        companyName: 'Dream Job Inc.',
        position: 'Team Lead',
        dateApplied: getPastDate(25),
        status: 'Offered',
        notes: 'Negotiating salary.',
        statusHistory: [
            { status: 'Applied', timestamp: getPastTimestamp(25) },
            { status: 'Interviewed', timestamp: getPastTimestamp(18) },
            { status: 'Offered', timestamp: getPastTimestamp(7) },
        ],
        createdAt: getPastTimestamp(25),
        updatedAt: getPastTimestamp(7),
    },

    // --- Interviews -> No Offer: 2 ---
    {
        id: 'int-nooff-1',
        companyName: 'Tough Interviewers',
        position: 'Data Scientist',
        dateApplied: getPastDate(22),
        status: 'No Offer',
        notes: 'Recruiter said I was a close second.',
        statusHistory: [
            { status: 'Applied', timestamp: getPastTimestamp(22) },
            { status: 'Interviewed', timestamp: getPastTimestamp(17) },
            { status: 'No Offer', timestamp: getPastTimestamp(10) },
        ],
        createdAt: getPastTimestamp(22),
        updatedAt: getPastTimestamp(10),
    },
    {
        id: 'int-nooff-2',
        companyName: 'Challenging Role',
        position: 'DevOps Engineer',
        dateApplied: getPastDate(19),
        status: 'No Offer',
        notes: 'Feedback indicated lack of specific experience.',
        statusHistory: [
            { status: 'Applied', timestamp: getPastTimestamp(19) },
            { status: 'Interviewed', timestamp: getPastTimestamp(14) },
            { status: 'No Offer', timestamp: getPastTimestamp(8) },
        ],
        createdAt: getPastTimestamp(19),
        updatedAt: getPastTimestamp(8),
    },

    // --- Offers -> Accepted: 1 ---
    {
        id: 'off-acc-1',
        companyName: 'My New Employer',
        position: 'Frontend Developer',
        dateApplied: getPastDate(30),
        status: 'Accepted',
        notes: 'Signed and started!',
        statusHistory: [
            { status: 'Applied', timestamp: getPastTimestamp(30) },
            { status: 'Interviewed', timestamp: getPastTimestamp(20) },
            { status: 'Offered', timestamp: getPastTimestamp(10) },
            { status: 'Accepted', timestamp: getPastTimestamp(5) },
        ],
        createdAt: getPastTimestamp(30),
        updatedAt: getPastTimestamp(5),
    },

    // --- Offers -> Declined: 1 ---
    {
        id: 'off-dec-1',
        companyName: 'Backup Offer Co.',
        position: 'Backend Developer',
        dateApplied: getPastDate(28),
        status: 'Declined',
        notes: 'Declined in favor of another offer.',
        statusHistory: [
            { status: 'Applied', timestamp: getPastTimestamp(28) },
            { status: 'Interviewed', timestamp: getPastTimestamp(18) },
            { status: 'Offered', timestamp: getPastTimestamp(8) },
            { status: 'Declined', timestamp: getPastTimestamp(3) },
        ],
        createdAt: getPastTimestamp(28),
        updatedAt: getPastTimestamp(3),
    },
];