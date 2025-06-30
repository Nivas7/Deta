import React from 'react';
import { View, Text, Dimensions } from 'react-native';
import Svg, { Path, Rect, Text as SvgText } from 'react-native-svg';
import { JobApplication } from '../../types';
import { generateSankeyData } from '../../utils/sankeyHelpers';
import { STATUS_COLORS } from '../../constants';
import { globalStyles } from '../../styles';

interface SankeyDiagramProps {
    applications: JobApplication[];
}

const { width: screenWidth } = Dimensions.get('window');

export const SankeyDiagram: React.FC<SankeyDiagramProps> = ({ applications }) => {
    const data = generateSankeyData(applications);
    const width = screenWidth - 40;
    const height = 300;

    if (data.nodes.length === 0) {
        return (
            <View style={globalStyles.emptyState}>
                <Text style={globalStyles.emptyStateText}>No data available</Text>
                <Text style={globalStyles.emptyStateSubtext}>
                    Add some job applications to see the flow diagram
                </Text>
            </View>
        );
    }

    // Simple layout calculation for nodes
    const nodeWidth = 20;
    const nodeHeight = height / data.nodes.length - 20;

    return (
        <View style={{ alignItems: 'center', marginVertical: 20 }}>
            <Text style={[globalStyles.header, { textAlign: 'center', marginBottom: 20 }]}>
                Application Flow
            </Text>
            <Svg width={width} height={height}>
                {data.nodes.map((node, index) => {
                    const x = index === 0 ? 50 : width - 100;
                    const y = index * (height / data.nodes.length) + 10;

                    return (
                        <React.Fragment key={`node-${index}`}>
                            <Rect
                                x={x}
                                y={y}
                                width={nodeWidth}
                                height={nodeHeight}
                                fill={STATUS_COLORS[node.name as keyof typeof STATUS_COLORS] || '#6B7280'}
                                rx={4}
                            />
                            <SvgText
                                x={x + nodeWidth + 10}
                                y={y + nodeHeight / 2}
                                fontSize="12"
                                fill="#374151"
                                textAnchor="start"
                                alignmentBaseline="middle"
                            >
                                {node.name} ({node.value})
                            </SvgText>
                        </React.Fragment>
                    );
                })}

                {data.links.map((link, index) => {
                    const sourceY = typeof link.source === 'number'
                        ? link.source * (height / data.nodes.length) + nodeHeight / 2 + 10
                        : 0;
                    const targetY = typeof link.target === 'number'
                        ? link.target * (height / data.nodes.length) + nodeHeight / 2 + 10
                        : 0;

                    const sourceName = typeof link.source === 'number'
                        ? data.nodes[link.source].name
                        : (link.source as any).name;

                    return (
                        <Path
                            key={`link-${index}`}
                            d={`M 70 ${sourceY} Q ${width / 2} ${sourceY} ${width - 100} ${targetY}`}
                            stroke={STATUS_COLORS[sourceName as keyof typeof STATUS_COLORS] || '#6B7280'}
                            strokeWidth={Math.max(2, link.value * 2)}
                            fill="none"
                            opacity={0.6}
                        />
                    );
                })}
            </Svg>
        </View>
    );
};
