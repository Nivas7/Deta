import { JobApplication, JobStatus } from '@/types';
import { STATUS_COLORS, STATUS_OPTIONS } from '@/utils/constant';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Button } from '../common/Button';

interface JobCardProps {
  job: JobApplication;
  onStatusUpdate: (id: string, status: JobStatus) => void;
  onDelete: (id: string) => void;
}

export const JobCard: React.FC<JobCardProps> = ({ job, onStatusUpdate, onDelete }) => {
  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <Text style={styles.company}>{job.companyName}</Text>
          <Text style={styles.position}>{job.position}</Text>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: STATUS_COLORS[job.status] }]}>
          <Text style={styles.statusText}>{job.status}</Text>
        </View>
      </View>

      <Text style={styles.date}>Applied: {job.dateApplied}</Text>

      {job.notes ? (
        <Text style={styles.notes}>{job.notes}</Text>
      ) : null}

      <View style={styles.actions}>
        <View style={styles.statusActions}>
          {STATUS_OPTIONS.filter(status => status !== job.status).map(status => (
            <TouchableOpacity
              key={status}
              style={[styles.statusButton, { backgroundColor: STATUS_COLORS[status] }]}
              onPress={() => onStatusUpdate(job.id, status)}
              activeOpacity={0.8}
            >
              <Text style={styles.statusButtonText}>{status}</Text>
            </TouchableOpacity>
          ))}
        </View>
        <Button
          title="Delete"
          onPress={() => onDelete(job.id)}
          variant="danger"
          style={styles.deleteButton}
          disabled={false}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  titleContainer: {
    flex: 1,
  },
  company: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1E293B',
  },
  position: {
    fontSize: 14,
    color: '#64748B',
    marginTop: 2,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 16,
  },
  statusText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  date: {
    fontSize: 12,
    color: '#9CA3AF',
    marginBottom: 8,
  },
  notes: {
    fontSize: 14,
    color: '#4B5563',
    marginBottom: 12,
    fontStyle: 'italic',
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statusActions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    flex: 1,
    marginRight: 8,
  },
  statusButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  statusButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  deleteButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
});
