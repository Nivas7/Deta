import SankeyChartWebView from '@/presentation/components/SankeyChart';
import useAnalytics from '@/viewmodels/useAnalytics';
import React, { useEffect } from 'react';
import { ActivityIndicator, Button, StyleSheet, Text, View } from 'react-native';

export default function AnalyticsScreen() {
  const { nodes, links, loading, refresh } = useAnalytics();
  console.log('AnalyticsScreen nodes:', nodes);
  console.log('AnalyticsScreen links:', links);

  useEffect(() => {
    refresh();
  }, []);
  return (
    <View style={styles.container}>
      <Button title="Refresh" onPress={refresh} />
      {loading ? (
        <ActivityIndicator size="large" style={{ marginTop: 20 }} />
      ) : nodes.length > 0 && links.length > 0 ? (
        <View style={styles.chartContainer}>
          <SankeyChartWebView nodes={nodes} links={links} />
        </View>
      ) : (
        <Text>No analytics data available. Tap refresh to load.</Text>
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
  chartContainer: {
    flex: 1,
    marginTop: 20,
    backgroundColor: 'lightblue',
  },
  noDataText: {
    textAlign: 'center',
    marginTop: 50,
    fontSize: 16,
    color: '#666',
  }
});
