// src/screens/HomeScreen.tsx
import { generateAndSetSankeyFlows } from '@/state/flowSlice'; // Import the new thunk
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import { RefreshControl, ScrollView, Text, View } from 'react-native'; // Removed StyleSheet, TextInput, Platform, TouchableOpacity
import { useDispatch } from 'react-redux';

import { AppDispatch } from '@/app/store';
import { JobCard } from '@/presentation/components/card/cards';
import { Button } from '@/presentation/components/common/Button';
import { globalStyles } from '@/styles/global';
import { JobApplication } from '@/types';
import { useHome } from '@/viewmodels/useHome';

export default function HomeScreen() {
  const {
    applications,
    loading,
    refresh,
    updateStatus,
    deleteJob
  } = useHome();

  const dispatch = useDispatch<AppDispatch>();

  const recentApplications = applications.slice(0, 5);
  const hasApplications = applications.length > 0;

  const handleDeleteJob = (id: string) => {
    deleteJob(id);
  };

  const handleGoToAnalytics = () => {
    // Dispatch the thunk with the current applications data
    // This dispatch now correctly understands thunks
    dispatch(generateAndSetSankeyFlows(applications));
    router.push('/Analytics');
  };

  return (
    <ScrollView
      style={globalStyles.container}
      refreshControl={
        <RefreshControl refreshing={loading} onRefresh={refresh} />
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
              : 'Start tracking your job applications today'}
          </Text>

          <Button
            title="Add New Application"
            onPress={() => router.push('/AddJobScreen')} // Navigates to a separate screen for adding jobs
            disabled={false}
            style={{ marginTop: 12 }}
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
                  {/* Keep filter for 'Applied' here for display, even if not a selectable status */}
                  {applications.filter((app) => app.status === 'Applied').length}
                </Text>
                <Text style={globalStyles.statLabel}>Applied</Text>
              </View>
              <View style={globalStyles.statCard}>
                <Text style={globalStyles.statNumber}>
                  {applications.filter((app) => app.status === 'Interviewed').length}
                </Text>
                <Text style={globalStyles.statLabel}>Interviewed</Text>
              </View>
              <View style={globalStyles.statCard}>
                <Text style={globalStyles.statNumber}>
                  {applications.filter((app) => app.status === 'Accepted').length}
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
                disabled={false}
                style={{ paddingHorizontal: 16, paddingVertical: 8 }}
              />
            </View>

            {recentApplications.map((job: JobApplication) => (
              <JobCard
                key={job.id}
                job={job}
                onStatusUpdate={updateStatus}
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
              disabled={false}
              title="Add Your First Application"
              onPress={() => router.push('/AddJobScreen')} // Navigates to add screen
            />
          </View>
        )}

        {/* Analytics Button */}
        <View style={globalStyles.card}>
          <Text style={[globalStyles.header, { fontSize: 20, marginBottom: 8 }]}>
            Visualize Your Application Journey 📈
          </Text>
          <Text style={globalStyles.subHeader}>
            Click below to see a Sankey diagram illustrating the flow of your job applications through different stages.
          </Text>
          <Button
            title="Go to Analytics"
            onPress={handleGoToAnalytics}
            style={{ marginTop: 20 }}
            disabled={!hasApplications}
          />
        </View>

      </View>
    </ScrollView>
  );
}