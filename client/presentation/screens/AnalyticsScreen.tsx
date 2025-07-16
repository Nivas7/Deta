import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import useAnalytics from '@/viewmodels/useAnalytics';
import SankeyChart from '@/presentation/components/SankeyChart';
import { JobStatus } from '@/types';
import { STATUS_COLORS } from '@/utils/constant';

const AnalyticsScreen: React.FC = () => {
  const { nodes, links, loading, error, refresh, totals } = useAnalytics();

  useEffect(() => {
    refresh();
  }, [refresh]);

  const conversionRates = React.useMemo(() => {
    const rates: { [key: string]: string } = {};
    links.forEach((link) => {
      const sourceNode = nodes[link.source as number];
      const targetNode = nodes[link.target as number];
      const sourceValue = sourceNode?.value ?? 1;
      const rate = ((link.value / sourceValue) * 100).toFixed(1);
      rates[`${sourceNode?.name} -> ${targetNode?.name}`] = `${rate}%`;
    });
    return rates;
  }, [nodes, links]);

  const statusData = Object.entries(totals)
    .filter(([key]) => key !== 'total')
    .map(([status, count]) => ({ status: status as JobStatus, count: count as number }))
    .sort((a, b) => b.count - a.count);

  if (loading) {
    return (
      <View style={styles.centered}>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>Error: {error}</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <Text style={styles.header}>Application Analytics</Text>

      {/* Summary Stats */}
      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{totals.total}</Text>
          <Text style={styles.statLabel}>Total Applications</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={[styles.statValue, { color: STATUS_COLORS['Accepted'] }]}>
            {totals.Accepted ?? 0}
          </Text>
          <Text style={styles.statLabel}>Accepted</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={[styles.statValue, { color: STATUS_COLORS['Offered'] }]}>
            {totals['Offered'] ?? 0}
          </Text>
          <Text style={styles.statLabel}>Offered</Text>
        </View>
      </View>

      {/* Status Breakdown */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Status Breakdown</Text>
        {statusData.length > 0 ? (
          statusData.map((item) => (
            <View key={item.status} style={styles.statusItem}>
              <Text style={[styles.statusText, { color: STATUS_COLORS[item.status] }]}>
                {item.status}
              </Text>
              <Text style={[styles.statusCount, { color: STATUS_COLORS[item.status] }]}>
                {item.count}
              </Text>
            </View>
          ))
        ) : (
          <Text style={styles.emptyText}>No status data available</Text>
        )}
      </View>

      {/* Conversion Rates */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Conversion Rates</Text>
        {Object.entries(conversionRates).length > 0 ? (
          Object.entries(conversionRates).map(([key, value]) => (
            <View key={key} style={styles.conversionItem}>
              <Text style={styles.conversionText}>{key}</Text>
              <Text style={styles.conversionValue}>{value}</Text>
            </View>
          ))
        ) : (
          <Text style={styles.emptyText}>No conversion data available</Text>
        )}
      </View>

      {/* Sankey Chart */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Application Flow</Text>
        <SankeyChart nodes={nodes} links={links} />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 32,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  statCard: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    flex: 1,
    marginHorizontal: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  statLabel: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  section: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  statusItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  statusText: {
    fontSize: 16,
  },
  statusCount: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  conversionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  conversionText: {
    fontSize: 16,
    color: '#333',
  },
  conversionValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#28a745',
  },
  emptyText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    paddingVertical: 8,
  },
  loadingText: {
    fontSize: 18,
    color: '#333',
  },
  errorText: {
    fontSize: 18,
    color: '#d32f2f',
  },
});

export default AnalyticsScreen;
