
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native'; // Import Dimensions
import Svg, { Path, Rect, Text as SvgText } from 'react-native-svg'; // Import Svg components and alias Text as SvgText
import * as d3 from 'd3';

// Type definitions
interface InterviewData {
  company: string;
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

const AnalyticsScreen: React.FC = () => {
  // State to hold the data for SVG rendering
  const [svgNodes, setSvgNodes] = useState<SankeyNode[]>([]);
  const [svgLinks, setSvgLinks] = useState<SankeyLink[]>([]);

  const [interviewData, setInterviewData] = useState<InterviewData[]>([
    { company: 'Google', status: 'Accepted' },
    { company: 'Microsoft', status: 'Rejected' },
    { company: 'Apple', status: 'Interviews' },
    { company: 'Amazon', status: 'Offers' },
    { company: 'Netflix', status: 'Declined' },
    { company: 'Meta', status: 'No Answer' },
    { company: 'Tesla', status: 'No Offer' },
    { company: 'Uber', status: 'Rejected' },
    { company: 'Airbnb', status: 'Interviews' },
    { company: 'Spotify', status: 'Offers' },
    { company: 'Adobe', status: 'Rejected' },
    { company: 'Salesforce', status: 'No Answer' },
    { company: 'Oracle', status: 'Rejected' },
    { company: 'IBM', status: 'Interviews' },
    { company: 'Intel', status: 'Rejected' },
    { company: 'AMD', status: 'No Answer' },
    { company: 'Nvidia', status: 'Rejected' }
  ]);

  useEffect(() => {
    // Get screen width for responsive SVG
    const { width: screenWidth } = Dimensions.get('window');
    const svgWidth: number = screenWidth - 32; // Screen width minus padding
    const svgHeight: number = 280; // Fixed height for the chart

    // Calculate statistics
    const stats: StatsType = interviewData.reduce((acc: StatsType, item: InterviewData) => {
      acc[item.status] = (acc[item.status] || 0) + 1;
      return acc;
    }, {});

    const totalApplications: number = interviewData.length;

    // Create Sankey data structure
    const nodes: SankeyNode[] = [
      { name: 'Applications', id: 0, x: 0, y: 0, width: 0, height: 0, fill: '', value: 0 },
      { name: 'Interviews', id: 1, x: 0, y: 0, width: 0, height: 0, fill: '', value: 0 },
      { name: 'Rejected', id: 2, x: 0, y: 0, width: 0, height: 0, fill: '', value: 0 },
      { name: 'No Answer', id: 3, x: 0, y: 0, width: 0, height: 0, fill: '', value: 0 },
      { name: 'Offers', id: 4, x: 0, y: 0, width: 0, height: 0, fill: '', value: 0 },
      { name: 'No Offer', id: 5, x: 0, y: 0, width: 0, height: 0, fill: '', value: 0 },
      { name: 'Accepted', id: 6, x: 0, y: 0, width: 0, height: 0, fill: '', value: 0 },
      { name: 'Declined', id: 7, x: 0, y: 0, width: 0, height: 0, fill: '', value: 0 }
    ];

    // Mobile-friendly color scale (using hex codes directly for React Native SVG)
    const color = d3.scaleOrdinal<string>()
      .domain(nodes.map((d: SankeyNode) => d.name))
      .range(['#4F46E5', '#10B981', '#EF4444', '#8B5CF6', '#F59E0B', '#06B6D4', '#84CC16', '#F97316']);

    // Compact mobile positioning, scaled to SVG width
    const nodePositions: { [key: number]: { x: number; y: number } } = {
      0: { x: svgWidth * 0.03, y: svgHeight / 2 - 20 },    // Applications
      1: { x: svgWidth * 0.30, y: svgHeight / 4 - 10 },   // Interviews
      2: { x: svgWidth * 0.30, y: svgHeight / 2 + 10 },   // Rejected
      3: { x: svgWidth * 0.30, y: svgHeight * 3 / 4 + 10 }, // No Answer
      4: { x: svgWidth * 0.60, y: svgHeight / 4 - 10 },   // Offers
      5: { x: svgWidth * 0.60, y: svgHeight / 2 + 10 },   // No Offer
      6: { x: svgWidth * 0.80, y: svgHeight / 4 - 10 },   // Accepted
      7: { x: svgWidth * 0.80, y: svgHeight / 2 + 10 }    // Declined
    };

    const processedNodes: SankeyNode[] = nodes.map((node: SankeyNode) => {
      const pos = nodePositions[node.id];
      const nodeValue = node.id === 0 ? totalApplications : (stats[node.name] || 0);
      const nodeHeight: number = Math.max(15, (nodeValue / totalApplications) * 40 + 15);
      const nodeWidth: number = node.id === 0 ? 80 : 60;

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

    const linksData: SankeyLink[] = [
      { sourceId: 0, targetId: 1, value: stats['Interviews'] || 0 },
      { sourceId: 0, targetId: 2, value: stats['Rejected'] || 0 },
      { sourceId: 0, targetId: 3, value: stats['No Answer'] || 0 },
      { sourceId: 1, targetId: 4, value: stats['Offers'] || 0 },
      { sourceId: 1, targetId: 5, value: stats['No Offer'] || 0 },
      { sourceId: 4, targetId: 6, value: stats['Accepted'] || 0 },
      { sourceId: 4, targetId: 7, value: stats['Declined'] || 0 }
    ].filter((link: { value: number }) => link.value > 0).map(link => {
      const sourceNode = processedNodes.find(n => n.id === link.sourceId)!;
      const targetNode = processedNodes.find(n => n.id === link.targetId)!;

      const linkWidth: number = Math.max(1, (link.value / totalApplications) * 20);

      const path = d3.path();
      const midX: number = (sourceNode.x + sourceNode.width + targetNode.x) / 2; // Adjust midX
      const sourceY = sourceNode.y + sourceNode.height / 2; // Center of source node
      const targetY = targetNode.y + targetNode.height / 2; // Center of target node

      path.moveTo(sourceNode.x + sourceNode.width, sourceY);
      path.bezierCurveTo(
        midX, sourceY,
        midX, targetY,
        targetNode.x, targetY
      );

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

  }, [interviewData]); // Re-run effect if interviewData changes

  // Calculate metrics for display outside SVG
  const stats: StatsType = interviewData.reduce((acc: StatsType, item: InterviewData) => {
    acc[item.status] = (acc[item.status] || 0) + 1;
    return acc;
  }, {});

  const totalApplications: number = interviewData.length;
  const successRate: string = totalApplications > 0 ? ((stats['Accepted'] || 0) / totalApplications * 100).toFixed(1) : '0';
  const interviewRate: string = totalApplications > 0 ? ((stats['Interviews'] || 0) / totalApplications * 100).toFixed(1) : '0';
  const offerRate: string = (stats['Interviews'] || 0) > 0 ? ((stats['Offers'] || 0) / (stats['Interviews'] || 0) * 100).toFixed(1) : '0';

  const getStatusColor = (status: string): string => {
    switch (status) {
      case 'Accepted': return '#10B981'; // green-500
      case 'Rejected': return '#EF4444'; // red-500
      case 'Interviews': return '#3B82F6'; // blue-500
      case 'Offers': return '#F59E0B'; // yellow-500
      case 'Declined': return '#F97316'; // orange-500
      case 'No Answer': return '#6B7280'; // gray-500
      case 'No Offer': return '#6B7280'; // gray-500
      default: return '#6B7280'; // gray-500
    }
  };

  const { width: screenWidth } = Dimensions.get('window');
  const svgDisplayWidth = screenWidth - 32; // Match the calculated width in useEffect

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Analytics</Text>
        <Text style={styles.headerSubtitle}>Your interview process overview</Text>
      </View>

      {/* Key Metrics Cards */}
      <View style={styles.metricsContainer}>
        <View style={[styles.metricCard, { borderColor: '#2563EB' }]}>
          <Text style={[styles.metricValue, { color: '#2563EB' }]}>{totalApplications}</Text>
          <Text style={styles.metricLabel}>Total Applications</Text>
        </View>
        <View style={[styles.metricCard, { borderColor: '#10B981' }]}>
          <Text style={[styles.metricValue, { color: '#10B981' }]}>{interviewRate}%</Text>
          <Text style={styles.metricLabel}>Interview Rate</Text>
        </View>
        <View style={[styles.metricCard, { borderColor: '#8B5CF6' }]}>
          <Text style={[styles.metricValue, { color: '#8B5CF6' }]}>{offerRate}%</Text>
          <Text style={styles.metricLabel}>Offer Rate</Text>
        </View>
        <View style={[styles.metricCard, { borderColor: '#F97316' }]}>
          <Text style={[styles.metricValue, { color: '#F97316' }]}>{successRate}%</Text>
          <Text style={styles.metricLabel}>Success Rate</Text>
        </View>
      </View>

      {/* Sankey Diagram */}
      <View style={styles.sankeyContainer}>
        <Text style={styles.sankeyTitle}>Process Flow</Text>
        <View style={styles.sankeyChart}>
          {/* Render Svg component from react-native-svg */}
          <Svg width={svgDisplayWidth} height={280} viewBox={`0 0 ${svgDisplayWidth} 280`}>
            {/* Draw links */}
            {svgLinks.map((link, index) => (
              <Path
                key={`link-${index}`}
                d={link.path}
                stroke={link.stroke}
                strokeWidth={link.strokeWidth}
                fill="none"
                opacity={link.opacity}
              />
            ))}
            {/* Draw nodes */}
            {svgNodes.map((node, index) => (
              <React.Fragment key={`node-${index}`}>
                <Rect
                  x={node.x}
                  y={node.y}
                  width={node.width}
                  height={node.height}
                  fill={node.fill}
                  stroke="#fff"
                  strokeWidth="1"
                  rx="3"
                />
                <SvgText
                  x={node.x + node.width / 2}
                  y={node.y + node.height / 2 - 3}
                  textAnchor="middle"
                  fill="white"
                  fontSize="8"
                  fontWeight="bold"
                >
                  {node.name.length > 8 ? node.name.substring(0, 8) + '...' : node.name}
                </SvgText>
                <SvgText
                  x={node.x + node.width / 2}
                  y={node.y + node.height / 2 + 8}
                  textAnchor="middle"
                  fill="white"
                  fontSize="10"
                  fontWeight="bold"
                >
                  {`${node.value}`}
                </SvgText>
              </React.Fragment>
            ))}
          </Svg>
        </View>
      </View>

      {/* Status Summary */}
      <View style={styles.statusSummaryContainer}>
        <Text style={styles.statusSummaryTitle}>Status Summary</Text>
        <View style={styles.statusList}>
          {Object.entries(stats).map(([status, count]: [string, number]) => (
            <View key={status} style={styles.statusItem}>
              <View style={styles.statusLeft}>
                <View style={[styles.statusColorIndicator, { backgroundColor: getStatusColor(status) }]}></View>
                <Text style={styles.statusText}>{status}</Text>
              </View>
              <View style={styles.statusRight}>
                <Text style={styles.statusCount}>{count}</Text>
                <Text style={styles.statusPercentage}>
                  ({((count / totalApplications) * 100).toFixed(1)}%)
                </Text>
              </View>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F7F7', // Equivalent to bg-gray-50
    padding: 16, // Equivalent to p-4
  },
  header: {
    marginBottom: 24, // Equivalent to mb-6
  },
  headerTitle: {
    fontSize: 24, // Equivalent to text-2xl
    fontWeight: 'bold',
    color: '#333333', // Equivalent to text-gray-800
    marginBottom: 8, // Equivalent to mb-2
  },
  headerSubtitle: {
    fontSize: 14, // Equivalent to text-sm
    color: '#666666', // Equivalent to text-gray-600
  },
  metricsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 24, // Equivalent to mb-6
    gap: 12, // Equivalent to gap-3
  },
  metricCard: {
    backgroundColor: '#FFFFFF', // Equivalent to bg-white
    padding: 16, // Equivalent to p-4
    borderRadius: 8, // Equivalent to rounded-lg
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2, // For Android shadow
    borderWidth: 1,
    borderColor: '#E2E8F0', // Equivalent to border border-gray-200
    width: '48%', // Approx 2 columns with gap
  },
  metricValue: {
    fontSize: 24, // Equivalent to text-2xl
    fontWeight: 'bold',
    // color will be set dynamically
  },
  metricLabel: {
    fontSize: 12, // Equivalent to text-xs
    color: '#666666', // Equivalent to text-gray-600
  },
  sankeyContainer: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 24,
  },
  sankeyTitle: {
    fontSize: 18, // Equivalent to text-lg
    fontWeight: '600', // Equivalent to font-semibold
    marginBottom: 12, // Equivalent to mb-3
    color: '#333333', // Equivalent to text-gray-800
  },
  sankeyChart: {
    alignItems: 'center', // Equivalent to flex justify-center
    // No direct styling for the Svg itself, it takes width/height props
  },
  statusSummaryContainer: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  statusSummaryTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
    color: '#333333',
  },
  statusList: {
    // Equivalent to space-y-3, handled by margin below
  },
  statusItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12, // For space-y-3
  },
  statusLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusColorIndicator: {
    width: 12, // Equivalent to w-3
    height: 12, // Equivalent to h-3
    borderRadius: 6, // Equivalent to rounded-full
    marginRight: 12, // Equivalent to mr-3
  },
  statusText: {
    fontSize: 14, // Equivalent to text-sm
    fontWeight: '500', // Equivalent to font-medium
    color: '#555555', // Equivalent to text-gray-700
  },
  statusRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusCount: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#111111', // Equivalent to text-gray-900
    marginRight: 8, // Equivalent to mr-2
  },
  statusPercentage: {
    fontSize: 12, // Equivalent to text-xs
    color: '#777777', // Equivalent to text-gray-500
  },
});

export default AnalyticsScreen;
