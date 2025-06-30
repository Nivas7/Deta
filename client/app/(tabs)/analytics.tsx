import React, { useState } from 'react';
import { View, Text, ScrollView, RefreshControl } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { useJobs } from '@/hooks/useJobs';
import { globalStyles } from '@/styles/global';
import { SankeyDiagram } from '@/components/charts/SankeyDiagram';
import { STATUS_COLORS } from '@/constants';

export default function AnalyticsScreen() {
    const { applications, getStatusCounts, getSuccessRate, refresh } = useJobs();
    const [refreshing, setRefreshing] = useState(false);

    const onRefresh = async () => {
        setRefreshing(true);
        await refresh();
        setRefreshing(false);
    };

    const statusCounts = getStatusCounts();
    const successRate = getSuccessRate();

    return (
        <ScrollView
            style={globalStyles.container}
            refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
        >
            <View style={globalStyles.content}>
                <Text style={globalStyles.header}>Analytics Dashboard</Text>
                <Text style={globalStyles.subHeader}>
                    Visualize your job search progress and patterns
                </Text>

                {applications.length === 0 ? (
                    <View style={globalStyles.emptyState}>
                        <Ionicons name="analytics-outline" size={64} color="#9CA3AF" />
                        <Text style={globalStyles.emptyStateText}>No Data Available</Text>
                        <Text style={globalStyles.emptyStateSubtext}>
                            Add some job applications to see analytics and flow diagrams of your job search journey.
                        </Text>
                    </View>
                ) : (
                    <>
                        {/* Key Metrics */}
                        <View style={globalStyles.card}>
                            <Text style={[globalStyles.header, { fontSize: 20, marginBottom: 16 }]}>
                                Key Metrics
                            </Text>
                            <View style={globalStyles.statsContainer}>
                                <View style={globalStyles.statCard}>
                                    <Text style={globalStyles.statNumber}>{applications.length}</Text>
                                    <Text style={globalStyles.statLabel}>Total Applications</Text>
                                </View>
                                <View style={globalStyles.statCard}>
                                    <Text style={[globalStyles.statNumber, { color: '#10B981' }]}>
                                        {successRate}%
                                    </Text>
                                    <Text style={globalStyles.statLabel}>Success Rate</Text>
                                </View>
                                <View style={globalStyles.statCard}>
                                    <Text style={globalStyles.statNumber}>{statusCounts.Interviewed}</Text>
                                    <Text style={globalStyles.statLabel}>Interviews</Text>
                                </View>
                                <View style={globalStyles.statCard}>
                                    <Text style={[globalStyles.statNumber, { color: '#3B82F6' }]}>
                                        {statusCounts.Applied}
                                    </Text>
                                    <Text style={globalStyles.statLabel}>Pending</Text>
                                </View>
                            </View>
                        </View>

                        {/* Sankey Flow Diagram */}
                        <View style={globalStyles.card}>
                            <SankeyDiagram applications={applications} />
                        </View>

                        {/* Status Breakdown */}
                        <View style={globalStyles.card}>
                            <Text style={[globalStyles.header, { fontSize: 20, marginBottom: 16 }]}>
                                Status Breakdown
                            </Text>
                            {Object.entries(statusCounts).map(([status, count]) => {
                                if (count === 0) return null;
                                const percentage = Math.round((count / applications.length) * 100);

                                return (
                                    <View key={status} style={{ marginBottom: 12 }}>
                                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 }}>
                                            <Text style={{ fontSize: 14, fontWeight: '600', color: '#374151' }}>
                                                {status}
                                            </Text>
                                            <Text style={{ fontSize: 14, color: '#6B7280' }}>
                                                {count} ({percentage}%)
                                            </Text>
                                        </View>
                                        <View style={{
                                            height: 8,
                                            backgroundColor: '#F1F5F9',
                                            borderRadius: 4,
                                            overflow: 'hidden',
                                        }}>
                                            <View style={{
                                                height: '100%',
                                                width: `${percentage}%`,
                                                backgroundColor: STATUS_COLORS[status as keyof typeof STATUS_COLORS],
                                                borderRadius: 4,
                                            }} />
                                        </View>
                                    </View>
                                );
                            })}
                        </View>

                        {/* Insights */}
                        <View style={globalStyles.card}>
                            <Text style={[globalStyles.header, { fontSize: 20, marginBottom: 16 }]}>
                                Insights
                            </Text>
                            <View style={{ gap: 12 }}>
                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                    <Ionicons name="trending-up" size={20} color="#10B981" />
                                    <Text style={{ marginLeft: 8, fontSize: 14, color: '#374151' }}>
                                        {statusCounts.Interviewed > 0
                                            ? `${Math.round((statusCounts.Interviewed / statusCounts.Applied) * 100)}% interview rate`
                                            : 'No interviews yet - keep applying!'
                                        }
                                    </Text>
                                </View>

                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                    <Ionicons name="time" size={20} color="#F59E0B" />
                                    <Text style={{ marginLeft: 8, fontSize: 14, color: '#374151' }}>
                                        Most recent application: {applications.length > 0 ? new Date(applications[applications.length - 1].dateApplied).toLocaleDateString() : 'N/A'}
                                    </Text>
                                </View>

                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                    <Ionicons name="checkmark-circle" size={20} color="#3B82F6" />
                                    <Text style={{ marginLeft: 8, fontSize: 14, color: '#374151' }}>
                                        {statusCounts.Accepted > 0
                                            ? `${statusCounts.Accepted} offer${statusCounts.Accepted > 1 ? 's' : ''} received`
                                            : 'Keep going - your next offer is coming!'
                                        }
                                    </Text>
                                </View>
                            </View>
                        </View>
                    </>
                )}
            </View>
        </ScrollView>
    );
}