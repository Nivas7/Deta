import { useAppDispatch, useAppSelector } from '@/state/hooks';
import { loadApplicationsAsync } from '@/state/jobSlice';
import { JobStatus, SankeyLink, SankeyNode, Totals } from '@/types';
import { statusPathMap } from '@/utils/constant';
import { useCallback, useMemo, useState } from 'react';

export default function useAnalytics() {
  const dispatch = useAppDispatch();
  const applications = useAppSelector(state => state.jobs.applications);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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

    const sankeyNodes: SankeyNode[] = Array.from(nodesSet).map(name => ({ id: name, name }));
    const nodeNameToIndexMap = new Map(sankeyNodes.map((node, i) => [node.name, i]));

    const sankeyLinks: SankeyLink[] = Array.from(linkMap.entries())
      .map(([key, value]) => {
        const [sourceName, targetName] = key.split('->');
        const sourceIndex = nodeNameToIndexMap.get(sourceName);
        const targetIndex = nodeNameToIndexMap.get(targetName);

        if (sourceIndex === undefined || targetIndex === undefined) {
          console.warn(`Sankey data warning: Missing node for link "${key}".`);
          return null;
        }

        return { source: sourceIndex, target: targetIndex, value } as SankeyLink;
      })
      .filter((link): link is SankeyLink => link !== null);

    return { nodes: sankeyNodes, links: sankeyLinks };
  }, [applications]);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      await dispatch(loadApplicationsAsync()).unwrap();
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load analytics data.';
      setError(errorMessage);
      console.error('Analytics refresh error:', err);
    } finally {
      setLoading(false);
    }
  }, [dispatch]);


  const totals: Totals = useMemo(() => {
    const total = applications.length;

    const statusCounts = applications.reduce((acc, app) => {
      acc[app.status as JobStatus] = (acc[app.status as JobStatus] || 0) + 1;
      return acc;
    }, {} as Partial<Record<JobStatus, number>>);

    return {
      total,
      ...statusCounts,
    };
  }, [applications]);

  return { nodes, links, loading, error, refresh, totals };
}
