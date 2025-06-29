// screens/Flow.tsx

import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import SankeyDiagram from '../../components/SankeyDiagram';

export default function Flow() {
    // 🔥 Dummy applications data
    const applications = [
        { status: 'Applied' },
        { status: 'Screening' },
        { status: 'Interview' },
        { status: 'Interview' },
        { status: 'Rejected' },
        { status: 'Ghosted' },
        { status: 'Accepted' },
    ];

    // Aggregate by status
    const statusCounts: { [status: string]: number } = {};
    applications.forEach((app) => {
        const status = app.status?.trim() || 'Unknown';
        statusCounts[status] = (statusCounts[status] || 0) + 1;
    });

    // Ensure 'Applied' always exists for root node
    if (!statusCounts['Applied']) {
        statusCounts['Applied'] = applications.length;
    }

    // Ordered flow
    const ordered = [
        'Applied',
        'Screening',
        'Interview',
        'Offer',
        'Accepted',
        'Rejected',
        'Ghosted',
    ];

    const orderedNodes = ordered.filter(
        (status) => statusCounts[status] && statusCounts[status] > 0
    );

    const transitions = [];
    for (let i = 0; i < orderedNodes.length - 1; i++) {
        transitions.push({
            source: orderedNodes[i],
            target: orderedNodes[i + 1],
            value: Math.min(
                statusCounts[orderedNodes[i]],
                statusCounts[orderedNodes[i + 1]]
            ),
        });
    }

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#F5F7FA' }}>
            <ScrollView contentContainerStyle={styles.container}>
                <Text style={styles.title}>Application Flow</Text>
                {applications.length === 0 ? (
                    <Text style={styles.emptyText}>
                        No applications to visualize yet.
                    </Text>
                ) : (
                    <View style={styles.diagramWrapper}>
                        <SankeyDiagram data={statusCounts} transitions={transitions} />
                    </View>
                )}
                <Text style={styles.caption}>
                    Each flow shows the number of applications in each status.
                </Text>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        padding: 24,
        flexGrow: 1,
        backgroundColor: '#F5F7FA',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#1D3D47',
        marginBottom: 18,
        letterSpacing: 0.5,
    },
    diagramWrapper: {
        backgroundColor: '#fff',
        borderRadius: 18,
        padding: 18,
        shadowColor: '#1D3D47',
        shadowOpacity: 0.08,
        shadowRadius: 12,
        elevation: 2,
        marginBottom: 18,
    },
    emptyText: {
        color: '#A1CEDC',
        fontSize: 18,
        fontWeight: '500',
        marginTop: 32,
        marginBottom: 32,
        letterSpacing: 0.5,
    },
    caption: {
        color: '#888',
        fontSize: 14,
        marginTop: 8,
        textAlign: 'center',
    },
});


