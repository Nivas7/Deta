import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
  RefreshControl,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { JobCard } from '@/presentation/components/card/cards';
import { Button } from '@/presentation/components/common/Button';
import { globalStyles } from '@/styles/global';
import { JobStatus } from '@/types';
import { STATUS_OPTIONS } from '@/utils/constant';
import { useHistory } from '@/viewmodels/useHistory';

export default function HistoryScreen() {
  const {
    applications,
    refreshing,
    refresh,
    deleteApplication,
    updateApplicationStatus,
  } = useHistory();

  const [filterStatus, setFilterStatus] = useState<JobStatus | 'All'>('All');

  const filteredApplications =
    filterStatus === 'All'
      ? applications
      : applications.filter((app) => app.status === filterStatus);

  const sortedApplications = [...filteredApplications].sort(
    (a, b) =>
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  return (
    <SafeAreaView style={globalStyles.container}>
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={refresh} />
        }
        contentContainerStyle={globalStyles.content}
      >
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 24,
          }}
        >
          <View>
            <Text style={globalStyles.header}>Application History</Text>
            <Text style={globalStyles.subHeader}>
              {applications.length} total applications
            </Text>
          </View>
          <Button
            title="Add New"
            onPress={() => router.push('/AddJobScreen')}
            style={{ paddingHorizontal: 20, paddingVertical: 10 }}
            disabled={false}
          />
        </View>

        {applications.length === 0 ? (
          <View style={globalStyles.emptyState}>
            <Ionicons name="folder-outline" size={64} color="#9CA3AF" />
            <Text style={globalStyles.emptyStateText}>No Applications Yet</Text>
            <Text style={globalStyles.emptyStateSubtext}>
              Your job applications will appear here once you start adding them.
            </Text>
            <Button
              title="Add Your First Application"
              onPress={() => router.push('/AddJobScreen')}
              disabled={false}
            />
          </View>
        ) : (
          <>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={{ marginBottom: 20 }}
              contentContainerStyle={{ paddingHorizontal: 4 }}
            >
              <FilterPill
                label={`All (${applications.length})`}
                active={filterStatus === 'All'}
                onPress={() => setFilterStatus('All')}
              />
              {STATUS_OPTIONS.map((status) => {
                const count = applications.filter(
                  (app) => app.status === status
                ).length;
                if (count === 0) return null;
                return (
                  <FilterPill
                    key={status}
                    label={`${status} (${count})`}
                    active={filterStatus === status}
                    onPress={() => setFilterStatus(status)}
                  />
                );
              })}
            </ScrollView>

            <Text
              style={{
                fontSize: 16,
                fontWeight: '600',
                color: '#374151',
                marginBottom: 12,
              }}
            >
              {filterStatus === 'All'
                ? 'All Applications'
                : `${filterStatus} Applications`} ({filteredApplications.length})
            </Text>

            {sortedApplications.map((job) => (
              <JobCard
                key={job.id}
                job={job}
                onStatusUpdate={updateApplicationStatus}
                onDelete={deleteApplication}
              />
            ))}
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const FilterPill = ({
  label,
  active,
  onPress,
}: {
  label: string;
  active: boolean;
  onPress: () => void;
}) => (
  <TouchableOpacity
    onPress={onPress}
    activeOpacity={0.8}
    style={{
      paddingHorizontal: 16,
      paddingVertical: 8,
      borderRadius: 20,
      backgroundColor: active ? '#3B82F6' : '#F1F5F9',
      marginRight: 8,
    }}
  >
    <Text
      style={{
        color: active ? '#FFFFFF' : '#64748B',
        fontWeight: '600',
        fontSize: 14,
      }}
    >
      {label}
    </Text>
  </TouchableOpacity>
);
