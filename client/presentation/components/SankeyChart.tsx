import React, { useEffect, useState } from 'react';
import Svg, { G, Path, Rect, Text as SvgText } from 'react-native-svg';
import { sankey, sankeyLinkHorizontal, SankeyGraph } from 'd3-sankey';
import { View, useWindowDimensions } from 'react-native';
import * as d3Scale from 'd3-scale';
import * as d3ScaleChromatic from 'd3-scale-chromatic';
import type { SankeyNode, SankeyLink, SankeyChartProps } from '@/types';

const SankeyChart: React.FC<SankeyChartProps> = ({ nodes, links }) => {
  const { width: screenWidth } = useWindowDimensions();
  const containerPadding = 5;
  const chartPadding = 5;
  const internalPadding = 2;
  const width = screenWidth - 2 * (containerPadding + chartPadding) - 2 * internalPadding;
  const height = Math.max(400, nodes.length * 50);

  const [graph, setGraph] = useState<SankeyGraph<SankeyNode, SankeyLink> | null>(null);

  useEffect(() => {
    if (!nodes.length || !links.length) return;

    const sankeyGenerator = sankey<SankeyNode, SankeyLink>()
      .nodeWidth(20)
      .nodePadding(40)
      .extent([[internalPadding, internalPadding], [width - internalPadding, height - internalPadding]]);


    const sankeyData = {
      nodes: nodes.map((d) => ({ ...d })),
      links: links.map((d) => ({ ...d })),
    };

    try {
      const computedGraph = sankeyGenerator(sankeyData);
      setGraph(computedGraph);
    } catch (error) {
      console.error('Error generating sankey graph:', error);
    }
  }, [nodes, links, width, height]);

  const color = d3Scale.scaleOrdinal(d3ScaleChromatic.schemeCategory10);

  if (!graph) {
    return (
      <View style={{ padding: chartPadding }}>
        <SvgText x={0} y={20} fontSize={12} fill="#333">
          No data available
        </SvgText>
      </View>
    );
  }

  return (
    <View style={{ padding: chartPadding, alignItems: 'center' }}>
      <Svg width={width} height={height}>
        <G>
          {graph.links.map((link: SankeyLink, i: number) => (
            <Path
              key={`link-${i}`}
              d={sankeyLinkHorizontal()(link) || ''}
              stroke={
                color(
                  typeof link.source === 'object' && link.source !== null
                    ? link.source.name
                    : String(link.source)
                ) as string
              }
              strokeWidth={Math.max(1, link.width || 1)}
              strokeOpacity={0.4}
              fill="none"
            />
          ))}
        </G>

        <G>
          {graph.nodes.map((node: SankeyNode, i: number) => {
            const isLeftSide = (node.x0 ?? 0) < width / 2;
            const labelX = isLeftSide
              ? (node.x1 ?? 0) + 6
              : Math.max(0, (node.x0 ?? 0) - 6 - 100); // Cap to prevent overflow

            const labelY = ((node.y0 ?? 0) + (node.y1 ?? 0)) / 2 + (i % 2 === 0 ? -10 : 10);
            return (
              <G key={`node-${i}`}>
                <Rect
                  x={node.x0 ?? 0}
                  y={node.y0 ?? 0}
                  width={((node.x1 ?? 0) - (node.x0 ?? 0)) || 1}
                  height={((node.y1 ?? 0) - (node.y0 ?? 0)) || 1}
                  fill={color(node.name) as string}
                  stroke="#000"
                />
                <SvgText
                  x={labelX}
                  y={labelY}
                  fontSize={12}
                  fill="#333"
                  textAnchor={isLeftSide ? 'start' : 'end'}
                  alignmentBaseline="middle"
                >
                  {`${node.name} (${Math.round(node.value ?? 0)})`}
                </SvgText>
              </G>
            );
          })}
        </G>
      </Svg>
    </View>
  );
};

export default SankeyChart;
