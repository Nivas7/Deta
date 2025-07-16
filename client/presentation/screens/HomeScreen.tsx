import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useEffect, useRef } from 'react';
import { Animated, FlatList, RefreshControl, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { JobCard } from '@/presentation/components/card/cards';
import { Button } from '@/presentation/components/common/Button';
import { globalStyles } from '@/styles/global';
import { JobApplication } from '@/types';
import { STATUS_COLORS } from '@/utils/constant';
import { useHome } from '@/viewmodels/useHome';

export default function HomeScreen() {
  const { applications, loading, error, refresh, updateStatus, deleteJob } = useHome();
  const recentApplications = applications.slice(0, 5);
  const hasApplications = applications.length > 0;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);

  if (error) {
    return (
      <SafeAreaView style={[globalStyles.container, { flex: 1 }]}>
        <View style={[globalStyles.content, { flex: 1, justifyContent: 'center', alignItems: 'center' }]}>
          <Text style={[globalStyles.header, { color: '#d32f2f', fontSize: 18 }]}>
            Error: {error}
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[globalStyles.container, { flex: 1 }]}>
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={refresh} />
        }
        contentContainerStyle={[globalStyles.content, { flexGrow: 1, padding: 16 }]}
      >
        <View style={globalStyles.card}>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
            <Ionicons name="briefcase-outline" size={24} color="#3B82F6" />
            <Text style={[globalStyles.header, { marginLeft: 12, fontSize: 24 }]}>
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
            onPress={() => router.push('/AddJobScreen')}
            disabled={false}
            style={{ marginTop: 12 }}
          />
        </View>

        {hasApplications && (
          <View style={globalStyles.card}>
            <Text style={[globalStyles.header, { fontSize: 20, marginBottom: 16 }]}>
              Quick Overview
            </Text>
            <View style={globalStyles.statsContainer}>
              <View style={globalStyles.statCard}>
                <Ionicons name="briefcase-outline" size={20} color="#3B82F6" style={{ marginBottom: 4 }} />
                <Text style={globalStyles.statNumber}>{applications.length}</Text>
                <Text style={globalStyles.statLabel}>Total Applications</Text>
              </View>
              <View style={globalStyles.statCard}>
                <Ionicons name="close-circle-outline" size={20} color={STATUS_COLORS['Rejected']} style={{ marginBottom: 4 }} />
                <Text style={[globalStyles.statNumber, { color: STATUS_COLORS['Rejected'] }]}>
                  {applications.filter((app: JobApplication) => app.status === 'Rejected').length}
                </Text>
                <Text style={globalStyles.statLabel}>Rejected</Text>
              </View>
              <View style={globalStyles.statCard}>
                <Ionicons name="checkmark-circle-outline" size={20} color={STATUS_COLORS['Accepted']} style={{ marginBottom: 4 }} />
                <Text style={[globalStyles.statNumber, { color: STATUS_COLORS['Accepted'] }]}>
                  {applications.filter((app: JobApplication) => app.status === 'Accepted').length}
                </Text>
                <Text style={globalStyles.statLabel}>Accepted</Text>
              </View>
            </View>
          </View>
        )}

        {hasApplications ? (
          <View>
            <FlatList
              data={recentApplications}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <JobCard
                  job={item}
                  onStatusUpdate={updateStatus}
                  onDelete={deleteJob}
                />
              )}
              scrollEnabled={false}
              ListHeaderComponent={
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                  <Text style={[globalStyles.header, { fontSize: 20 }]}>
                    Recent Applications
                  </Text>
                  <Button
                    title="View All"
                    onPress={() => router.push('/history')}
                    variant="secondary"
                    disabled={false}
                    style={{ marginTop: 8 }}
                  />
                </View>
              }
            />
          </View>
        ) : (
          <Animated.View style={[globalStyles.emptyState, { opacity: fadeAnim }]}>
            <Ionicons name="document-text-outline" size={80} color="#9CA3AF" />
            <Text style={globalStyles.emptyStateText}>No Applications Yet</Text>
            <Text style={globalStyles.emptyStateSubtext}>
              Start by adding your first job application to track your progress.
            </Text>
            <Button
              title="Add Your First Application"
              onPress={() => router.push('/AddJobScreen')}
              disabled={false}
            />
          </Animated.View>
        )}

        <View style={globalStyles.card}>
          <Text style={[globalStyles.header, { fontSize: 20, marginBottom: 8 }]}>
            Visualize Your Application Journey 📈
          </Text>
          <Text style={globalStyles.subHeader}>
            View a Sankey diagram of your job application stages.
          </Text>
          <Button
            title="Go to Analytics"
            onPress={() => router.push('/Analytics')}
            style={{ marginTop: 20 }}
            disabled={!hasApplications}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
