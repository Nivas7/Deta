// src/presentation/components/SankeyChart.tsx
import React from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
import { WebView } from 'react-native-webview';

// Get screen dimensions to ensure WebView takes full available space
const { width, height } = Dimensions.get('window');

interface SankeyChartWebViewProps {
  flows: string; // Example: "A -> B:5\nB -> C:3"
}

export const SankeyChartWebView: React.FC<SankeyChartWebViewProps> = ({ flows }) => {
  // Escape backticks within the flows string for JavaScript template literal
  const escapedFlows = flows.replace(/`/g, '\\`');

  const htmlContent = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Sankey Diagram</title>
      <script src="https://d3js.org/d3.v7.min.js"></script>
      <script src="https://cdn.jsdelivr.net/npm/d3-sankey@0.12.3/dist/d3-sankey.min.js"></script>
      <style>
        body { font-family: sans-serif; margin: 0; overflow: hidden; height: 100vh; width: 100vw; }
        svg { width: 100%; height: 100%; display: block; }
      </style>
    </head>
    <body>
      <svg id="sankey"></svg>
      <script type="text/javascript">
        const input = \`${escapedFlows}\`;

        function parseFlows(input) {
          const lines = input.trim().split('\\n');
          let nodesSet = new Set();
          const links = [];

          lines.forEach(line => {
            // Regex expects "Source -> Target:Value" (no space after colon)
            const match = line.match(/^(.+?)\\s*->\\s*(.+?):(\\d+)$/);
            if (match) {
              const [, source, target, value] = match;
              nodesSet.add(source.trim());
              nodesSet.add(target.trim());
              links.push({
                source: source.trim(),
                target: target.trim(),
                value: +value
              });
            } else if (line.trim() !== '') { // Only warn for non-empty malformed lines
              console.warn("Sankey: Skipping malformed line (does not match 'Source -> Target:Value'):", line);
            }
          });

          const nodes = Array.from(nodesSet).map(name => ({ name }));
          const nodeIndex = new Map(nodes.map((n, i) => [n.name, i]));
          links.forEach(l => {
            if (nodeIndex.has(l.source) && nodeIndex.has(l.target)) {
                l.source = nodeIndex.get(l.source);
                l.target = nodeIndex.get(l.target);
            } else {
                // This indicates a flow was parsed but its nodes aren't in the generated list.
                // Could happen if a flow is "A->B:5" but "A" or "B" never appeared as a source/target of another node.
                console.error("Sankey: Link references non-existent node. Source:", l.source, "Target:", l.target);
            }
          });

          return { nodes, links };
        }

        function drawSankey({nodes, links}) {
          const width = window.innerWidth;
          const height = window.innerHeight;

          const svg = d3.select("#sankey")
            .attr("width", width)
            .attr("height", height);
          svg.selectAll("*").remove(); // Clear previous content

          if (!nodes || nodes.length === 0 || !links || links.length === 0) {
              console.warn("No valid nodes or links to draw Sankey diagram.");
              // Display a message directly on the SVG if no data
              svg.append("text")
                  .attr("x", width / 2)
                  .attr("y", height / 2)
                  .attr("text-anchor", "middle")
                  .attr("fill", "#666")
                  .text("No valid flow data to display Sankey diagram.");
              return;
          }

          const sankeyGen = d3.sankey()
            .nodeWidth(22)
            .nodePadding(18)
            .extent([[1, 1], [width - 1, height - 6]]);

          try {
            const {nodes: layoutNodes, links: layoutLinks} = sankeyGen({
              nodes: nodes.map(d => Object.assign({}, d)),
              links: links.map(d => Object.assign({}, d))
            });

            const color = d3.scaleOrdinal(d3.schemeCategory10);

            // Links
            svg.append("g")
              .selectAll("path")
              .data(layoutLinks)
              .join("path")
                .attr("d", d3.sankeyLinkHorizontal())
                .attr("stroke", d => color(d.source.name))
                .attr("stroke-width", d => Math.max(1, d.width))
                .attr("fill", "none")
                .attr("opacity", 0.5);

            // Nodes
            const node = svg.append("g")
              .selectAll("g")
              .data(layoutNodes)
              .join("g")
                .attr("transform", d => \`translate(\${d.x0},\${d.y0})\`);

            node.append("rect")
              .attr("height", d => d.y1 - d.y0)
              .attr("width", sankeyGen.nodeWidth())
              .attr("fill", d => color(d.name));

            // Node text
            node.append("text")
              .attr("x", d => d.x0 < width / 2 ? sankeyGen.nodeWidth() + 8 : -8)
              .attr("y", d => (d.y1 - d.y0) / 2)
              .attr("dy", "0.35em")
              .attr("text-anchor", d => d.x0 < width / 2 ? "start" : "end")
              .text(d => \`\${d.name} (\${d.value})\`);

          } catch (e) {
            console.error("Error drawing Sankey diagram:", e);
            // Display an error message in the WebView
            svg.append("text")
                .attr("x", width / 2)
                .attr("y", height / 2)
                .attr("text-anchor", "middle")
                .attr("fill", "red")
                .text("Error rendering chart. Check console for details.");
          }
        }

        // Only attempt to draw if input is not empty
        if (input && input.trim() !== "") {
            const data = parseFlows(input);
            if (data.nodes.length > 0 && data.links.length > 0) {
                drawSankey(data);
            } else {
                console.warn("Parsed data is empty or invalid. No Sankey to draw.");
                d3.select("#sankey").append("text")
                    .attr("x", window.innerWidth / 2)
                    .attr("y", window.innerHeight / 2)
                    .attr("text-anchor", "middle")
                    .attr("fill", "#666")
                    .text("No valid flow data to display Sankey diagram.");
            }
        } else {
            console.warn("Flows input is empty. No Sankey to draw.");
             d3.select("#sankey").append("text")
                .attr("x", window.innerWidth / 2)
                .attr("y", window.innerHeight / 2)
                .attr("text-anchor", "middle")
                .attr("fill", "#666")
                .text("No flow data available. Track applications on the home screen.");
        }
      </script>
    </body>
    </html>
  `;

  return (
    <View style={styles.container}>
      <WebView
        originWhitelist={['*']}
        source={{ html: htmlContent }}
        style={{ flex: 1, height: height, width: width }} // Ensure WebView has explicit dimensions
        javaScriptEnabled
        bounces={false}
        scrollEnabled={false}
        onError={(syntheticEvent) => {
          const { nativeEvent } = syntheticEvent;
          console.warn('WebView error: ', nativeEvent.description);
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});