// src/screens/AnalyticsScreen.tsx
import { AppDispatch, RootState } from '@/app/store'; // <-- Import AppDispatch
import { Button } from '@/presentation/components/common/Button';
import { SankeyChartWebView } from '@/presentation/components/SankeyChart';
import { generateAndSetSankeyFlows } from '@/state/flowSlice';
import { useHome } from '@/viewmodels/useHome';
import React from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';

export default function AnalyticsScreen() {
    // Use the typed dispatch
    const dispatch = useDispatch<AppDispatch>(); // <-- Change here

    const { applications } = useHome();
    const { flowsInput, loadingFlows, errorFlows } = useSelector((state: RootState) => state.flows);

    const handleRefresh = () => {
        dispatch(generateAndSetSankeyFlows(applications));
    };

    return (
        <View style={styles.container}>
            {/* Refresh Button */}
            <Button
                title={loadingFlows ? "Refreshing..." : "Refresh Diagram"}
                onPress={handleRefresh}
                disabled={loadingFlows}
                style={styles.refreshButton}
            />

            {/* Loading Indicator */}
            {loadingFlows && (
                <View style={styles.loadingOverlay}>
                    <ActivityIndicator size="large" color="#0000ff" />
                    <Text style={styles.loadingText}>Generating diagram...</Text>
                </View>
            )}

            {/* Error Message */}
            {errorFlows && (
                <Text style={styles.errorText}>Error: {errorFlows}</Text>
            )}

            {/* Debug Display */}
            <Text style={styles.debugHeader}>Flows Data (for Debugging):</Text>
            <ScrollView style={styles.debugContainer}>
                <Text style={styles.debugText}>{flowsInput || 'No flow data generated yet.'}</Text>
            </ScrollView>
            <View style={styles.chartContainer}>
                <SankeyChartWebView flows={flowsInput} />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
        backgroundColor: '#f0f0f0',
    },
    refreshButton: {
        marginBottom: 10,
        alignSelf: 'center',
    },
    loadingOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000,
    },
    loadingText: {
        marginTop: 10,
        fontSize: 16,
        color: '#333',
    },
    errorText: {
        color: 'red',
        textAlign: 'center',
        marginBottom: 10,
        fontSize: 14,
    },
    debugHeader: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 5,
        color: '#333',
    },
    debugContainer: {
        height: 100,
        backgroundColor: '#fff',
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 5,
        padding: 8,
        marginBottom: 10,
    },
    debugText: {
        fontSize: 12,
        color: '#555',
        fontFamily: 'monospace',
    },
    chartContainer: {
        flex: 1,
    },
});