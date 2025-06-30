import React, { useState } from 'react';
import { View, Text, ScrollView, RefreshControl } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import { useJobs } from '@/hooks/useJobs';
import { globalStyles } from '@/styles/global';
import { Button } from '@/components/common/Button';
import { JobCard } from '@/components/card/cards';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function HomeScreen() {
  const { applications, loading, updateApplicationStatus, deleteApplication, refresh } = useJobs();
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    await refresh();
    setRefreshing(false);
  };

  const handleDeleteJob = (id: string) => {
    deleteApplication(id);
  };

  const recentApplications = applications.slice(0, 5);
  const hasApplications = applications.length > 0;

  return (
    <ScrollView
      style={globalStyles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <View style={globalStyles.content}>
        {/* Welcome Section */}
        <View style={globalStyles.card}>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
            <Ionicons name="briefcase-outline" size={24} color="#3B82F6" />
            <Text style={[globalStyles.header, { marginLeft: 12, marginBottom: 0, fontSize: 24 }]}>
              Welcome Back!
            </Text>
          </View>
          <Text style={globalStyles.subHeader}>
            {hasApplications
              ? `You have ${applications.length} job applications tracked`
              : 'Start tracking your job applications today'
            }
          </Text>

          <Button
            title="Add New Application"
            onPress={() => router.push('/modal/add-job')}
            style={{ marginTop: 12 }}
            disabled={false}
          />
        </View>

        {/* Quick Stats */}
        {hasApplications && (
          <View style={globalStyles.card}>
            <Text style={[globalStyles.header, { fontSize: 20, marginBottom: 16 }]}>
              Quick Overview
            </Text>
            <View style={globalStyles.statsContainer}>
              <View style={globalStyles.statCard}>
                <Text style={globalStyles.statNumber}>{applications.length}</Text>
                <Text style={globalStyles.statLabel}>Total Applications</Text>
              </View>
              <View style={globalStyles.statCard}>
                <Text style={globalStyles.statNumber}>
                  {applications.filter(app => app.status === 'Applied').length}
                </Text>
                <Text style={globalStyles.statLabel}>Pending</Text>
              </View>
              <View style={globalStyles.statCard}>
                <Text style={globalStyles.statNumber}>
                  {applications.filter(app => app.status === 'Interviewed').length}
                </Text>
                <Text style={globalStyles.statLabel}>Interviewed</Text>
              </View>
              <View style={globalStyles.statCard}>
                <Text style={globalStyles.statNumber}>
                  {applications.filter(app => app.status === 'Accepted').length}
                </Text>
                <Text style={globalStyles.statLabel}>Accepted</Text>
              </View>
            </View>
          </View>
        )}

        {/* Recent Applications */}
        {hasApplications ? (
          <View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <Text style={[globalStyles.header, { fontSize: 20, marginBottom: 0 }]}>
                Recent Applications
              </Text>
              <Button
                title="View All"
                onPress={() => router.push('/history')}
                variant="secondary"
                style={{ paddingHorizontal: 16, paddingVertical: 8 }}
                disabled={false}
              />
            </View>

            {recentApplications.map(job => (
              <JobCard
                key={job.id}
                job={job}
                onStatusUpdate={updateApplicationStatus}
                onDelete={handleDeleteJob}
              />
            ))}
          </View>
        ) : (
          <View style={globalStyles.emptyState}>
            <Ionicons name="document-text-outline" size={64} color="#9CA3AF" />
            <Text style={globalStyles.emptyStateText}>No Applications Yet</Text>
            <Text style={globalStyles.emptyStateSubtext}>
              Start by adding your first job application to track your progress and visualize your journey.
            </Text>
            <Button
              title="Add Your First Application"
              onPress={() => router.push('/modal/add-job')}
              disabled={false}
            />
          </View>
        )}
      </View>
    </ScrollView>
  );
}
