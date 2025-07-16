import React, { useMemo, useRef } from 'react';
import { StyleSheet } from 'react-native';
import { WebView } from 'react-native-webview';

import { SankeyLink, SankeyNode } from '@/types';

interface SankeyChartWebViewProps {
  nodes: SankeyNode[];
  links: SankeyLink[];
}

const SankeyChartWebView: React.FC<SankeyChartWebViewProps> = ({
  nodes,
  links,
}) => {
  const webViewRef = useRef<WebView>(null);

  const htmlContent = useMemo(() => {
    const initialNodesJson = JSON.stringify(nodes);
    const initialLinksJson = JSON.stringify(links);

    return `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Job Application Sankey Diagram</title>
        <script src="https://d3js.org/d3.v7.min.js"></script>
        <script src="https://cdn.jsdelivr.net/npm/d3-sankey@0.12.3/dist/d3-sankey.min.js"></script>
        <style>
          body {
            margin: 0;
            font-family: sans-serif;
            background: #f9f9f9;
          }
          #sankey-container {
            width: 100vw;
            height: 100vh;
            overflow: auto; /* 👈 enable scroll if too big */
            display: flex;
            justify-content: center;
            align-items: flex-start;
          }
          svg {
            background: #ffffff;
            border-radius: 8px;
          }
          .node rect {
            stroke: #333;
          }
          .node text {
            font-size: 12px;
            fill: #333;
          }
          .link {
            fill: none;
            stroke-opacity: 0.5;
          }
        </style>
      </head>
      <body>
        <div id="sankey-container">
          <svg id="sankey-chart"></svg>
        </div>

        <script>
          const initialNodes = ${initialNodesJson};
          const initialLinks = ${initialLinksJson};

          const svg = d3.select("#sankey-chart");

          function drawSankey({nodes, links}) {
            svg.selectAll("*").remove();

            const container = d3.select("#sankey-container");
            const width = Math.min(800, container.node().getBoundingClientRect().width);
            const height = Math.min(800, nodes.length * 80); // Dynamic height

            svg
              .attr("width", width)
              .attr("height", height)
              .attr("viewBox", [0, 0, width, height]);

            const sankeyGen = d3.sankey()
              .nodeWidth(Math.max(15, width / 50))
              .nodePadding(30) // More spacing to prevent overlap
              .extent([[0, 5], [width - 5, height - 5]]);

            const graph = sankeyGen({
              nodes: nodes.map(d => Object.assign({}, d)),
              links: links.map(d => Object.assign({}, d))
            });

            const color = d3.scaleOrdinal(d3.schemeCategory10);

            svg.append("g")
              .attr("class", "links")
              .selectAll("path")
              .data(graph.links)
              .join("path")
              .attr("class", "link")
              .attr("d", d3.sankeyLinkHorizontal())
              .attr("stroke", d => color(d.source.name || d.source.id))
              .attr("stroke-width", d => Math.max(2, d.width))
              .sort((a, b) => b.width - a.width);

            const node = svg.append("g")
              .attr("class", "nodes")
              .selectAll("g")
              .data(graph.nodes)
              .join("g")
              .attr("class", "node")
              .attr("transform", d => \`translate(\${d.x0}, \${d.y0})\`);

            node.append("rect")
              .attr("height", d => Math.max(10, d.y1 - d.y0)) // Enforce min height
              .attr("width", sankeyGen.nodeWidth())
              .attr("fill", d => color(d.name || d.id))
              .attr("rx", 4).attr("ry", 4);

            node.append("text")
              .attr("x", d => d.x0 < width / 2 ? sankeyGen.nodeWidth() + 6 : -6)
              .attr("y", d => (d.y1 - d.y0) / 2)
              .attr("dy", "0.35em")
              .attr("text-anchor", d => d.x0 < width / 2 ? "start" : "end")
              .text(d => \`\${d.name} (\${d.value})\`);

          }

          drawSankey({nodes: initialNodes, links: initialLinks});

          window.updateChart = (newNodes, newLinks) => {
            drawSankey({ nodes: newNodes, links: newLinks });
          };
        </script>
      </body>
      </html>
    `;
  }, [nodes, links]);

  return (
    <WebView
      ref={webViewRef}
      originWhitelist={['*']}
      source={{ html: htmlContent }}
      style={styles.webView}
      javaScriptEnabled
      domStorageEnabled
      allowFileAccess
    />
  );
};

const styles = StyleSheet.create({
  webView: {
    flex: 1,
    backgroundColor: 'transparent',
  },
});

export default SankeyChartWebView;
