// src/viewmodels/useAnalytics.ts

import { useAppSelector } from '@/state/hooks';
import { SankeyLink, SankeyNode } from '@/types'; // Import your types
import { useCallback, useMemo, useState } from 'react';

// Define your status paths logic here, as it's the source of truth for your data
const statusPathMap = {
  "No Answer": ["Applications", "No Answer"],
  "Rejected": ["Applications", "Rejected"],
  "Interviews": ["Applications", "Interviews"],
  "Ghosted": ["Applications", "Interviews", "Ghosted"], // Ghosted after interview
  "No Offer": ["Applications", "Interviews", "No Offer"],
  "Offer": ["Applications", "Interviews", "Offers"],
  "Accepted": ["Applications", "Interviews", "Offers", "Accepted"],
  "Declined": ["Applications", "Interviews", "Offers", "Declined"],
  "Ghosted After Offer": ["Applications", "Interviews", "Offers", "Ghosted"] // Ghosted after offer
};

// Example raw application data (this would typically come from an API or local storage)

interface ApplicationData {
  id: string; // Unique ID for each application entry
  name: string; // Company name or application title
  status: keyof typeof statusPathMap; // Current status
}

const applications = useAppSelector(state => state.jobs.applications);

const init: ApplicationData[] = applications.map((app) => ({
  id: app.id,
  name: app.companyName,
  status: app.status as keyof typeof statusPathMap
}));


// Simulate some initial data
const initialApplications: ApplicationData[] = [
  { id: 'app1', name: 'Google', status: 'Interviews' },
  { id: 'app2', name: 'Facebook', status: 'Rejected' },
  { id: 'app3', name: 'Amazon', status: 'Offer' },
  { id: 'app4', name: 'Netflix', status: 'Accepted' },
  { id: 'app5', name: 'Microsoft', status: 'Ghosted' },
  { id: 'app6', name: 'Apple', status: 'Declined' },
  { id: 'app7', name: 'Spotify', status: 'No Answer' },
  { id: 'app8', name: 'Zoom', status: 'No Offer' },
  { id: 'app9', name: 'Slack', status: 'Interviews' },
  { id: 'app10', name: 'Stripe', status: 'Offer' },
  { id: 'app11', name: 'Stripe', status: 'Accepted' },
  { id: 'app12', name: 'Google', status: 'Interviews' },
];


const useAnalytics = () => {
  const [loading, setLoading] = useState(false);
  const [applications, setApplications] = useState<ApplicationData[]>([]);

  // Function to transform raw application data into Sankey nodes and links
  const { nodes, links } = useMemo(() => {
    const linkMap = new Map<string, number>();

    applications.forEach(app => {
      const path = statusPathMap[app.status];
      if (path) {
        for (let i = 0; i < path.length - 1; i++) {
          const key = `${path[i]}->${path[i + 1]}`;
          linkMap.set(key, (linkMap.get(key) || 0) + 1);
        }
      }
    });

    const nodesSet = new Set<string>();
    linkMap.forEach((_, key) => {
      const [source, target] = key.split('->');
      nodesSet.add(source);
      nodesSet.add(target);
    });

    // Convert Set of node names to SankeyNode objects
    const uniqueNodeNames = Array.from(nodesSet);
    const sankeyNodes: SankeyNode[] = uniqueNodeNames.map(name => ({ id: name, name: name }));

    // Create a map from node name to its index for links
    const nodeNameToIndexMap = new Map<string, number>(sankeyNodes.map((node, i) => [node.name, i]));

    // Convert linkMap to SankeyLink objects
    const sankeyLinks: SankeyLink[] = Array.from(linkMap.entries()).map(([key, value]) => {
      const [sourceName, targetName] = key.split('->');
      const sourceIndex = nodeNameToIndexMap.get(sourceName);
      const targetIndex = nodeNameToIndexMap.get(targetName);

      // Basic validation: ensure source and target nodes exist
      if (sourceIndex === undefined || targetIndex === undefined) {
        console.warn(`Sankey data warning: Missing node for link "${key}". Skipping this link.`);
        return null; // Return null for invalid links
      }

      return {
        source: sourceIndex,
        target: targetIndex,
        value: value
      };
    }).filter(link => link !== null) as SankeyLink[]; // Filter out nulls

    return { nodes: sankeyNodes, links: sankeyLinks };
  }, [applications]); // Recalculate whenever applications data changes

  // Simulate data fetching
  const refresh = useCallback(() => {
    setLoading(true);
    console.log('RN: Fetching analytics data...');
    // Simulate API call delay
    setTimeout(() => {
      // In a real app, you'd fetch data here
      setApplications(init); // Or updated data
      setLoading(false);
      console.log('RN: Analytics data fetched.');
    }, 1500); // 1.5 seconds delay
  }, []);

  return { nodes, links, loading, refresh };
};

export default useAnalytics;
