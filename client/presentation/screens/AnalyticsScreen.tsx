
import SankeyChartWebView from '@/presentation/components/SankeyChart';
import useAnalytics from '@/viewmodels/useAnalytics';
import React, { useEffect } from 'react';
import { ActivityIndicator, Button, StyleSheet, Text, View } from 'react-native';

export default function AnalyticsScreen() {
  const { nodes, links, loading, refresh, totals } = useAnalytics();

  useEffect(() => {
    refresh();
  }, []);

  console.log('totals', totals);

  return (
    <View style={styles.container}>
      <Button title="Refresh" onPress={refresh} />
      {loading ? (
        <ActivityIndicator size="large" style={{ marginTop: 20 }} />
      ) : nodes.length > 0 && links.length > 0 ? (
        <>
          <View style={styles.summaryBox}>
            <Text style={styles.summaryTitle}>📊 Summary</Text>
            <Text>Total Applications: {totals.total}</Text>
            <Text>Accepted: {totals['Accepted'] || 0}</Text>
            <Text>Rejected: {totals['Rejected'] || 0}</Text>
            <Text>Withdrawn: {totals['Withdrawn'] || 0}</Text>
          </View>

          <View style={styles.chartContainer}>
            <SankeyChartWebView nodes={nodes} links={links} />
          </View>
        </>
      ) : (
        <Text style={styles.noDataText}>No analytics data available. Tap refresh to load.</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
    paddingHorizontal: 16,
    backgroundColor: '#f0f0f0',
  },
  summaryBox: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginTop: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  chartContainer: {
    flex: 1,
    marginTop: 20,
    backgroundColor: '#fff',
    borderRadius: 8,
    overflow: 'hidden',
  },
  noDataText: {
    textAlign: 'center',
    marginTop: 50,
    fontSize: 16,
    color: '#666',
  },
});
