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
            overflow: auto;
            font-family: sans-serif;
            background: #f9f9f9;
          }
          #sankey-container {
            width: 120vw;
            height: 150vw;
            display: flex;
            justify-content: center;
            align-items: center;
          } 
          svg {
            background: #ffffff;
            border-radius: 8px;
          }
          .node rect {
            stroke: #333;
          }
          .node text {
            font-size: 14px;
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
          const originalLog = console.log;
          const originalError = console.error;

          console.log = (...args) => {
              originalLog(...args);
              if (window.ReactNativeWebView) {
                  window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'log', message: args.join(' ') }));
              }
          };

          console.error = (...args) => {
              originalError(...args);
              if (window.ReactNativeWebView) {
                  window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'error', message: args.join(' '), stack: new Error().stack }));
              }
          };

          window.onerror = function(message, source, lineno, colno, error) {
              console.error('Unhandled JS Error:', message, source, lineno, colno, error ? error.stack : 'no stack');
              return true;
          };


          if (typeof d3 === 'undefined') {
              console.error('WebView JS: D3.js is NOT loaded!');
          } else {
              console.log('WebView JS: D3.js loaded successfully.');
          }
          if (typeof d3.sankey === 'undefined') {
              console.error('WebView JS: d3-sankey is NOT loaded!');
          } else {
              console.log('WebView JS: d3-sankey loaded successfully.');
          }

          const initialNodes = ${initialNodesJson};
          const initialLinks = ${initialLinksJson};

          console.log('WebView JS: Initial Nodes received:', initialNodes);
          console.log('WebView JS: Initial Links received:', initialLinks);

          const svg = d3.select("#sankey-chart");

          function drawSankey({nodes, links}) {
            console.log('WebView JS: drawSankey function called.');
            console.log('WebView JS: Nodes for drawing:', nodes);
            console.log('WebView JS: Links for drawing:', links);

            svg.selectAll("*").remove();

            const container = d3.select("#sankey-container");
            const width = Math.min(800, container.node() ? container.node().getBoundingClientRect().width : window.innerWidth);
            const height = Math.min(400, container.node() ? container.node().getBoundingClientRect().height : window.innerHeight);

            svg.attr("width", width)
               .attr("height", height)
               .attr("viewBox", [0, 0, width, height]);


             const sankeyGen = d3.sankey()
              .nodeWidth(20)
              .nodePadding(20)
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
              .attr("height", d => Math.max(1, d.y1 - d.y0))
              .attr("width", sankeyGen.nodeWidth())
              .attr("fill", d => color(d.name || d.id))
              .attr("rx", 4) // Rounded corners for nodes
              .attr("ry", 4);

            node.append("text")
              .attr("x", d => d.x0 < width / 2 ? sankeyGen.nodeWidth() + 6 : -6)
              .attr("y", d => (d.y1 - d.y0) / 2)
              .attr("dy", "0.35em")
              .attr("text-anchor", d => d.x0 < width / 2 ? "start" : "end")
              .text(d => \`\${d.name} (\${d.value})\`);

            console.log('WebView JS: Sankey chart drawn.');
          }

          drawSankey({nodes: initialNodes, links: initialLinks});

          window.updateChart = (newNodes, newLinks) => {
            console.log('WebView JS: updateChart received new data:', newNodes, newLinks);
            drawSankey({ nodes: newNodes, links: newLinks });
          };
          console.log('WebView JS: updateChart function exposed.');

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
      javaScriptEnabled={true}
      domStorageEnabled={true}
      allowFileAccess={true}
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
