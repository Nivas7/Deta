import { SankeyLink, sankey as d3Sankey, sankeyLinkHorizontal, SankeyNode } from 'd3-sankey';
import React, { useEffect, useState } from 'react';
import { Alert, Dimensions, TouchableOpacity, View } from 'react-native';
import Svg, { G, Path, Rect, Text as SvgText } from 'react-native-svg';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const STATUS_COLORS: { [key: string]: string } = {
    Applied: '#A1CEDC',
    Screening: '#F8B195',
    Interview: '#C06C84',
    Offer: '#355C7D',
    Accepted: '#83AF9B',
    Rejected: '#F67280',
    Ghosted: '#6C5B7B',
    Unknown: '#999',
};

interface SankeyNodeExtra {
    name: string;
    value: number;
    color: string;
}

interface SankeyLinkExtra {
    value: number;
}

type SankeyNodeData = SankeyNode<SankeyNodeExtra, SankeyLinkExtra>;
type SankeyLinkData = SankeyLink<SankeyNodeExtra, SankeyLinkExtra>;

export interface SankeyDiagramProps {
    data: { [status: string]: number };
    transitions: { source: string; target: string; value: number }[];
}

export default function SankeyDiagram({ data, transitions }: SankeyDiagramProps) {
    const [nodes, setNodes] = useState<SankeyNodeData[]>([]);
    const [links, setLinks] = useState<SankeyLinkData[]>([]);
    const [height, setHeight] = useState(300);

    const truncateText = (text: string, maxLength: number): string =>
        text.length > maxLength ? `${text.slice(0, maxLength)}...` : text;

    useEffect(() => {
        // Prepare nodes
        const nodeData: SankeyNodeData[] = [];
        Object.keys(data).forEach((status) => {
            if (data[status] > 0) {
                nodeData.push({
                    name: status,
                    value: data[status],
                    color: STATUS_COLORS[status] || STATUS_COLORS.Unknown,
                } as SankeyNodeData);
            }
        });

        // Early return for empty data
        if (nodeData.length === 0) {
            setNodes([]);
            setLinks([]);
            setHeight(280);
            return;
        }

        // Create links
        const linkData: SankeyLinkData[] = [];
        transitions.forEach(({ source, target, value }) => {
            const sourceIndex = nodeData.findIndex((n) => n.name === source);
            const targetIndex = nodeData.findIndex((n) => n.name === target);
            if (sourceIndex !== -1 && targetIndex !== -1 && value > 0) {
                linkData.push({
                    source: sourceIndex,
                    target: targetIndex,
                    value,
                } as SankeyLinkData);
            }
        });

        // Fallback: Link consecutive statuses if no transitions provided
        if (linkData.length === 0 && nodeData.length > 1) {
            for (let i = 0; i < nodeData.length - 1; i++) {
                linkData.push({
                    source: i,
                    target: i + 1,
                    value: Math.min(nodeData[i].value, nodeData[i + 1].value),
                } as SankeyLinkData);
            }
        }

        // Dynamic height
        const dynHeight = Math.max(280, Math.min(nodeData.length * 60, 600));

        // --- FIX: Implement sankeyGen using d3-sankey ---
        const sankeyGen = d3Sankey<SankeyNodeExtra, SankeyLinkExtra>()
            .nodeWidth(24)
            .nodePadding(32)
            .extent([[0, 0], [SCREEN_WIDTH - 60, dynHeight]]);

        const { nodes: sankeyNodes, links: sankeyLinks } = sankeyGen({
            nodes: nodeData.map((d) => ({ ...d })),
            links: linkData.map((d) => ({ ...d })),
        });

        setNodes(sankeyNodes as SankeyNodeData[]);
        setLinks(sankeyLinks as SankeyLinkData[]);
        setHeight(dynHeight);
    }, [data, transitions]);

    if (nodes.length === 0) {
        return (
            <View style={{ alignItems: 'center' }}>
                <Svg width={SCREEN_WIDTH - 60} height={280}>
                    <SvgText
                        x={(SCREEN_WIDTH - 60) / 2}
                        y={140}
                        textAnchor="middle"
                        fill="#1D3D47"
                        fontSize={16}
                    >
                        No data to display
                    </SvgText>
                </Svg>
            </View>
        );
    }

    return (
        <View style={{ alignItems: 'center' }}>
            <Svg width={SCREEN_WIDTH - 60} height={height}>
                {/* Render links */}
                {links.map((link, i) => {
                    const path = sankeyLinkHorizontal<SankeyNodeExtra, SankeyLinkExtra>()(link) || '';
                    const sourceNode = link.source as SankeyNodeData;
                    return (
                        <Path
                            key={`link-${i}`}
                            d={path}
                            stroke={sourceNode.color || STATUS_COLORS.Unknown}
                            strokeWidth={Math.max(1, (link.width || 1) * 1.5)}
                            fill="none"
                            opacity={0.4}
                        />
                    );
                })}
                {/* Render nodes */}
                {nodes.map((node, i) => {
                    // Ensure node coordinates are defined
                    if (node.x0 === undefined || node.y0 === undefined || node.x1 === undefined || node.y1 === undefined) {
                        return null;
                    }
                    return (
                        <G key={`node-${i}`}>
                            <TouchableOpacity
                                onPress={() => Alert.alert(node.name, `Applications: ${node.value}`)}
                                style={{ position: 'absolute', left: node.x0, top: node.y0, width: node.x1 - node.x0, height: node.y1 - node.y0 }}
                            >
                                <Rect
                                    x={node.x0}
                                    y={node.y0}
                                    width={node.x1 - node.x0}
                                    height={node.y1 - node.y0}
                                    rx={6}
                                    fill={node.color}
                                />
                            </TouchableOpacity>
                            <SvgText
                                x={node.x0 - 10}
                                y={(node.y0 + node.y1) / 2 + 5}
                                textAnchor="end"
                                fill="#1D3D47"
                                fontSize={Math.min(13, SCREEN_WIDTH / 30)}
                                fontWeight="bold"
                            >
                                {truncateText(node.name, 10)}
                            </SvgText>
                            <SvgText
                                x={node.x1 + 10}
                                y={(node.y0 + node.y1) / 2 + 5}
                                textAnchor="start"
                                fill="#1D3D47"
                                fontSize={Math.min(12, SCREEN_WIDTH / 30)}
                            >
                                {node.value}
                            </SvgText>
                        </G>
                    );
                })}
            </Svg>
        </View>
    );
}
