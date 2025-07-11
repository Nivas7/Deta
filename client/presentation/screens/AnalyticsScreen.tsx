// src/presentation/screens/AnalyticsScreen.tsx

import SankeyChartWebView from '@/presentation/components/SankeyChart';
import useAnalytics from '@/viewmodels/useAnalytics';
import React, { useEffect } from 'react';
import { ActivityIndicator, Button, StyleSheet, Text, View } from 'react-native';

export default function AnalyticsScreen() {
    const { nodes, links, loading, refresh } = useAnalytics();
    console.log('AnalyticsScreen nodes:', nodes);
    console.log('AnalyticsScreen links:', links);

    useEffect(() => {
        // Initial data fetch when the component mounts
        refresh();
    }, []); // Empty dependency array means this runs once on mount

    return (
        <View style={styles.container}>
            <Button title="Refresh" onPress={refresh} />
            {loading ? (
                <ActivityIndicator size="large" style={{ marginTop: 20 }} />
            ) : nodes.length > 0 && links.length > 0 ? (
                // Give chartContainer flex: 1 so it takes up available space
                <View style={styles.chartContainer}>
                    <SankeyChartWebView nodes={nodes} links={links} />
                </View>
            ) : (
                // You might want to add a message here if no data is available
                <Text>No analytics data available. Tap refresh to load.</Text>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1, // Crucial: Make the main container take full height
        paddingTop: 50,
        paddingHorizontal: 16,
        backgroundColor: '#f0f0f0', // Just for better visual debugging
    },
    chartContainer: {
        flex: 1, // Crucial: Make this container fill the remaining space
        marginTop: 20,
        // Add a background color for debugging to see its bounds
        backgroundColor: 'lightblue',
    },
    noDataText: {
        textAlign: 'center',
        marginTop: 50,
        fontSize: 16,
        color: '#666',
    }
});