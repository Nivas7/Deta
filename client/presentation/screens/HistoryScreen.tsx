import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { RefreshControl, ScrollView, Text, TouchableOpacity, View } from 'react-native';

import { JobCard } from '@/presentation/components/card/cards';
import { Button } from '@/presentation/components/common/Button';
import { globalStyles } from '@/styles/global';
import { JobStatus } from '@/types';
import { STATUS_OPTIONS } from '@/utils/constant';
import { useHistory } from '@/viewmodels/useHistory';

export default function HistoryScreen() {
  const {
    applications,
    loading,
    refreshing,
    refresh,
    deleteApplication,
    updateApplicationStatus,
    setRefreshing,
  } = useHistory();

  const [filterStatus, setFilterStatus] = useState<JobStatus | 'All'>('All');

  const onRefresh = async () => {
    await refresh();
  };

  const filteredApplications = filterStatus === 'All'
    ? applications
    : applications.filter(app => app.status === filterStatus);

  const sortedApplications = [...filteredApplications].sort((a, b) =>
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  return (
    <ScrollView
      style={globalStyles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <View style={globalStyles.content}>
        {/* Header */}
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <View>
            <Text style={globalStyles.header}>Application History</Text>
            <Text style={globalStyles.subHeader}>
              {applications.length} total applications
            </Text>
          </View>
          <Button
            title="Add New"
            onPress={() => router.push('/AddJobScreen')}
            style={{ paddingHorizontal: 16, paddingVertical: 8 }}
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
            {/* Filter Pills */}
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={{ marginBottom: 20 }}
              contentContainerStyle={{ paddingHorizontal: 4 }}
            >
              <TouchableOpacity
                style={{
                  paddingHorizontal: 16,
                  paddingVertical: 8,
                  borderRadius: 20,
                  backgroundColor: filterStatus === 'All' ? '#3B82F6' : '#F1F5F9',
                  marginRight: 8,
                }}
                onPress={() => setFilterStatus('All')}
              >
                <Text style={{
                  color: filterStatus === 'All' ? '#FFFFFF' : '#64748B',
                  fontWeight: '600',
                  fontSize: 14,
                }}>
                  All ({applications.length})
                </Text>
              </TouchableOpacity>

              {STATUS_OPTIONS.map(status => {
                const count = applications.filter(app => app.status === status).length;
                if (count === 0) return null;

                return (
                  <TouchableOpacity
                    key={status}
                    style={{
                      paddingHorizontal: 16,
                      paddingVertical: 8,
                      borderRadius: 20,
                      backgroundColor: filterStatus === status ? '#3B82F6' : '#F1F5F9',
                      marginRight: 8,
                    }}
                    onPress={() => setFilterStatus(status)}
                  >
                    <Text style={{
                      color: filterStatus === status ? '#FFFFFF' : '#64748B',
                      fontWeight: '600',
                      fontSize: 14,
                    }}>
                      {status} ({count})
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>

            {/* Applications List */}
            <Text style={{
              fontSize: 16,
              fontWeight: '600',
              color: '#374151',
              marginBottom: 12
            }}>
              {filterStatus === 'All' ? 'All Applications' : `${filterStatus} Applications`} ({filteredApplications.length})
            </Text>

            {sortedApplications.map(job => (
              <JobCard
                key={job.id}
                job={job}
                onStatusUpdate={updateApplicationStatus}
                onDelete={deleteApplication}
              />
            ))}
          </>
        )}
      </View>
    </ScrollView>
  );
}
