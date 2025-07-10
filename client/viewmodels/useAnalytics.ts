import * as d3 from 'd3';
import { useEffect, useState } from 'react';
import { Dimensions } from 'react-native';

export interface InterviewData {
    status: 'Accepted' | 'Rejected' | 'Interviews' | 'Offers' | 'Declined' | 'No Answer' | 'No Offer';
}

interface SankeyNode {
    name: string;
    id: number;
    x: number;
    y: number;
    width: number;
    height: number;
    fill: string;
    value: number;
}

interface SankeyLink {
    sourceId: number;
    targetId: number;
    path: string;
    stroke: string;
    strokeWidth: number;
    opacity: number;
    value: number;
}

interface StatsType {
    [key: string]: number;
}

export const useAnalyticsViewModel = (interviewData: InterviewData[]) => {
    const [svgNodes, setSvgNodes] = useState<SankeyNode[]>([]);
    const [svgLinks, setSvgLinks] = useState<SankeyLink[]>([]);

    const stats: StatsType = interviewData.reduce((acc, item) => {
        acc[item.status] = (acc[item.status] || 0) + 1;
        return acc;
    }, {} as StatsType);

    const totalApplications = interviewData.length;
    const successRate = totalApplications > 0 ? ((stats['Accepted'] || 0) / totalApplications * 100).toFixed(1) : '0';
    const interviewRate = totalApplications > 0 ? ((stats['Interviews'] || 0) / totalApplications * 100).toFixed(1) : '0';
    const offerRate = (stats['Interviews'] || 0) > 0 ? ((stats['Offers'] || 0) / (stats['Interviews'] || 0) * 100).toFixed(1) : '0';

    const { width: screenWidth } = Dimensions.get('window');
    const svgWidth = screenWidth - 32;
    const svgHeight = 280;

    useEffect(() => {
        const nodes = [
            { name: 'Applications', id: 0 },
            { name: 'Interviews', id: 1 },
            { name: 'Rejected', id: 2 },
            { name: 'No Answer', id: 3 },
            { name: 'Offers', id: 4 },
            { name: 'No Offer', id: 5 },
            { name: 'Accepted', id: 6 },
            { name: 'Declined', id: 7 },
        ];

        const color = d3.scaleOrdinal<string>()
            .domain(nodes.map(d => d.name))
            .range(['#4F46E5', '#10B981', '#EF4444', '#8B5CF6', '#F59E0B', '#06B6D4', '#84CC16', '#F97316']);

        const nodePositions: { [key: number]: { x: number; y: number } } = {
            0: { x: svgWidth * 0.03, y: svgHeight / 2 - 20 },
            1: { x: svgWidth * 0.30, y: svgHeight / 4 - 10 },
            2: { x: svgWidth * 0.30, y: svgHeight / 2 + 10 },
            3: { x: svgWidth * 0.30, y: svgHeight * 3 / 4 + 10 },
            4: { x: svgWidth * 0.60, y: svgHeight / 4 - 10 },
            5: { x: svgWidth * 0.60, y: svgHeight / 2 + 10 },
            6: { x: svgWidth * 0.80, y: svgHeight / 4 - 10 },
            7: { x: svgWidth * 0.80, y: svgHeight / 2 + 10 },
        };

        const processedNodes = nodes.map(node => {
            const pos = nodePositions[node.id];
            const nodeValue = node.id === 0 ? totalApplications : (stats[node.name] || 0);
            const nodeHeight = Math.max(15, (nodeValue / totalApplications) * 40 + 15);
            const nodeWidth = node.id === 0 ? 80 : 60;

            return {
                ...node,
                x: pos.x,
                y: pos.y,
                width: nodeWidth,
                height: nodeHeight,
                fill: color(node.name),
                value: nodeValue,
            };
        });

        const linksData = [
            { sourceId: 0, targetId: 1, value: stats['Interviews'] || 0 },
            { sourceId: 0, targetId: 2, value: stats['Rejected'] || 0 },
            { sourceId: 0, targetId: 3, value: stats['No Answer'] || 0 },
            { sourceId: 1, targetId: 4, value: stats['Offers'] || 0 },
            { sourceId: 1, targetId: 5, value: stats['No Offer'] || 0 },
            { sourceId: 4, targetId: 6, value: stats['Accepted'] || 0 },
            { sourceId: 4, targetId: 7, value: stats['Declined'] || 0 },
        ].filter(link => link.value > 0).map(link => {
            const sourceNode = processedNodes.find(n => n.id === link.sourceId)!;
            const targetNode = processedNodes.find(n => n.id === link.targetId)!;

            const linkWidth = Math.max(1, (link.value / totalApplications) * 20);

            const path = d3.path();
            const midX = (sourceNode.x + sourceNode.width + targetNode.x) / 2;
            const sourceY = sourceNode.y + sourceNode.height / 2;
            const targetY = targetNode.y + targetNode.height / 2;

            path.moveTo(sourceNode.x + sourceNode.width, sourceY);
            path.bezierCurveTo(midX, sourceY, midX, targetY, targetNode.x, targetY);

            return {
                sourceId: link.sourceId,
                targetId: link.targetId,
                path: path.toString(),
                stroke: color(targetNode.name),
                strokeWidth: linkWidth,
                opacity: 0.7,
                value: link.value,
            };
        });

        setSvgNodes(processedNodes);
        setSvgLinks(linksData);
    }, [interviewData]);

    return {
        stats,
        svgNodes,
        svgLinks,
        totalApplications,
        successRate,
        interviewRate,
        offerRate,
        svgWidth,
        svgHeight,
    };
};
