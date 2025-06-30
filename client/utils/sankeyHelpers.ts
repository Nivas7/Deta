import { JobApplication, SankeyData, JobStatus } from '../types';

export const generateSankeyData = (applications: JobApplication[]): SankeyData => {
    const statusCounts: Record<string, number> = {};

    applications.forEach(app => {
        statusCounts[app.status] = (statusCounts[app.status] || 0) + 1;
    });

    const nodes = Object.keys(statusCounts).map(status => ({
        name: status,
        value: statusCounts[status]
    }));

    const links: any[] = [];
    const appliedIndex = nodes.findIndex(n => n.name === 'Applied');

    if (appliedIndex !== -1) {
        nodes.forEach((node, index) => {
            if (node.name !== 'Applied' && index !== appliedIndex) {
                links.push({
                    source: appliedIndex,
                    target: index,
                    value: Math.floor(node.value * 0.8) // Simulate flow from Applied
                });
            }
        });
    }

    return { nodes, links };
};